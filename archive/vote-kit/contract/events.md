# The live-update contract (server-sent events)

One live connection per vote event: `GET /vote/events/:id/stream`. It is one-way (the screen sends votes with `PUT`), works through the app's sign-in and plain HTTPS, and the browser's `EventSource` reconnects by itself.

## Events
Each event has `id: <version>`, an `event:` name and a JSON `data:` line.

| event | data | when |
|---|---|---|
| `snapshot` | the whole EventView | first on a new connection with no `Last-Event-ID`, and when the gap since `Last-Event-ID` is too old to replay |
| `ballot` | `{ memberId, option, at, version }` (option null: cleared) | a vote was cast, changed or cleared |
| `outcome` | the Outcome (cut to what the caller may see) | after every `ballot`, `member`, `status` and `settings` |
| `member` | `{ memberId, disabledReason, present, weight }` | a member was turned off or on |
| `status` | `{ status, result }` | opened, closed, cancelled |
| `settings` | `{ changed: [keys] }` | the vote's settings changed (the screen asks for a snapshot) |
| `ping` | `{}` | every 20 seconds, so a silent connection is noticed |

- Every event except `ping` carries the event's `version`: one counter per vote event that grows by one with each change (the history table's `version`).
- The EventView carries `settings` (so the screen knows `liveVisibility` and the labels), `votesHidden` and, per member, `voteHidden`: when they are true the member's `vote` is null because it is held back, not because nobody voted, and the screen says "Hidden until the vote closes" (or "Totals only") instead of showing empty buttons.
- What a caller is sent follows `settings.liveVisibility`: with `totals` or `hidden-until-closed` the `ballot` events about other members are not sent, and with `hidden-until-closed` the `outcome` is held back until `status` closed. A manager is sent everything.

## Reconnect and catch-up
1. The browser keeps the last `version` it saw and reconnects with `Last-Event-ID: <version>`.
2. The service replays every change after it from the history table, in order, each with its `outcome`.
3. If that is too old (the service keeps the last 500 changes per event in memory), it sends one `snapshot` and continues from there.
4. A browser that is offline longer simply gets the snapshot.

## In the browser
- Events are applied in `version` order; one with a version older than or equal to what the screen has is ignored.
- While disconnected the part shows a small "Reconnecting" badge (with a clock icon), keeps the last totals and turns the choices read-only, so no vote is sent blind. After catch-up the badge goes away.
- Fallback: if the connection cannot be made, poll `GET /vote/events/:id` every 5 seconds. The screen does not know the difference.
