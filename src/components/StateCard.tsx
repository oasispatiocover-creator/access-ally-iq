import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../store';
import { STATES } from '../data';
import { useColors, type } from '../theme';
import { Card, Eyebrow, H2, Rich, Muted, Cite, Verdict, TextLink, openLink } from './ui';
import { Icon } from './Icon';

/** Button that shows the chosen state and opens the picker. */
export function StatePicker() {
  const c = useColors();
  const router = useRouter();
  const { state } = useApp();
  const name = STATES[state]?.name || 'Federal rules only';
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`Your state: ${name}. Change state`} onPress={() => router.push('/state')}
      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingHorizontal: 14, minHeight: 48 }}>
      <Text style={{ color: c.muted, fontSize: 14 }}>Your state</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text style={{ color: c.ink, fontWeight: '700', fontSize: 16 }}>{name}</Text>
        <Icon name="chevron" size={16} color={c.muted} />
      </View>
    </Pressable>
  );
}

export function StateCard() {
  const c = useColors();
  const router = useRouter();
  const { state } = useApp();
  const s = STATES[state];
  if (!s) {
    return (
      <Card>
        <Eyebrow>Federal rules only</Eyebrow>
        <Rich text="Pick your state to see what it adds, such as rights for dogs in training and penalties for faking a service dog." />
        <TextLink title="Choose a state" onPress={() => router.push('/state')} />
      </Card>
    );
  }
  const divider = { borderTopWidth: 1, borderTopColor: c.line, paddingTop: 10, gap: 6 };
  return (
    <Card>
      <Eyebrow>{s.name} law</Eyebrow>
      <Muted small>Federal law applies everywhere. Here is what {s.name} adds or changes. When the two differ, the law that protects the handler more is the one that applies. A state can add rights, but it can’t take away ADA rights.</Muted>
      {s.territory ? <Muted small>Territory laws were harder to confirm than state laws. Check with the local government or the Protection & Advocacy agency before relying on them.</Muted> : null}
      <View style={{ gap: 6 }}>
        <H2>Dogs in training</H2>
        <Verdict v={s.tr} />
        <Rich text={s.trNote} />
      </View>
      <View style={divider}>
        <H2>Faking a service dog</H2>
        {s.mp ? (
          <>
            <Verdict v="penalized" />
            <Rich text={s.mp} />
            <Cite>{s.mc}</Cite>
          </>
        ) : (
          <>
            <Verdict v="none" />
            <Rich text={`${s.name} has no law penalizing someone who passes off a pet as a service animal in stores or restaurants${s.mh ? '. It does penalize this in housing.' : '.'}`} />
          </>
        )}
      </View>
      {s.other ? (
        <View style={divider}>
          <H2>Also protected</H2>
          <Rich text={s.other} />
        </View>
      ) : null}
      {s.horse ? <View style={divider}><Rich text="State law also names miniature horses as service animals." /></View> : null}
      <Cite>Access law: {s.law}</Cite>
      <TextLink title="Read the statute" onPress={() => openLink(s.src)} />
      <Text style={[type.small, { color: c.muted }]} onPress={() => router.push('/state')}>Change state</Text>
    </Card>
  );
}
