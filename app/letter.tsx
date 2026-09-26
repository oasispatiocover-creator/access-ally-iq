import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../src/store';
import { complaintLetter } from '../src/lib/text';
import { useColors } from '../src/theme';
import { Screen, Card, H1, Muted, Field, Chip, Button, LinkRow } from '../src/components/ui';
import { LetterBox } from '../src/components/LetterBox';

const TO = [['business', 'The business'], ['doj', 'Justice Department'], ['state', 'State civil rights office']] as const;

export default function LetterScreen() {
  const c = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string }>();
  const { log, profile } = useApp();
  const [id, setId] = useState<string | undefined>(params.id || log[0]?.id);
  const [to, setTo] = useState<'business' | 'doj' | 'state'>('business');
  const [name, setName] = useState('');
  const entry = log.find(e => e.id === id);
  const text = useMemo(() => complaintLetter(to, entry, name, profile), [to, entry, name, profile]);

  return (
    <Screen>
      <H1>Write a complaint</H1>
      <Muted>Turn an entry from your incident log into a letter. Edit it before sending.</Muted>
      {log.length === 0 ? (
        <Card>
          <Muted>Your log is empty. Write down what happened first, then come back.</Muted>
          <Button title="Open the incident log" onPress={() => router.push('/log')} />
        </Card>
      ) : (
        <Card>
          <Text style={{ fontWeight: '700', fontSize: 14, color: c.ink }}>Incident</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {log.slice(0, 8).map(e => <Chip key={e.id} label={`${e.date} · ${e.place}`} selected={e.id === id} onPress={() => setId(e.id)} />)}
          </View>
          <Text style={{ fontWeight: '700', fontSize: 14, color: c.ink }}>Send to</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {TO.map(([k, l]) => <Chip key={k} label={l} selected={to === k} onPress={() => setTo(k)} />)}
          </View>
          <Field label="Your name" value={name} onChangeText={setName} />
        </Card>
      )}
      {log.length ? <LetterBox text={text} title="Service dog complaint" /> : null}
      {to === 'doj' && log.length ? (
        <View style={{ gap: 6 }}>
          <LinkRow label="Open the Justice Department’s online form" url="https://civilrights.justice.gov/" />
          <Muted small>Paste the letter into the “What happened” box.</Muted>
        </View>
      ) : null}
    </Screen>
  );
}
