import React, { useMemo, useState } from 'react';
import { useApp } from '../src/store';
import { policyText } from '../src/lib/text';
import { Screen, H1, Muted, Field } from '../src/components/ui';
import { LetterBox } from '../src/components/LetterBox';

export default function PolicyScreen() {
  const { state } = useApp();
  const [biz, setBiz] = useState('');
  const text = useMemo(() => policyText(biz, state), [biz, state]);
  return (
    <Screen>
      <H1>Sample service animal policy</H1>
      <Muted>Based on the federal ADA rules and your state’s law. Have your lawyer review it before you adopt it.</Muted>
      <Field label="Business name" value={biz} onChangeText={setBiz} placeholder="e.g. Saguaro Street Café" />
      <LetterBox text={text} title="Service animal policy" />
    </Screen>
  );
}
