import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { PLACES, PLACE_CATS, Place } from '../../src/data';
import { useColors, type } from '../../src/theme';
import { Icon } from '../../src/components/Icon';
import { Screen, H1, H2, Muted, SearchBox } from '../../src/components/ui';

function PlaceTile({ p }: { p: Place }) {
  const c = useColors();
  const router = useRouter();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${p.name}. ${p.hint}`} onPress={() => router.push({ pathname: '/place/[id]', params: { id: p.id } })}
      style={({ pressed }) => ({
        width: '48.5%', minHeight: 112, padding: 14, gap: 6, borderRadius: 14,
        backgroundColor: p.exempt ? 'transparent' : pressed ? c.accentSoft : c.surface,
        borderWidth: 1, borderColor: c.line, borderStyle: p.exempt ? 'dashed' : 'solid',
      })}>
      <View style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: p.exempt ? c.bg : c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name={p.icon} size={19} color={p.exempt ? c.muted : c.accent} />
      </View>
      <Text style={{ fontWeight: '700', fontSize: 15, color: c.ink }}>{p.name}</Text>
      <Text style={[type.small, { color: c.muted, fontSize: 13, lineHeight: 17 }]}>{p.hint}</Text>
    </Pressable>
  );
}

export default function PlacesTab() {
  const [q, setQ] = useState('');
  const groups = useMemo(() => {
    const f = q.trim().toLowerCase();
    const match = (p: Place) => !f || [p.name, p.hint, p.law, ...p.can, ...p.cannot].join(' ').toLowerCase().includes(f);
    return PLACE_CATS.map(cat => ({ cat, items: PLACES.filter(p => p.cat === cat.id && match(p)) })).filter(g => g.items.length);
  }, [q]);
  return (
    <Screen>
      <H1>Where are you going?</H1>
      <Muted>{PLACES.length} kinds of places, from grocery stores to cruise ships.</Muted>
      <SearchBox value={q} onChangeText={setQ} placeholder="Search: gym, cruise, church, zoo…" />
      {groups.length === 0 ? <Muted>No places match that. Try another word, like “hotel” or “park.”</Muted> : null}
      {groups.map(g => (
        <View key={g.cat.id} style={{ gap: 10 }}>
          <H2>{g.cat.label}</H2>
          {g.cat.id === 'exceptions' ? <Muted small>Places people often assume are covered, but aren’t.</Muted> : null}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }}>
            {g.items.map(p => <PlaceTile key={p.id} p={p} />)}
          </View>
        </View>
      ))}
    </Screen>
  );
}
