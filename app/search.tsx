import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/store';
import { search, snippet } from '../src/lib/search';
import { useColors, type } from '../src/theme';
import { Screen, SearchBox, Muted } from '../src/components/ui';

export default function SearchScreen() {
  const c = useColors();
  const router = useRouter();
  const { setUsState } = useApp();
  const [q, setQ] = useState('');
  const hits = useMemo(() => search(q), [q]);
  return (
    <Screen>
      <SearchBox value={q} onChangeText={setQ} placeholder="Search places, questions, guides, states" />
      {q.trim().length < 2 ? <Muted>Type at least 2 letters. Try “vest,” “landlord,” “Puerto Rico,” or “airline.”</Muted> : null}
      {q.trim().length >= 2 && hits.length === 0 ? <Muted>Nothing matched. Try a shorter or different word.</Muted> : null}
      {hits.length ? (
        <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 14, overflow: 'hidden' }}>
          {hits.map((h, i) => (
            <Pressable key={i} accessibilityRole="button"
              onPress={() => {
                if (h.stateCode) { setUsState(h.stateCode); router.dismissTo('/'); return; }
                // Tab screens: go back to the existing tabs instead of stacking a second copy.
                const path = typeof h.href === 'string' ? h.href : h.href.pathname;
                if (path === '/' || path === '/qa' || path === '/animals' || path === '/places') router.dismissTo(h.href as any);
                else router.push(h.href as any);
              }}
              style={({ pressed }) => ({ padding: 14, gap: 3, borderTopWidth: i ? 1 : 0, borderTopColor: c.line, backgroundColor: pressed ? c.accentSoft : 'transparent' })}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: c.ink }}>{h.title}</Text>
              <Text style={[type.small, { color: c.muted }]} numberOfLines={2}>{h.kind} · {snippet(h.text, q)}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </Screen>
  );
}
