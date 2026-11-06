-- Plenix vote kit: the Postgres layout (owner records vote-live-36, vote-rules-36; issue #414).
-- Each app installs this in its OWN database and runs its own vote service; nothing is shared between apps.
-- The split (an event, and one person-vote per member) follows the Open Civic Data VoteEvent / PersonVote shape (BSD-3-Clause):
--   vote_event  ~ VoteEvent        vote_ballot ~ PersonVote        the option words are our own (approve, deny, abstain).
-- Members come from the app's own people table: member_id is just that table's id (text, so any id shape works).
-- No sign-in tables, no data from other apps.

CREATE TABLE IF NOT EXISTS vote_setting (
  app_key     text PRIMARY KEY,                       -- one row per app: its default settings
  settings    jsonb NOT NULL DEFAULT '{}'::jsonb,     -- only what differs from the kit's defaults (see src/settings.js)
  updated_at  timestamptz NOT NULL DEFAULT now(),
  updated_by  text
);

CREATE TABLE IF NOT EXISTS vote_event (
  id          bigserial PRIMARY KEY,
  motion_id   text NOT NULL,                          -- the app's own case or motion
  title       text NOT NULL,
  settings    jsonb NOT NULL DEFAULT '{}'::jsonb,     -- overrides for this vote only (only what differs from the app's settings)
  status      text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed', 'cancelled')),
  result      text,                                   -- written when closed: passed | failed | tied | no-quorum
  version     bigint NOT NULL DEFAULT 0,              -- grows by one with every change of this event (the live-update counter)
  opened_at   timestamptz NOT NULL DEFAULT now(),
  closed_at   timestamptz,
  created_by  text
);
CREATE INDEX IF NOT EXISTS vote_event_motion ON vote_event (motion_id);

CREATE TABLE IF NOT EXISTS vote_member (
  event_id         bigint NOT NULL REFERENCES vote_event (id) ON DELETE CASCADE,
  member_id        text NOT NULL,
  name             text NOT NULL,
  role             text,
  picture          text,                              -- a URL; the screen shows the initials when there is none
  disabled_reason  text,                              -- null: may vote; "Recused", "Absent": turned off (counted nowhere)
  weight           numeric NOT NULL DEFAULT 1,        -- used only when the setting weights is "on"
  present          boolean NOT NULL DEFAULT true,     -- used only when the setting present is "list"
  PRIMARY KEY (event_id, member_id)
);

-- the current choice of each member (one row per member; deleted when the vote is cleared)
CREATE TABLE IF NOT EXISTS vote_ballot (
  event_id  bigint NOT NULL,
  member_id text NOT NULL,
  option    text NOT NULL CHECK (option IN ('approve', 'deny', 'abstain')),
  cast_at   timestamptz NOT NULL DEFAULT now(),
  cast_by   text,                                     -- the member, or the person who recorded it
  locked    boolean NOT NULL DEFAULT false,
  PRIMARY KEY (event_id, member_id),
  FOREIGN KEY (event_id, member_id) REFERENCES vote_member (event_id, member_id) ON DELETE CASCADE
);

-- every change, never edited or deleted: the record of the vote. Its id is the live-update version of the event's changes.
CREATE TABLE IF NOT EXISTS vote_ballot_history (
  id        bigserial PRIMARY KEY,
  event_id  bigint NOT NULL REFERENCES vote_event (id) ON DELETE CASCADE,
  version   bigint NOT NULL,                          -- vote_event.version after this change
  kind      text NOT NULL CHECK (kind IN ('ballot', 'member', 'status', 'settings')),
  member_id text,
  option    text CHECK (option IN ('approve', 'deny', 'abstain')),   -- null for a cleared vote or a non-ballot change
  detail    jsonb,                                    -- kind member: { disabledReason }, status: { status, result }, settings: { changed }
  at        timestamptz NOT NULL DEFAULT now(),
  by        text,
  reason    text,
  UNIQUE (event_id, version)
);
CREATE INDEX IF NOT EXISTS vote_ballot_history_event ON vote_ballot_history (event_id, version);

-- Change one ballot (or clear it with option NULL) and record it, in one step; returns the new version.
-- The service calls it inside its own transaction after it has checked the caller's rights and the settings.
CREATE OR REPLACE FUNCTION vote_cast(p_event bigint, p_member text, p_option text, p_by text, p_reason text DEFAULT NULL)
RETURNS bigint LANGUAGE plpgsql AS $$
DECLARE v bigint;
BEGIN
  UPDATE vote_event SET version = version + 1 WHERE id = p_event AND status = 'open' RETURNING version INTO v;
  IF v IS NULL THEN RAISE EXCEPTION 'vote event % is not open', p_event USING ERRCODE = 'check_violation'; END IF;
  IF p_option IS NULL THEN
    DELETE FROM vote_ballot WHERE event_id = p_event AND member_id = p_member;
  ELSE
    INSERT INTO vote_ballot (event_id, member_id, option, cast_by) VALUES (p_event, p_member, p_option, p_by)
      ON CONFLICT (event_id, member_id) DO UPDATE SET option = EXCLUDED.option, cast_at = now(), cast_by = EXCLUDED.cast_by;
  END IF;
  INSERT INTO vote_ballot_history (event_id, version, kind, member_id, option, by, reason) VALUES (p_event, v, 'ballot', p_member, p_option, p_by, p_reason);
  RETURN v;
END $$;
