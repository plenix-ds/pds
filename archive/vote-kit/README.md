# Plenix vote kit

A live vote for any app (owner records vote-live-36 and vote-rules-36, issue #414). Plenix gives two blocks, and each app runs its own vote service with its own Postgres database:

- **The `VoteTally` part** (in `platform/`): the screen. It draws a list of members with a picture or initials and three icon-only buttons each, and a totals row. It does not count.
- **This kit** (open source, BSD-3-Clause): the Postgres layout, the settings, the counting function, and the HTTP and live-update contract.

## What is here
| Path | What |
|---|---|
| `schema/001_vote.sql` | The Postgres layout, in the Open Civic Data VoteEvent / PersonVote shape: `vote_setting`, `vote_event`, `vote_member`, `vote_ballot`, `vote_ballot_history`, and `vote_cast()` (one step: change a ballot and record it). |
| `src/settings.js` | The options of a vote with a default each: `DEFAULTS`, `resolveSettings(app, event)`, `validateSettings`. |
| `src/count.js` | `count(event, members, ballots, settings)` and `viewFor(...)` (what one caller may see). No dates, no database. |
| `contract/openapi.yaml` | The HTTP contract: read an event, cast a ballot, close, reopen, history, stream. |
| `contract/events.md` | The live-update contract: server-sent events with a `version`, reconnect with `Last-Event-ID`, catch-up, a snapshot, a polling fallback. |
| `reference/server.js` | A small in-memory service that keeps the contract, to read and to try a screen against. Not for production. |

## Using it in an app
1. Run `schema/001_vote.sql` in the app's own database.
2. Write the app's service on the contract: it reads the caller from the app's session, gives the kit two functions (`canVote(caller, memberId)` and `canManage(caller, eventId)`), runs `count()` after every change, and sends `ballot` and `outcome` events (cut with `viewFor()`).
3. Draw `VoteTally` with the members and the outcome; call `PUT /vote/events/:id/ballots/:memberId` from its `onVote`.

## Settings (all options, with a suggested default)
`whoRecords` (both), `liveVisibility` (named), `tie` (fails), `abstainInMajority` (false), `quorum` (off), `majority` (simple), `present` (not-turned-off), `changeVote` (until-closed), `reopen` (chair-only), `weights` (off), `labels` (Approve, Deny, Abstain, turned off). An app sets its defaults once in `vote_setting`; one vote may override any in `vote_event.settings`.

## Not in the kit
Sign-in, people, rights (the app's own), and anything shared between apps.
