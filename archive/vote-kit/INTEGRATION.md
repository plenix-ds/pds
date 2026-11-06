# Adding the vote kit to an app

A short guide for an app (CTM's Django, or a Node app) that wants a live vote. Each app runs its own vote service and its own Postgres database; the kit gives the layout, the settings, the counting function and the contract. The screen is Plenix's `VoteTally` part.

## 1. Run the SQL
1. Apply `schema/001_vote.sql` to the app's own Postgres database (once; it is safe to run again).
2. It creates `vote_setting`, `vote_event`, `vote_member`, `vote_ballot`, `vote_ballot_history` and the function `vote_cast()`.
3. `member_id` is text: put the app's own people id in it (a Django user id, a council member id). Nothing else is shared with other apps.
4. Django: run the file from a migration (`migrations.RunSQL`) and, if you like, describe the tables with unmanaged models (`managed = False`). Node: run it with the migration tool you already use.

## 2. Settings
1. Pick the app's defaults once and store them in `vote_setting` (`app_key`, `settings` as JSON, only what differs from the kit's defaults): `{ "quorum": { "count": 3 }, "tie": "chair-decides" }`.
2. A vote can override any option in its own `vote_event.settings`.
3. In code: `resolveSettings(appSettings, eventSettings)` gives the settings in force (the kit's defaults, then the app's, then the vote's). `validateSettings` tells an admin screen what is wrong, in plain words.
4. The options and their defaults are in `src/settings.js` and in the README.

## 3. Wire the endpoints
The contract is `contract/openapi.yaml`. The service reads the caller from the app's own session (no sign-in in the kit) and asks the app two questions: `canVote(caller, memberId)` and `canManage(caller, eventId)`.

| Endpoint | What the service does |
|---|---|
| `GET /vote/events/:id` | Load the event, members and ballots; build the outcome with `count()`; cut it with `viewFor()` for this caller; return the EventView. |
| `PUT /vote/events/:id/ballots/:memberId` | Check `canVote` (and `whoRecords`), that the event is open, and `changeVote`; call `vote_cast(event, member, option, by, reason)` in a transaction; return `{ version, member, outcome }`. |
| `POST /vote/events/:id/close` | `canManage`; set status closed, write `result` from `count()`, add a history row (kind `status`). |
| `POST /vote/events/:id/reopen` | Allowed by `settings.reopen`; set status open; add a history row with the reason. |
| `GET /vote/events/:id/history` | The history rows, oldest first (`canManage`, or `liveVisibility` "named"). |
| `GET /vote/events/:id/stream` | The live connection (section 5). |

- **Counting:** run `count(event, members, ballots, settings)` in the service after every change. It needs plain objects (`members: [{ memberId, disabledReason, weight, present }]`, `ballots: [{ memberId, option }]`). The kit is plain JavaScript; a Python app (Django) calls a small Node helper, or ports the one function (about 40 lines; the rules are in the comment at the top of `src/count.js`). Keep one source of truth for the result: the service's, written to `vote_event.result` when the vote closes.
- **Node app:** import `@plenix-ds/vote-kit` and follow `reference/server.js`, which keeps the whole contract in memory (swap its Maps for the SQL).
- **Django:** one view per endpoint, the `vote_cast()` function through `connection.cursor()`, and the stream as a `StreamingHttpResponse` with `content_type="text/event-stream"` (run it under an async server such as Daphne or Uvicorn so each stream does not hold a worker).

## 4. Mount VoteTally
1. Load Plenix as the app already does (the CDN stylesheet and `platform.js`); the part is `Plenix.VoteTally` (it is being built; its props follow the contract's `members` and `outcome`).
2. Pass `members` (each with `memberId`, `name`, `role`, `picture`, `disabledReason`, `vote`), `outcome` and `settings.labels`.
3. `onVote(memberId, option)` calls `PUT /vote/events/:id/ballots/:memberId` and applies the returned `outcome`; pressing the chosen button again sends `null` (when `changeVote` allows).
4. The part is controlled: whatever the service sends is what it shows. It does not count.

## 5. Connect the live feed
1. Open `new EventSource('/vote/events/' + id + '/stream')`. The browser reconnects by itself and sends `Last-Event-ID`.
2. On `snapshot`: replace the whole view. On `ballot`: set that member's `vote`. On `outcome`: replace the outcome. On `member`, `status` or `settings`: update that part (or fetch a snapshot).
3. Keep the highest `version` seen; ignore an event whose version is older or equal.
4. While the connection is down, show the "Reconnecting" badge and make the choices read-only; when it is back, the replay (or a snapshot) catches up.
5. If a stream cannot be made at all (a proxy that buffers), poll `GET /vote/events/:id` every 5 seconds; the screen is the same.
6. Service side: keep the last 500 changes per event for replay (`vote_ballot_history` is the source), send a `ping` every 20 seconds, and cut every event to what that caller may see (`viewFor`, `liveVisibility`).

## 6. Before the first real vote
- Try the screen against `reference/server.js` (`node vote-kit/reference/server.js`, then open the part with the event `1` and the demo caller header `x-demo-user`).
- Check the rights: who may vote for whom (`whoRecords`), who may close and reopen.
- Check the live view with two browsers: one member votes, the other sees the totals move.
- Decide the settings with the council (quorum, majority, ties, abstentions); they are options, not rules of the kit.
