/* Plenix · Onboarding
   Summary: An optional welcome dialog followed by a setup checklist and a user-started product tour.
   Usage: <Onboarding title="Welcome" tasks={tasks} completed={done} onChange={setDone} steps={tourSteps} />
   Props:
     title, children: welcome content; welcome: initially show welcome (default true).
     tasks, completed, onChange: Checklist data; steps: optional Tour steps; onDismiss(): dismiss setup.
     onWelcomeDismiss(), onTourStep(index), onTourFinish(reason): persist progress in the caller.
     strings: { start, skip, tour, checklist, close }; className: extra classes.
   Behavior:
     Welcome can be skipped. Setup stays available after either action; a tour never starts automatically.
     Checklist completion and tour progress survive visibility changes; storage belongs to the caller.
   Notes:
     Keep onboarding optional. Never require educational steps to access the product.
*/
import React from 'react';
import { Stack } from '../../components/Stack/Stack.tsx';
import { Dialog } from '../../components/Dialog/Dialog.tsx';
import { Button } from '../../components/Button/Button.tsx';
import { Checklist } from '../../components/Checklist/Checklist.jsx';
import { Tour } from '../Tour/Tour.jsx';
import { cx } from '../../utils/cx.ts';
import { useStrings } from '../../providers/LocaleProvider.tsx';

export function Onboarding({ title, children, welcome = true, tasks = [], completed = [], onChange, steps = [], onDismiss, onWelcomeDismiss, onTourStep, onTourFinish, strings, className }) {
  const t = useStrings('onboarding', strings);
  const [shown, setShown] = React.useState(welcome), [tour, setTour] = React.useState(false);
  const close = () => { setShown(false); if (onWelcomeDismiss) onWelcomeDismiss(); };
  return <Stack className={cx('plx-onboarding', className)}>
    <Dialog open={shown} title={title} onClose={close} closeLabel={t.close}
      footer={<><Button onClick={close}>{t.skip}</Button><Button variant="primary" onClick={close}>{t.start}</Button></>}>{children}</Dialog>
    <Checklist title={t.checklist} items={tasks} completed={completed} onChange={onChange} onDismiss={onDismiss} strings={strings} />
    {steps.length ? <><Button onClick={() => setTour(true)}>{t.tour}</Button>
      <Tour open={tour && !shown} onOpenChange={setTour} steps={steps} onStepChange={onTourStep} onFinish={onTourFinish} strings={strings} /></> : null}
  </Stack>;
}
