/* Plenix · Publish
   Summary: An item's publishing state and the actions that change it, in one row: the status badge with its icon (Draft,
     Scheduled, Published) and a line saying when and by whom, then the actions that fit the state. A draft offers
     Schedule and Publish; Publish asks first, naming who will see it; Schedule asks for a date and time. A scheduled item
     offers Cancel schedule and Publish now. A published item offers Unpublish, which asks first and says who loses
     access (10 Patterns › Review and approval › Publish, Unpublish).
   Usage:
     <Publish name="Easter banner" status="draft" audience="everyone in the library"
       onPublish={publish} onSchedule={(at) => schedule(at)} />
     <Publish name="Easter banner" status="scheduled" scheduledFor="2026-10-20T09:00" onPublish={publish} onCancelSchedule={unschedule} />
     <Publish name="Easter banner" status="published" publishedAt="2026-10-15T10:24" by="Maya Chen" onUnpublish={unpublish} />
     <Publish name="Easter banner" status="published" publishedAt="2026-10-15T10:24" readOnly />
   Props:
     name: the item's name, used in the questions
     status: "draft" (default) | "scheduled" | "published": the badge (WorkflowStatus) and the actions
     audience: who sees it once published ("everyone in the library"), said in the questions
     publishedAt, scheduledFor: "YYYY-MM-DDTHH:MM": shown in the status line in the data font
     by: who published or scheduled it
     onPublish(): publishes now (after the question, unless confirm is false)
     onSchedule(at): schedules it ("YYYY-MM-DDTHH:MM"); without it there is no Schedule
     onCancelSchedule(): back to a draft (a scheduled item)
     onUnpublish(): takes it down (after the question); without it a published item has no action
     confirm: false publishes and unpublishes without asking (default true: both ask first)
     readOnly: the status only, no actions (people who cannot publish)
     strings: the words, for other languages: { publish, publishNow, schedule, cancelSchedule, unpublish, cancel,
       publishTitle: "Publish {name}?", publishMessage: "It becomes visible to {audience}.", unpublishTitle: "Unpublish
       {name}?", unpublishMessage: "It is hidden from {audience}. You can publish it again.", scheduleTitle: "Schedule
       {name}", when: "Publish on", whenHint: "Date and time, in your time zone.", past: "Choose a time in the future.",
       empty: "Choose a date and time.", publishedLine: "Published {at}", publishedBy: "Published {at} by {by}",
       scheduledLine: "Publishes {at}", draftLine: "Not published", published: "Published", scheduled: "Scheduled for
       {at}", unpublished: "Unpublished", everyone: "everyone with access" }
     className: more classes on the row
   Behavior:
     The questions are confirmation dialogs (Publish and Unpublish in the primary style: both can be reversed).
     Schedule is a dialog with a date-and-time picker; the time is checked when Schedule is pressed: empty or in the past
       keeps the dialog open with the error under the field (nothing is disabled).
     After each action a toast says what happened (with a ToastProvider; otherwise it is announced); Unpublish's toast has
       Undo, which publishes it again.
     The row wraps: the actions move under the status when it is narrow.
   Notes:
     The status is the item's own; whether it may be published (an approval) is ReviewFlow's.
*/
import React from 'react';
import { cx } from '../../utils/cx.ts';
import { useUid } from '../../utils/layer.ts';
import { announce } from '../../utils/announce.tsx';
import { formatDateTime } from '../../utils/format.ts';
import { Button } from '../../components/Button/Button.tsx';
import { ConfirmDialog, Dialog } from '../../components/Dialog/Dialog.jsx';
import { Field } from '../../components/Field/Field.tsx';
import { DatePicker } from '../../components/DatePicker/DatePicker.jsx';
import { Text } from '../../components/Text/Text.tsx';
import { WorkflowStatus } from '../ReviewFlow/ReviewFlow.jsx';
import { useOptionalToast } from '../../components/Toast/Toast.jsx';
import { useStrings } from '../../providers/LocaleProvider.tsx';
import ScheduleIcon from 'plenix-platform/icons/plenix/schedule';
import { fill } from '../../utils/fill.ts';

const q = (x) => '“' + x + '”';

// a status line with its date in the data font: the words around {at} stay in the UI font
function Line({ text, at }) {
  const parts = String(text).split('{at}');
  return <span className="plx-publish__detail">{parts[0]}{parts.length > 1 ? <Text variant="data">{at}</Text> : null}{parts.slice(1).join('')}</span>;
}

export function Publish({ name = '', status = 'draft', audience, publishedAt, scheduledFor, by, onPublish, onSchedule, onCancelSchedule,
  onUnpublish, confirm = true, readOnly = false, strings, className, ...rest }) {
  const t = useStrings('publish', strings);
  const toast = useOptionalToast();
  const who = audience || t.everyone;
  const [ask, setAsk] = React.useState(null);   // "publish" | "unpublish" | "schedule"
  const [when, setWhen] = React.useState(null);
  const [error, setError] = React.useState('');
  const formId = useUid('plx-publish');
  const say = (text, options) => { if (toast) toast.show(text, options); else announce(text); };
  const nameQ = q(name);

  const doPublish = () => { setAsk(null); if (onPublish) onPublish(); say(fill(t.published, { name: nameQ }), { tone: 'success' }); };
  const doUnpublish = () => {
    setAsk(null); if (onUnpublish) onUnpublish();
    say(fill(t.unpublished, { name: nameQ }), onPublish ? { action: { label: t.undo, onAction: onPublish } } : undefined);
  };
  const doSchedule = (e) => {
    e.preventDefault();
    const problem = !when ? t.empty : new Date(when).getTime() <= Date.now() ? t.past : '';
    setError(problem);
    if (problem) return;
    setAsk(null); onSchedule(when);
    say(fill(t.scheduled, { name: nameQ, at: formatDateTime(when) }), { tone: 'success' });
  };
  const publishPress = () => (confirm ? setAsk('publish') : doPublish());
  const unpublishPress = () => (confirm ? setAsk('unpublish') : doUnpublish());
  const openSchedule = () => { setWhen(scheduledFor || null); setError(''); setAsk('schedule'); };

  const line = status === 'published' ? <Line text={by ? fill(t.publishedBy, { by }) : t.publishedLine} at={publishedAt ? formatDateTime(publishedAt) : ''} />
    : status === 'scheduled' ? <Line text={by ? fill(t.scheduledBy, { by }) : t.scheduledLine} at={scheduledFor ? formatDateTime(scheduledFor) : ''} />
      : <span className="plx-publish__detail">{t.draftLine}</span>;

  let actions = null;
  if (!readOnly) {
    if (status === 'published') actions = onUnpublish ? <Button onClick={unpublishPress}>{t.unpublish}</Button> : null;
    else if (status === 'scheduled') actions = <>{onCancelSchedule ? <Button onClick={onCancelSchedule}>{t.cancelSchedule}</Button> : null}
      {onPublish ? <Button variant="primary" onClick={publishPress}>{t.publishNow}</Button> : null}</>;
    else actions = <>{onSchedule ? <Button icon={ScheduleIcon} onClick={openSchedule}>{t.schedule}</Button> : null}
      {onPublish ? <Button variant="primary" onClick={publishPress}>{t.publish}</Button> : null}</>;
  }

  return (
    <div className={cx('plx-publish', readOnly && 'plx-publish--read-only', className)} {...rest}>
      <div className="plx-publish__status">
        <WorkflowStatus status={status === 'scheduled' || status === 'published' ? status : 'draft'} strings={strings} />
        {line}
      </div>
      {actions ? <div className="plx-publish__actions" role="group" aria-label={t.actions}>{actions}</div> : null}
      <ConfirmDialog open={ask === 'publish'} title={fill(t.publishTitle, { name: nameQ })} message={fill(t.publishMessage, { audience: who })}
        confirmLabel={status === 'scheduled' ? t.publishNow : t.publish} cancelLabel={t.cancel} onConfirm={doPublish} onCancel={() => setAsk(null)} />
      <ConfirmDialog open={ask === 'unpublish'} title={fill(t.unpublishTitle, { name: nameQ })} message={fill(t.unpublishMessage, { audience: who })}
        confirmLabel={t.unpublish} cancelLabel={t.cancel} onConfirm={doUnpublish} onCancel={() => setAsk(null)} />
      {onSchedule ? (
        <Dialog open={ask === 'schedule'} onClose={() => setAsk(null)} title={fill(t.scheduleTitle, { name: nameQ })} size="sm"
          footer={<><Button onClick={() => setAsk(null)}>{t.cancel}</Button><Button variant="primary" type="submit" form={formId}>{t.schedule}</Button></>}>
          <form id={formId} noValidate onSubmit={doSchedule}>
            <Field label={t.when} description={t.whenHint} error={error || undefined}>
              <DatePicker mode="date-time" value={when} onChange={(v) => { setWhen(v); if (error) setError(''); }} />
            </Field>
          </form>
        </Dialog>
      ) : null}
    </div>
  );
}
