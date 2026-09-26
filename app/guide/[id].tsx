import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { GUIDES } from '../../src/data';
import { Screen, Card, Eyebrow, H1, Muted, Blocks, Cite } from '../../src/components/ui';

export default function GuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const g = GUIDES[String(id)];
  if (!g) return <Screen><Muted>That guide wasn’t found.</Muted></Screen>;
  return (
    <Screen>
      <Stack.Screen options={{ title: g.title }} />
      <H1>{g.title}</H1>
      {g.intro ? <Muted>{g.intro}</Muted> : null}
      {g.sections.map((s, i) => (
        <Card key={i}>
          <Eyebrow>{s.eyebrow}</Eyebrow>
          <Blocks blocks={s.blocks} />
        </Card>
      ))}
      <Cite>{g.cite}</Cite>
    </Screen>
  );
}
