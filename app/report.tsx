import React, { useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../src/store';
import { emailSupport, shareText, SUPPORT_EMAIL } from '../src/lib/share';
import { useColors } from '../src/theme';
import { Screen, H1, Muted, Field, Chip, Button } from '../src/components/ui';

const TYPES = ['Information is wrong or out of date', 'A law changed', 'A link is broken', 'Something is confusing', 'Something doesn’t work', 'Other'];

export default function ReportScreen() {
  const c = useColors();
  const router = useRouter();
  const { page } = useLocalSearchParams<{ page?: string }>();
  const { addReport } = useApp();
  const [where, setWhere] = useState(String(page || ''));
  const [kind, setKind] = useState(TYPES[0]);
  const [text, setText] = useState('');

  const send = async () => {
    if (!text.trim()) { Alert.alert('Add some details', 'Tell us what should change. A link to your source helps.'); return; }
    addReport({ page: where, type: kind, text: text.trim() });
    const body = `Page: ${where}\nType: ${kind}\n\n${text.trim()}`;
    const opened = await emailSupport(`Access Ally IQ report: ${kind}`, body);
    if (!opened) await shareText(`${body}\n\nSend to ${SUPPORT_EMAIL}`, 'Access Ally IQ report');
    router.back();
  };

  return (
    <Screen report={false}>
      <H1>Report a problem</H1>
      <Muted>Tell us what’s wrong or out of date. Every report helps keep this accurate.</Muted>
      <Field label="Page" value={where} onChangeText={setWhere} />
      <Text style={{ fontWeight: '700', fontSize: 14, color: c.ink }}>What’s wrong</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {TYPES.map(t => <Chip key={t} label={t} selected={t === kind} onPress={() => setKind(t)} />)}
      </View>
      <Field label="Details" value={text} onChangeText={setText} multiline placeholder="What should it say instead? A link to your source helps." />
      <Button title="Send report" onPress={send} />
      <Muted small>This opens your email app with the report filled in, addressed to {SUPPORT_EMAIL}. A copy is also saved on this phone.</Muted>
    </Screen>
  );
}
