import React from 'react';
import { Text, View } from 'react-native';
import { useColors } from '../src/theme';
import { Screen, H1, Muted } from '../src/components/ui';

const SIGNS = [
  ['Service animals welcome', 'Pets are not permitted inside.'],
  ['No pets, please', 'Trained service animals are welcome.'],
  ['Service animals welcome', 'Emotional support and comfort animals are not service animals under the ADA.'],
  ['Pets welcome on the patio', 'Service animals are welcome everywhere customers go.'],
];

export default function SignsScreen() {
  const c = useColors();
  return (
    <Screen>
      <H1>Sign wording</H1>
      <Muted>A plain “No pets” or “No dogs allowed” sign often starts arguments at the door. These say the same thing without turning away service dogs.</Muted>
      {SIGNS.map(([a, b], i) => (
        <View key={i} style={{ borderWidth: 2, borderColor: c.ink, borderRadius: 12, padding: 18, alignItems: 'center', gap: 6, backgroundColor: c.surface }}>
          <Text style={{ fontSize: 22, fontWeight: '800', color: c.ink, textAlign: 'center' }}>{a}</Text>
          <Text style={{ fontSize: 16, color: c.ink, textAlign: 'center' }}>{b}</Text>
        </View>
      ))}
      <Muted small>Avoid signs that say “Service animals must wear a vest” or “Show ID for service dogs.” Those rules aren’t allowed under the ADA.</Muted>
    </Screen>
  );
}
