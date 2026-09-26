import React, { useState } from 'react';
import { useApp } from '../src/store';
import { Screen, Card, Eyebrow, H1, Muted, RuleList, Button } from '../src/components/ui';

export default function PrivacyScreen() {
  const { wipe } = useApp();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <Screen>
      <H1>Privacy</H1>
      <Card>
        <Eyebrow>Where your data lives</Eyebrow>
        <RuleList items={[
          'Your incident log, dog profile, and reports are saved only on this phone.',
          'Nothing is sent to us or anyone else unless you share it.',
          'Deleting the app deletes them.',
        ]} />
      </Card>
      <Card>
        <Eyebrow>Our promises</Eyebrow>
        <RuleList items={['No selling or sharing of personal or health information', 'Delete everything at any time', 'Optional cloud backup you control, coming in a later version']} />
        <Muted small>HIPAA doesn’t cover apps like this one, so we protect your data by our own policy. Only write health details in your notes if you need them for a complaint.</Muted>
      </Card>
      {done ? <Muted>Your log, profile, and reports were deleted from this phone.</Muted> : (
        <Button kind="danger" title={confirm ? 'Tap again to delete everything' : 'Delete my log and profile'}
          onPress={async () => { if (confirm) { await wipe(); setDone(true); } else setConfirm(true); }} />
      )}
    </Screen>
  );
}
