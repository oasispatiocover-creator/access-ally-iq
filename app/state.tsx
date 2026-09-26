import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../src/store';
import { STATE_LIST } from '../src/data';
import { useColors } from '../src/theme';
import { SearchBox } from '../src/components/ui';

export default function StateScreen() {
  const c = useColors();
  const router = useRouter();
  const { state, setUsState } = useApp();
  const [q, setQ] = useState('');
  const rows = useMemo(() => {
    const all = [{ code: 'US', name: 'Federal rules only', territory: false }, ...STATE_LIST];
    const f = q.trim().toLowerCase();
    return f ? all.filter(s => s.name.toLowerCase().includes(f) || s.code.toLowerCase() === f) : all;
  }, [q]);
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={{ padding: 16 }}>
        <SearchBox value={q} onChangeText={setQ} placeholder="Search states and territories" />
      </View>
      <FlatList
        data={rows}
        keyExtractor={s => s.code}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        renderItem={({ item, index }) => {
          const selected = item.code === state;
          const showHeader = item.territory && (index === 0 || !rows[index - 1].territory);
          return (
            <View>
              {showHeader ? <Text style={{ color: c.muted, fontWeight: '700', fontSize: 12, letterSpacing: 1, marginTop: 16, marginBottom: 6 }}>U.S. TERRITORIES</Text> : null}
              <Pressable accessibilityRole="button" accessibilityState={{ selected }}
                onPress={() => { setUsState(item.code); router.back(); }}
                style={({ pressed }) => ({ minHeight: 48, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 10, backgroundColor: selected ? c.accentSoft : pressed ? c.surface : 'transparent' })}>
                <Text style={{ fontSize: 17, color: c.ink, fontWeight: selected ? '700' : '400' }}>{item.name}</Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}
