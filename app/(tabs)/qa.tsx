import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { QA, QA_GROUPS } from '../../src/data';
import { useColors, type } from '../../src/theme';
import { Screen, H1, Muted, SearchBox, Chip, Verdict, Rich, Cite } from '../../src/components/ui';

export default function QATab() {
  const c = useColors();
  const params = useLocalSearchParams<{ q?: string; open?: string }>();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('all');
  const [open, setOpen] = useState<Record<number, boolean>>({});

  // Deep links from other screens: /qa?q=HIPAA opens the first match; /qa?open=3 opens one item.
  // Params are cleared after use so tapping the same link again works.
  useEffect(() => {
    if (params.q) {
      const q = String(params.q), f = q.toLowerCase();
      const first = QA.findIndex(x => [x.q, x.said, ...x.answer].join(' ').toLowerCase().includes(f));
      setQuery(q); setGroup('all'); setOpen(first >= 0 ? { [first]: true } : {});
      router.setParams({ q: undefined, open: undefined });
    } else if (params.open != null) {
      setQuery(''); setGroup('all'); setOpen({ [Number(params.open)]: true });
      router.setParams({ q: undefined, open: undefined });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.q, params.open]);

  const items = useMemo(() => {
    const f = query.trim().toLowerCase();
    return QA.map((x, i) => ({ x, i })).filter(({ x }) =>
      (group === 'all' || x.group === group) && (!f || [x.q, x.said, ...x.answer].join(' ').toLowerCase().includes(f)));
  }, [query, group]);

  return (
    <Screen>
      <H1>What people argue about</H1>
      <Muted>Straight answers to the things people say most often about service dogs, in public and online.</Muted>
      <SearchBox value={query} onChangeText={setQuery} placeholder="Search: vest, HIPAA, leash, refuse…" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {QA_GROUPS.map(g => <Chip key={g.id} label={g.label} selected={g.id === group} onPress={() => setGroup(g.id)} />)}
      </ScrollView>
      {items.length === 0 ? <Muted>No answers match that. Try another word, like “leash” or “vest.”</Muted> : null}
      <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 14, overflow: 'hidden' }}>
        {items.map(({ x, i }, n) => {
          const isOpen = !!open[i];
          return (
            <View key={i} style={{ borderTopWidth: n ? 1 : 0, borderTopColor: c.line }}>
              <Pressable accessibilityRole="button" accessibilityState={{ expanded: isOpen }} onPress={() => setOpen(o => ({ ...o, [i]: !o[i] }))}
                style={{ padding: 16, paddingRight: 44, gap: 4 }}>
                <Text style={[type.small, { color: c.muted, fontStyle: 'italic' }]}>{x.said}</Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: c.ink, lineHeight: 22 }}>{x.q}</Text>
                <Text accessibilityElementsHidden importantForAccessibility="no" style={{ position: 'absolute', right: 16, top: 14, fontSize: 22, color: c.muted }}>{isOpen ? '−' : '+'}</Text>
              </Pressable>
              {isOpen ? (
                <View style={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}>
                  <Verdict v={x.verdict} />
                  {x.answer.map((a, j) => <Rich key={j} text={a} />)}
                  <Cite>{x.cite}</Cite>
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </Screen>
  );
}
