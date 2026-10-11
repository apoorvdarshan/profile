"""Daily ASC download totals. Report history stays in the private resume repo.

Apple's most recent processingDate replaces the ENTIRE event-date partition,
including all segments. Never add overlapping daily instances or mix granularities.
"""
import copy
import csv
from datetime import date, datetime, timedelta, timezone
import gzip
import hashlib
import io
import json
import os
from pathlib import Path
import re
import time
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse, quote
from urllib.request import Request, urlopen
from concurrent.futures import ThreadPoolExecutor

API = 'https://api.appstoreconnect.apple.com/v1/'
METRICS = ('first_time', 'redownload')
TYPES = {'first-time download': 'first_time', 'redownload': 'redownload',
         'restore': 'restore', 'auto-update': 'updates', 'manual update': 'updates'}


def check(condition, message):
    if not condition:
        raise ValueError(message)


def zero():
    return dict.fromkeys(METRICS, 0)


def valid_date(value):
    date.fromisoformat(value)
    return value


def read_segments(blobs, app_id):
    """Sum all rows/segments within ONE instance, grouped by event date."""
    days = {}
    for blob in blobs:
        if blob[:2] == b'\x1f\x8b':
            blob = gzip.decompress(blob)
        reader = csv.DictReader(io.StringIO(blob.decode('utf-8-sig')), delimiter='\t')
        check(reader.fieldnames is not None, 'Empty report without a header')
        names = {n.strip().casefold(): n for n in reader.fieldnames}
        check(all(n in names for n in ('date', 'app apple identifier', 'download type', 'counts')),
              'Download report columns changed')
        for raw in reader:
            check(None not in raw and all(v is not None for v in raw.values()), 'Malformed TSV row')
            row = {k: raw[v].strip() for k, v in names.items()}
            check(row['app apple identifier'] == app_id, 'Report contains an unexpected app')
            day = valid_date(row['date'])
            count = int(row['counts'])
            check(count >= 0, 'Negative download count')
            kind = TYPES.get(row['download type'].casefold())
            check(kind is not None, 'Unknown download type; retain previous totals')
            counts = days.setdefault(day, zero())
            if kind in METRICS:
                counts[kind] += count
    return days


def merge_instance(days, incoming, processing_date, instance_id, snapshot=False):
    """Replace date partitions, not individual dimensions; input order is irrelevant."""
    valid_date(processing_date)
    rank = [processing_date, int(snapshot), instance_id]
    for day, counts in incoming.items():
        check(day <= processing_date, 'Report event date is after processing date')
        old = days.get(day)
        if old is None or rank > old['revision']:
            days[day] = {'revision': rank, 'counts': counts}


def totals(app, through):
    check(through >= app['baseline']['through'], 'Cutoff precedes the verified baseline')
    result = {k: app['baseline']['counts'].get(k, 0) for k in METRICS}
    for day, record in app['days'].items():
        if app['baseline']['through'] < day <= through:
            for key in METRICS:
                result[key] += record['counts'][key]
    return result


def badge(count):
    check(isinstance(count, int) and count >= 0, 'Invalid download total')
    if count < 10:
        return str(count)
    if count < 100:
        return f'{count // 10 * 10}+'
    if count < 1000:
        return f'{count // 100 * 100}+'
    if count < 1_000_000:
        return f'{count // 1000}K+'
    return f'{count // 1_000_000}M+'


def update_copy(readme, resume, apps, snapshot):
    """Only replace the existing download badge on each configured exact link."""
    for config in apps:
        item = snapshot['apps'][config['id']]
        label = item['badge']
        image = (f'<img alt="Downloads: {label}" src="https://img.shields.io/badge/'
                 f'%E2%86%93-{quote(label, safe="")}-8B1A1A?style=flat-square">')
        rows = readme.splitlines(keepends=True)
        matched = [i for i, line in enumerate(rows) if f'<strong><a href="{config["link"]}">' in line]
        check(len(matched) == 1, f'Expected one README entry for {config["name"]}')
        i = matched[0]
        rows[i], count = re.subn(r'<img\b[^>]*alt="Downloads: [^"]*"[^>]*>', lambda _: image, rows[i])
        check(count == 1, f'Missing/duplicate download badge for {config["name"]}')
        readme = ''.join(rows)
        rows = resume.splitlines(keepends=True)
        matched = [i for i, line in enumerate(rows)
                   if line.lstrip().startswith(r'\resumeProjectHeading') and
                   ('\\href{' + config['link'] + '}') in line]
        check(len(matched) == 1, f'Expected one resume entry for {config["name"]}')
        i = matched[0]
        rows[i], count = re.subn(r'(\\textcolor\{Maroon\}\{\$\\downarrow\$ )[^}]+',
                                 lambda m: m[1] + label, rows[i])
        check(count == 1, f'Missing/duplicate resume count for {config["name"]}')
        resume = ''.join(rows)
    return readme, resume


class Client:
    def __init__(self):
        import jwt
        self.jwt = jwt
        self.key = os.environ.get('ASC_REPORTS_PRIVATE_KEY')
        if not self.key and os.environ.get('ASC_REPORTS_PRIVATE_KEY_PATH'):
            self.key = Path(os.environ['ASC_REPORTS_PRIVATE_KEY_PATH']).read_text()
        self.key_id = os.environ.get('ASC_REPORTS_KEY_ID')
        self.issuer = os.environ.get('ASC_REPORTS_ISSUER_ID')
        check(all((self.key, self.key_id, self.issuer)), 'Missing ASC reporting credentials')

    def request(self, url, authenticated=False):
        parsed = urlparse(url)
        check(parsed.scheme == 'https' and parsed.hostname, 'Invalid report URL')
        headers = {'User-Agent': 'apoorvdarshan-profile-downloads'}
        if authenticated:
            check(parsed.hostname == 'api.appstoreconnect.apple.com', 'Unexpected ASC API host')
            now = int(time.time())
            token = self.jwt.encode({'iss': self.issuer, 'iat': now, 'exp': now + 600,
                                     'aud': 'appstoreconnect-v1'}, self.key, algorithm='ES256',
                                    headers={'kid': self.key_id, 'typ': 'JWT'})
            headers['Authorization'] = 'Bearer ' + token
        # Signed download URLs receive NO ASC Authorization header.
        for attempt in range(4):
            try:
                with urlopen(Request(url, headers=headers), timeout=60) as response:
                    return response.read()
            except HTTPError as error:
                if (error.code == 429 or error.code >= 500) and attempt < 3:
                    time.sleep(min(30, 2 ** (attempt + 1)))
                    continue
                raise RuntimeError(f'ASC {"API" if authenticated else "report"} HTTP {error.code}') from None
            except (URLError, TimeoutError):
                if attempt < 3:
                    time.sleep(2 ** (attempt + 1))
                    continue
                raise RuntimeError('ASC network request failed; keeping previous counts') from None

    def listing(self, path):
        url = API + path
        result, visited, expected = [], set(), None
        while url:
            check(url not in visited, 'Repeated ASC pagination cursor')
            visited.add(url)
            payload = json.loads(self.request(url, authenticated=True))
            check(isinstance(payload.get('data'), list) and not payload.get('errors'), 'Invalid ASC page')
            total = payload.get('meta', {}).get('paging', {}).get('total')
            if expected is None:
                expected = total
            check(total is None or total == expected, 'ASC list changed during pagination; retry')
            result.extend(payload['data'])
            url = payload.get('links', {}).get('next')
        check(expected is None or len(result) == expected, 'Incomplete ASC pagination')
        check(len({r['id'] for r in result}) == len(result), 'Duplicate ASC resource IDs')
        return result

    def instance(self, item, app_id):
        segments = self.listing(f'analyticsReportInstances/{item["id"]}/segments?limit=200')
        check(segments, 'Report instance has no downloadable segments yet')
        blobs = []
        for segment in segments:
            info = segment['attributes']
            blob = self.request(info['url'])
            check(len(blob) == info['sizeInBytes'], 'Truncated report segment')
            check(hashlib.md5(blob).hexdigest() == info['checksum'].lower(), 'Report checksum mismatch')
            blobs.append(blob)
        return read_segments(blobs, app_id)


def refresh_app(client, app_id, existing, today):
    app = copy.deepcopy(existing)
    complete_through = max(app.get('complete_through', app['baseline']['through']),
                           app.get('bootstrap', {}).get('through', app['baseline']['through']))
    requests = client.listing(f'apps/{app_id}/analyticsReportRequests?limit=200')
    ongoing = [r for r in requests if r['attributes']['accessType'] == 'ONGOING']
    check(len(ongoing) == 1 and not ongoing[0]['attributes']['stoppedDueToInactivity'],
          f'App {app_id} needs its ongoing report request reactivated by an Admin')
    # An outage longer than Apple's retention must not silently reduce lifetime totals.
    last = date.fromisoformat(app.get('checked_on', app['baseline']['through']))
    gap = (today - last).days
    recovered_through = None
    available_ids = set()
    for request in sorted(requests, key=lambda r: r['attributes']['accessType']):
        snapshot = request['attributes']['accessType'] == 'ONE_TIME_SNAPSHOT'
        if snapshot and request['id'] in app.get('imported_snapshots', []):
            continue
        reports = client.listing(f'analyticsReportRequests/{request["id"]}/reports?limit=200')
        standard = [r for r in reports if r['attributes']['name'].casefold() == 'app downloads standard']
        check(len(standard) <= 1, 'Ambiguous Standard downloads report')
        if not standard:
            check(snapshot, f'App {app_id} has no ongoing Standard downloads report')
            continue
        instances = client.listing(f'analyticsReports/{standard[0]["id"]}/instances?filter[granularity]=DAILY&limit=200')
        check(all(i['attributes']['granularity'] == 'DAILY' for i in instances), 'Mixed report granularities')
        if not instances:
            continue  # Zero-activity apps or a historical request still being generated.
        latest_processing = max(date.fromisoformat(i['attributes']['processingDate']) for i in instances)
        complete_through = max(complete_through, (latest_processing - timedelta(days=2)).isoformat())
        available_ids.update(i['id'] for i in instances)
        new = instances if snapshot else [i for i in instances if i['id'] not in app['seen_instances']]
        with ThreadPoolExecutor(max_workers=4) as executor:
            partitions = list(executor.map(lambda i: client.instance(i, app_id), new))
        snapshot_days = {}
        for instance, partition in zip(new, partitions):
            processing = instance['attributes']['processingDate']
            merge_instance(snapshot_days if snapshot else app['days'], partition, processing, instance['id'], snapshot)
            app['seen_instances'][instance['id']] = processing
        if snapshot and snapshot_days:
            # A generated one-time snapshot contains all available history since 2024.
            # Validate it includes the known app history before replacing the old baseline.
            check(min(snapshot_days) <= app['history_start'], 'Historical snapshot starts after known app history')
            check(max(snapshot_days) >= app['baseline']['through'], 'Historical snapshot predates baseline')
            for day, record in snapshot_days.items():
                if day not in app['days'] or record['revision'] > app['days'][day]['revision']:
                    app['days'][day] = record
            app['baseline'] = {'through': '2023-12-31', 'counts': zero(), 'source': 'Full ASC historical snapshot'}
            app.setdefault('imported_snapshots', []).append(request['id'])
            app['history_source'] = 'full ASC report history'
            recovered_through = latest_processing - timedelta(days=2)
    check(gap <= 32 or (recovered_through is not None and recovered_through >= today - timedelta(days=32)),
          f'App {app_id}: report retention gap; request a fresh historical snapshot with an Admin key')
    app['seen_instances'] = {key: value for key, value in app['seen_instances'].items() if key in available_ids}
    app['checked_on'] = today.isoformat()
    app['complete_through'] = min(complete_through, (today - timedelta(days=2)).isoformat())
    return app


def publish_snapshot(state, configs, through, today):
    result = {'metric': 'lifetime first-time App Store downloads', 'target_as_of': through,
              'checked_on': today.isoformat(), 'apps': {}}
    for config in configs:
        app = state['apps'][config['id']]
        complete = app.get('complete_through', app.get('bootstrap', {}).get('through', app['baseline']['through']))
        cutoff = min(through, complete)
        counts = totals(app, cutoff)
        other = config.get('other_platform_downloads', 0)
        result['apps'][config['id']] = {
            'name': config['name'], 'as_of': cutoff, **counts, 'ios_total_downloads': counts['first_time'] + counts['redownload'],
            'other_platform_downloads': other, 'display_total': counts['first_time'] + other,
            'badge': badge(counts['first_time'] + other),
        }
    result['as_of'] = min(a['as_of'] for a in result['apps'].values())
    result['latest_as_of'] = max(a['as_of'] for a in result['apps'].values())
    return result


def main():
    today = datetime.now(timezone.utc).date()
    readme_path = Path(os.environ.get('PROFILE_README_PATH', '../apoorvdarshan/README.md'))
    resume_path = Path(os.environ['PROFILE_RESUME_PATH'])
    state_path = resume_path.parent / 'ios-download-history.json'
    snapshot_path = resume_path.parent / 'ios-downloads.json'
    config = json.loads(Path(__file__).with_name('ios-downloads.json').read_text())
    state = json.loads(state_path.read_text())
    check(state['version'] == 1, 'Unsupported download history version')
    apps = config['apps']
    if state.get('checked_on') == today.isoformat() and os.environ.get('ASC_DOWNLOADS_FORCE') != 'true':
        print('iOS download reports already checked today; using verified counts.')
        saved = json.loads(snapshot_path.read_text())
        snapshot = publish_snapshot(state, apps, saved.get('target_as_of', saved['as_of']), today)
    else:
        client = Client()
        updated = copy.deepcopy(state)
        for app in apps:
            print(f'Checking ASC downloads for {app["name"]}...', flush=True)
            updated['apps'][app['id']] = refresh_app(client, app['id'], state['apps'][app['id']], today)
        updated['checked_on'] = today.isoformat()
        # App Downloads is complete two days after the event date.
        through = (today - timedelta(days=2)).isoformat()
        snapshot = publish_snapshot(updated, apps, through, today)
        state = updated
    readme, resume = update_copy(readme_path.read_text(), resume_path.read_text(), apps, snapshot)
    # Finish ALL fetching, validation, and rendering before writing any managed file.
    outputs = {state_path: json.dumps(state, indent=2) + '\n',
               snapshot_path: json.dumps(snapshot, indent=2) + '\n',
               readme_path: readme, resume_path: resume}
    for path, content in outputs.items():
        if not path.exists() or path.read_text() != content:
            temp = path.with_name(path.name + '.tmp')
            temp.write_text(content)
            temp.replace(path)
    lines = [f'## iOS downloads checked {snapshot["checked_on"]}', '',
             '| App | Data through | First-time iOS | Redownloads | Public badge |', '| --- | --- | ---: | ---: | --- |']
    for item in snapshot['apps'].values():
        lines.append(f'| {item["name"]} | {item["as_of"]} | {item["first_time"]} | {item["redownload"]} | {item["badge"]} |')
    lines += ['', 'Badges use first-time downloads; Fud AI includes the separately maintained Android count.', '']
    summary = '\n'.join(lines)
    print(summary)
    if os.environ.get('GITHUB_STEP_SUMMARY'):
        with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as stream:
            stream.write(summary)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        # Never log request URLs (signed segment URLs), tokens or private keys.
        print(f'::error::iOS download refresh failed ({type(error).__name__}): {error}')
        raise SystemExit(1)
