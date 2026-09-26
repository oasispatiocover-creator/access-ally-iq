import React, { useMemo, useState } from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../src/store';
import { requestLetter, RequestFields } from '../../src/lib/text';
import { Screen, Card, Eyebrow, H1, Muted, Field, RuleList, Steps, Cite } from '../../src/components/ui';
import { LetterBox } from '../../src/components/LetterBox';

export default function RequestScreen() {
  const { kind: k } = useLocalSearchParams<{ kind: string }>();
  const kind: 'housing' | 'work' = k === 'work' ? 'work' : 'housing';
  const H = kind === 'housing';
  const { profile } = useApp();
  const [f, setF] = useState<RequestFields>({ name: '', to: '', address: '', need: '', contact: '' });
  const set = (key: keyof RequestFields) => (v: string) => setF(x => ({ ...x, [key]: v }));
  const text = useMemo(() => requestLetter(kind, f, profile), [kind, f, profile]);
  const title = H ? 'Asking your landlord' : 'Asking your employer';

  return (
    <Screen>
      <Stack.Screen options={{ title }} />
      <H1>{title}</H1>
      <Card>
        <Eyebrow>Step by step</Eyebrow>
        <Steps items={H ? [
          '**Ask in writing.** You can ask out loud, but a letter or email gives you a record with a date.',
          '**Explain the need, not the diagnosis.** Say you have a disability and how the animal helps. You don’t have to name your condition.',
          '**Offer proof if it isn’t obvious.** A letter from a doctor, therapist, or other provider who knows you. It doesn’t need your diagnosis or medical records.',
          '**Ask for a written answer.** There’s no set deadline, but a long, unexplained delay can count as a denial.',
          '**If they say no,** ask for the reason in writing. Contact your state’s Protection & Advocacy agency, or file with HUD within 1 year.',
        ] : [
          '**Ask your manager or HR.** Plain words are enough. Writing it down gives you a record.',
          '**Explain how the dog helps you do your job.** You don’t have to name your diagnosis unless they need documentation.',
          '**Expect a conversation.** The employer should talk it through with you. This is called the interactive process.',
          '**Be ready for reasonable requests,** such as a note about your disability and need, proof the dog is trained, or a short trial period.',
          '**If they say no,** ask why in writing. Call the Job Accommodation Network for free advice, or file with the EEOC within 180 days (300 in most states).',
        ]} />
      </Card>
      <Card>
        <Eyebrow>{H ? 'What a landlord can and can’t ask' : 'What an employer can and can’t ask'}</Eyebrow>
        <RuleList kind="tick" items={H ? ['Reliable proof of a disability and the need, when not obvious', 'Proof about your specific animal if there’s a real safety concern'] : ['Documentation of the disability and need, when not obvious', 'Reasonable proof the dog is trained and won’t disrupt work', 'A short trial period']} />
        <RuleList kind="cross" items={H ? ['Your diagnosis or medical records', 'Pet fees, pet rent, or a deposit', 'That you use their own form', 'A blanket breed or size ban'] : ['Your full medical history', 'Certification from a “registry”', 'Refusal without discussing options', 'Retaliation for asking']} />
      </Card>
      <Card>
        <Eyebrow>Sample request</Eyebrow>
        <Muted small>Your dog’s name and task come from your dog profile.</Muted>
        <Field label="Your name" value={f.name} onChangeText={set('name')} />
        <Field label={H ? 'Landlord or manager' : 'Manager or HR'} value={f.to} onChangeText={set('to')} />
        {H ? <Field label="Your address and unit" value={f.address} onChangeText={set('address')} /> : null}
        <Field label="How the dog helps you" value={f.need} onChangeText={set('need')} multiline placeholder={profile.task || 'Describe the task, not your diagnosis'} />
        <Field label="Your phone or email" value={f.contact} onChangeText={set('contact')} />
      </Card>
      <LetterBox text={text} title={H ? 'Housing accommodation request' : 'Workplace accommodation request'} />
      <Cite>{H ? '42 U.S.C. §3604(f) · 24 CFR §100.204 · HUD/DOJ Joint Statement on Reasonable Accommodations (2004)' : '29 CFR §1630.9 · EEOC reasonable accommodation guidance · Job Accommodation Network'}</Cite>
      <Muted small>This is a template, not legal advice.</Muted>
    </Screen>
  );
}
