import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp, Role } from '../store';
import { useColors } from '../theme';

const OPTIONS: { role: Role; title: string; sub: string }[] = [
  { role: 'handler', title: 'I have a service dog', sub: 'Rights, incident log, handling a refusal' },
  { role: 'business', title: 'I work at a business', sub: 'What staff can ask, scripts, training' },
  { role: 'public', title: 'I’m just curious', sub: 'How service dogs work and how to act around them' },
];

export function RoleOptions({ onPick }: { onPick: (r: Role) => void }) {
  const c = useColors();
  const { role, roleChosen } = useApp();
  return (
    <View style={{ gap: 10 }}>
      {OPTIONS.map(o => {
        const on = roleChosen && role === o.role;
        return (
          <Pressable key={o.role} accessibilityRole="button" accessibilityState={{ selected: on }} onPress={() => onPick(o.role)}
            style={({ pressed }) => ({ borderWidth: on ? 2 : 1, borderColor: on ? c.accent : c.line, backgroundColor: pressed ? c.accentSoft : c.surface, borderRadius: 14, padding: 16, gap: 4 })}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: c.ink }}>{o.title}</Text>
            <Text style={{ fontSize: 14, color: c.muted }}>{o.sub}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
