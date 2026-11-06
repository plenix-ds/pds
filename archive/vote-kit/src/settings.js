/* Plenix vote kit · settings (vote-kit/src/settings.js)
   Summary: The options of a vote, with our suggestion as the default of each (owner, vote-rules-36: "just available options",
     not musts). An app sets its defaults once (vote_setting) and may override any option for one vote (vote_event.settings).
   Usage:
     const settings = resolveSettings(appSettings, eventOverrides);   // the kit's defaults, then the app's, then the vote's
     validateSettings({ tie: 'coin' })                                // ['tie: "coin" is not one of fails, chair-decides']
   Props:
     whoRecords: "self" | "clerk" | "both" (default "both")
     liveVisibility: "named" | "totals" | "hidden-until-closed" (default "named")
     tie: "fails" | "chair-decides" (default "fails")
     abstainInMajority: false | true (default false): true counts an abstention as a "no"
     quorum: "off" | { count: n } | { share: 0..1 } (default "off")
     majority: "simple" | "absolute" | "two-thirds" (default "simple")
     present: "not-turned-off" | "list" (default "not-turned-off")
     changeVote: "until-closed" | "final" (default "until-closed")
     reopen: "chair-only" | "never" | "anyone-who-can-manage" (default "chair-only")
     weights: "off" | "on" (default "off")
     labels: { approve, deny, abstain, turnedOff } (default Approve, Deny, Abstain, turned off)
   Behavior:
     Unknown keys are dropped. A wrong value is reported by validateSettings and falls back to the default in resolveSettings.
   Notes:
     No dependencies; it runs in the service and in the browser. */

export const DEFAULTS = Object.freeze({
  whoRecords: 'both',
  liveVisibility: 'named',
  tie: 'fails',
  abstainInMajority: false,
  quorum: 'off',
  majority: 'simple',
  present: 'not-turned-off',
  changeVote: 'until-closed',
  reopen: 'chair-only',
  weights: 'off',
  labels: Object.freeze({ approve: 'Approve', deny: 'Deny', abstain: 'Abstain', turnedOff: 'turned off' })
});

const CHOICES = {
  whoRecords: ['self', 'clerk', 'both'],
  liveVisibility: ['named', 'totals', 'hidden-until-closed'],
  tie: ['fails', 'chair-decides'],
  majority: ['simple', 'absolute', 'two-thirds'],
  present: ['not-turned-off', 'list'],
  changeVote: ['until-closed', 'final'],
  reopen: ['chair-only', 'never', 'anyone-who-can-manage'],
  weights: ['off', 'on']
};

const isQuorum = (q) => q === 'off' || (q && typeof q === 'object' && (
  (Number.isInteger(q.count) && q.count >= 1 && q.share === undefined) || (typeof q.share === 'number' && q.share > 0 && q.share <= 1 && q.count === undefined)));

// the problems of a settings object, in plain words ([] when it is fine); only the keys it holds are checked
export function validateSettings(settings) {
  const out = [];
  const s = settings || {};
  Object.keys(CHOICES).forEach((k) => { if (s[k] !== undefined && CHOICES[k].indexOf(s[k]) < 0) out.push(k + ': "' + s[k] + '" is not one of ' + CHOICES[k].join(', ')); });
  if (s.abstainInMajority !== undefined && typeof s.abstainInMajority !== 'boolean') out.push('abstainInMajority: must be true or false');
  if (s.quorum !== undefined && !isQuorum(s.quorum)) out.push('quorum: must be "off", { count: n } or { share: 0 to 1 }');
  if (s.labels !== undefined && (typeof s.labels !== 'object' || s.labels === null || Object.keys(s.labels).some((k) => !(k in DEFAULTS.labels) || typeof s.labels[k] !== 'string'))) out.push('labels: must hold text for approve, deny, abstain, turnedOff');
  return out;
}

const pick = (layer) => {
  const out = {};
  if (!layer || typeof layer !== 'object') return out;
  Object.keys(CHOICES).forEach((k) => { if (layer[k] !== undefined && CHOICES[k].indexOf(layer[k]) >= 0) out[k] = layer[k]; });
  if (typeof layer.abstainInMajority === 'boolean') out.abstainInMajority = layer.abstainInMajority;
  if (layer.quorum !== undefined && isQuorum(layer.quorum)) out.quorum = layer.quorum;
  if (layer.labels && typeof layer.labels === 'object') {
    const labels = {};
    Object.keys(DEFAULTS.labels).forEach((k) => { if (typeof layer.labels[k] === 'string' && layer.labels[k]) labels[k] = layer.labels[k]; });
    out.labels = labels;
  }
  return out;
};

// the settings in force: the kit's defaults, then the app's, then this vote's
export function resolveSettings(appSettings, eventSettings) {
  const a = pick(appSettings), e = pick(eventSettings);
  return Object.assign({}, DEFAULTS, a, e, { labels: Object.assign({}, DEFAULTS.labels, a.labels, e.labels) });
}
