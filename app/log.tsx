import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/store';
import { todayIso } from '../src/lib/text';
import { useColors, type } from '../src/theme';
import { Screen, Card, Eyebrow, H1, Muted, Field, Button, Chip, TextLink } from '../src/components/ui';

const OUTCOMES = ['Resolved', 'Denied entry', 'Asked to leave', 'Charged a fee'];

export default function LogScreen() {
  const c = useColors();
  const router = useRouter();
  const { log, addLog, removeLog } = useApp();
  const [date, setDate] = useState(todayIso());
  const [place, setPlace] = useState('');
  const [what, setWhat] = useState('');
  const [outcome, setOutcome] = useState(OUTCOMES[0]);

  const save = () => {
    if (!place.trim() || !what.trim()) { Alert.alert('Add the business and what happened', 'Both help if you file a complaint later.'); return; }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date.trim()) || isNaN(new Date(date.trim() + 'T12:00:00').getTime())) {
      Alert.alert('Check the date', 'Use year-month-day, like 2026-09-26.'); return;
    }
    addLog({ date: date.trim(), place: place.trim(), what: what.trim(), outcome });
    setPlace(''); setWhat(''); setOutcome(OUTCOMES[0]);
  };
  const del = (id: string) => Alert.alert('Delete this entry?', 'This can’t be undone.', [{ text: 'Cancel', style: 'cancel' }, { text: 'Delete', style: 'destructive', onPress: () => removeLog(id) }]);

  return (
    <Screen>
      <H1>Incident log</H1>
      <Muted>Write it down while it’s fresh. Notes made at the time carry weight if you file a complaint.</Muted>
      <Card>
        <Field label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} />
        <Field label="Business and location" value={place} onChangeText={setPlace} placeholder="e.g. Main St Market, Tempe" />
        <Field label="What happened" value={what} onChangeText={setWhat} multiline placeholder="Who said what, names or badges, witnesses" />
        <Text style={{ fontWeight: '700', fontSize: 14, color: c.ink }}>Outcome</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {OUTCOMES.map(o => <Chip key={o} label={o} selected={o === outcome} onPress={() => setOutcome(o)} />)}
        </View>
        <Button title="Save entry" onPress={save} />
      </Card>
      <Card>
        <Eyebrow>Saved entries</Eyebrow>
        {log.length === 0 ? <Muted>No entries yet.</Muted> : log.map((e, i) => (
          <View key={e.id} style={{ gap: 4, paddingTop: i ? 12 : 0, borderTopWidth: i ? 1 : 0, borderTopColor: c.line }}>
            <Text style={{ fontWeight: '700', fontSize: 16, color: c.ink }}>{e.place}</Text>
            <Text style={[type.small, { color: c.muted }]}>{e.date} · {e.outcome}</Text>
            <Text style={[type.body, { color: c.ink }]}>{e.what}</Text>
            <View style={{ flexDirection: 'row', gap: 18 }}>
              <TextLink title="Write a complaint" onPress={() => router.push({ pathname: '/letter', params: { id: e.id } })} />
              <Pressable accessibilityRole="button" accessibilityLabel={`Delete entry for ${e.place}`} onPress={() => del(e.id)} hitSlop={8} style={{ paddingVertical: 4 }}><Text style={{ color: c.no, fontWeight: '700' }}>Delete</Text></Pressable>
            </View>
          </View>
        ))}
      </Card>
    </Screen>
  );
}
