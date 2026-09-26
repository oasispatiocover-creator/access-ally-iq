import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useColors, type } from '../src/theme';
import { Screen, Card, Eyebrow, H1, Muted, Steps, Button } from '../src/components/ui';

const EXAMPLES = [
  ['Saguaro Street Café', 'Tempe, AZ · Restaurant · Staff trained Sept 2026'],
  ['Desert Bloom Market', 'Mesa, AZ · Grocery · Staff trained Aug 2026'],
  ['Canyon Ridge Inn', 'Flagstaff, AZ · Hotel · Staff trained July 2026'],
];

export default function DirectoryScreen() {
  const c = useColors();
  const router = useRouter();
  return (
    <Screen>
      <H1>Trained business directory</H1>
      <Muted>Coming with business accounts. Businesses whose staff pass the Access Ally IQ quiz get listed, so handlers can find places that know the rules. Businesses also get a window decal.</Muted>
      <Card>
        <Eyebrow>How it will work</Eyebrow>
        <Steps items={['Staff take the 10-question quiz in this app.', 'A manager uploads the staff completion records.', 'The business adopts a written service animal policy.', 'The listing and decal renew each year, when staff retake the quiz.']} />
      </Card>
      <Card>
        <Eyebrow>Example listings</Eyebrow>
        <Muted small>These are made-up examples to show the layout.</Muted>
        {EXAMPLES.map(([n, d], i) => (
          <View key={i} style={{ gap: 2, paddingTop: i ? 10 : 0, borderTopWidth: i ? 1 : 0, borderTopColor: c.line }}>
            <Text style={[type.eyebrow, { color: c.muted }]}>Example</Text>
            <Text style={{ fontWeight: '700', fontSize: 16, color: c.ink }}>{n}</Text>
            <Text style={[type.small, { color: c.muted }]}>{d}</Text>
          </View>
        ))}
      </Card>
      <Button title="Start with the staff quiz" onPress={() => router.push('/quiz')} />
    </Screen>
  );
}
