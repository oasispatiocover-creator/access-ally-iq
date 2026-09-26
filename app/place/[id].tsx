import React from 'react';
import { Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { placeById } from '../../src/data';
import { useColors } from '../../src/theme';
import { Screen, Card, Eyebrow, H1, Blocks, RuleList, Cite, Button, Muted } from '../../src/components/ui';

export default function PlaceScreen() {
  const c = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const p = placeById(String(id));
  if (!p) return <Screen><Muted>That place wasn’t found.</Muted></Screen>;
  return (
    <Screen>
      <Stack.Screen options={{ title: p.name }} />
      <View style={{ gap: 8 }}>
        <View style={{ alignSelf: 'flex-start', borderWidth: 1, borderColor: p.exempt ? c.no : c.line, backgroundColor: p.exempt ? c.noSoft : c.surface, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3 }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: p.exempt ? c.no : c.muted }}>{p.law}</Text>
        </View>
        <H1>{p.name}</H1>
      </View>
      {p.exempt ? (
        <Card style={{ backgroundColor: c.noSoft, borderColor: 'transparent' }}>
          <Text style={{ fontSize: 16, lineHeight: 23, color: c.ink }}>
            <Text style={{ fontWeight: '700' }}>The ADA doesn’t cover this place.</Text> Service dog access here depends on the owner, a state law, or a company policy. The two-question rule and the staff screen may not apply.
          </Text>
        </Card>
      ) : null}
      <Card>
        <Eyebrow>{p.exempt ? 'What to know' : 'Allowed'}</Eyebrow>
        <RuleList kind={p.exempt ? 'dot' : 'tick'} items={p.can} />
      </Card>
      <Card>
        <Eyebrow>{p.exempt ? 'Where protection still applies' : 'Not allowed'}</Eyebrow>
        <RuleList kind={p.exempt ? 'tick' : 'cross'} items={p.cannot} />
      </Card>
      <Card>
        <Eyebrow>Good to know</Eyebrow>
        <Blocks blocks={p.notes} />
        <Cite>{p.cite}</Cite>
      </Card>
      {!p.exempt ? <Button title="Show this to staff" kind="accent" icon="phone" onPress={() => router.push({ pathname: '/staff', params: { place: p.id } })} /> : null}
    </Screen>
  );
}
