import React from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, Text, TextInput, View, ViewStyle, TextInputProps } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useColors, type } from '../theme';
import { Icon } from './Icon';
import type { Block } from '../data';

/** A scrolling page with consistent padding and a "Report a problem" link at the bottom. */
export function Screen({ children, report = true, pad = true }: { children: React.ReactNode; report?: boolean; pad?: boolean }) {
  const c = useColors();
  const router = useRouter();
  const path = usePathname();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: c.bg }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}>
      <ScrollView style={{ flex: 1, backgroundColor: c.bg }} contentContainerStyle={{ padding: pad ? 16 : 0, paddingBottom: 40, gap: 16 }}
        keyboardShouldPersistTaps="handled" automaticallyAdjustKeyboardInsets={false}>
        {children}
        {report && (
          <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/report', params: { page: path } })} style={{ alignSelf: 'center', padding: 12, minHeight: 44 }}>
            <Text style={{ color: c.muted, textDecorationLine: 'underline', ...type.small }}>Report a problem with this page</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const c = useColors();
  return <View style={[{ backgroundColor: c.surface, borderColor: c.line, borderWidth: 1, borderRadius: 14, padding: 16, gap: 10 }, style]}>{children}</View>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <Text style={[type.eyebrow, { color: c.muted }]}>{children}</Text>;
}
export function H1({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <Text accessibilityRole="header" style={[type.h1, { color: c.ink }]}>{children}</Text>;
}
export function H2({ children }: { children: React.ReactNode }) {
  const c = useColors();
  return <Text accessibilityRole="header" style={[type.h2, { color: c.ink }]}>{children}</Text>;
}
export function Muted({ children, small }: { children: React.ReactNode; small?: boolean }) {
  const c = useColors();
  return <Text style={[small ? type.small : type.body, { color: c.muted }]}>{children}</Text>;
}
export function Cite({ children }: { children: React.ReactNode }) {
  const c = useColors();
  if (!children) return null;
  return <Text style={[type.cite, { color: c.muted }]}>{children}</Text>;
}

/** Renders text with **bold** segments and \n line breaks. */
export function Rich({ text, style }: { text: string; style?: any }) {
  const c = useColors();
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g).filter(Boolean);
  return (
    <Text style={[type.body, { color: c.ink }, style]}>
      {parts.map((p, i) => (p.startsWith('**') ? <Text key={i} style={{ fontWeight: '700' }}>{p.slice(2, -2)}</Text> : <Text key={i}>{p}</Text>))}
    </Text>
  );
}

export function Mark({ kind, sym }: { kind: 'tick' | 'cross' | 'dot' | 'warn'; sym?: string }) {
  const c = useColors();
  const map = { tick: [c.okSoft, c.ok, '✓'], cross: [c.noSoft, c.no, '✕'], dot: ['transparent', c.muted, '•'], warn: [c.maybeSoft, c.maybe, '!'] } as const;
  const [bg, fg, d] = map[kind];
  return (
    <View accessibilityElementsHidden importantForAccessibility="no" style={{ width: 22, height: 22, borderRadius: 6, backgroundColor: bg, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
      <Text style={{ color: fg, fontWeight: '700', fontSize: 13 }}>{sym || d}</Text>
    </View>
  );
}

export function RuleList({ items, kind = 'tick' }: { items: (string | { text: string; mark?: any; sym?: string })[]; kind?: 'tick' | 'cross' | 'dot' | 'warn' }) {
  return (
    <View style={{ gap: 8 }}>
      {items.map((it, i) => {
        const text = typeof it === 'string' ? it : it.text;
        const k = typeof it === 'string' ? kind : (it.mark || kind);
        const sym = typeof it === 'string' ? undefined : it.sym;
        return (
          <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
            <Mark kind={k} sym={sym} />
            <View style={{ flex: 1 }}><Rich text={text} /></View>
          </View>
        );
      })}
    </View>
  );
}

export function Steps({ items }: { items: string[] }) {
  const c = useColors();
  return (
    <View style={{ gap: 10 }}>
      {items.map((t, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
          <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: c.bg, fontWeight: '700' }}>{i + 1}</Text>
          </View>
          <View style={{ flex: 1, paddingTop: 2 }}><Rich text={t} /></View>
        </View>
      ))}
    </View>
  );
}

export function LinkRow({ label, hint, url, onPress }: { label: string; hint?: string; url?: string; onPress?: () => void }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="link" accessibilityHint={url ? 'Opens in your browser' : undefined} onPress={onPress || (() => url && openLink(url))}
      style={({ pressed }) => ({ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 12, backgroundColor: pressed ? c.accentSoft : c.bg })}>
      <Text style={[type.body, { color: c.ink, flex: 1 }]}>{label}</Text>
      {hint ? <Text style={[type.small, { color: c.muted }]}>{hint}</Text> : null}
      <Icon name="chevron" size={16} color={c.muted} />
    </Pressable>
  );
}

export function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <View style={{ gap: 10 }}>
      {blocks.map((b, i) => {
        if (b.type === 'p') return <Rich key={i} text={b.text} />;
        if (b.type === 'list') return <RuleList key={i} items={b.items} />;
        if (b.type === 'steps') return <Steps key={i} items={b.items} />;
        return <View key={i} style={{ gap: 8 }}>{b.items.map((l, j) => <LinkRow key={j} label={l.label} url={l.url} hint="Opens site" />)}</View>;
      })}
    </View>
  );
}

export function Verdict({ v }: { v: 'myth' | 'true' | 'part' | 'yes' | 'trainer_only' | 'no' | 'penalized' | 'none' }) {
  const c = useColors();
  const map: Record<string, [string, string, string]> = {
    myth: ['Myth', c.noSoft, c.no], true: ['True', c.okSoft, c.ok], part: ['Partly true', c.maybeSoft, c.maybe],
    yes: ['Yes', c.okSoft, c.ok], trainer_only: ['With a trainer only', c.maybeSoft, c.maybe], no: ['No', c.noSoft, c.no],
    penalized: ['Penalized', c.okSoft, c.ok], none: ['No state penalty', c.noSoft, c.no],
  };
  const [label, bg, fg] = map[v];
  return (
    <View style={{ alignSelf: 'flex-start', backgroundColor: bg, borderRadius: 6, paddingHorizontal: 9, paddingVertical: 3 }}>
      <Text style={{ color: fg, fontWeight: '700', fontSize: 12, letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</Text>
    </View>
  );
}

export function Button({ title, onPress, kind = 'primary', icon, disabled }: { title: string; onPress: () => void; kind?: 'primary' | 'accent' | 'ghost' | 'danger'; icon?: string; disabled?: boolean }) {
  const c = useColors();
  const bg = kind === 'primary' ? c.ink : kind === 'accent' ? c.accent : kind === 'danger' ? c.no : 'transparent';
  const fg = kind === 'ghost' ? c.ink : kind === 'accent' ? c.accentInk : c.bg;
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress}
      style={({ pressed }) => ({ minHeight: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingHorizontal: 18, borderRadius: 12, backgroundColor: bg, borderWidth: kind === 'ghost' ? 1.5 : 0, borderColor: c.ink, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 })}>
      {icon ? <Icon name={icon} size={18} color={fg} /> : null}
      <Text style={{ color: fg, fontWeight: '700', fontSize: 16 }}>{title}</Text>
    </Pressable>
  );
}

export function TextLink({ title, onPress }: { title: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="link" onPress={onPress} hitSlop={8} style={{ alignSelf: 'flex-start', paddingVertical: 4 }}>
      <Text style={{ color: c.accent, fontWeight: '700', fontSize: 16 }}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ label, selected, onPress }: { label: string; selected?: boolean; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected: !!selected }} onPress={onPress}
      style={{ minHeight: 36, justifyContent: 'center', paddingHorizontal: 14, borderRadius: 999, borderWidth: 1, borderColor: selected ? c.ink : c.line, backgroundColor: selected ? c.ink : c.surface }}>
      <Text style={{ fontWeight: '700', fontSize: 14, color: selected ? c.bg : c.muted }}>{label}</Text>
    </Pressable>
  );
}

export function Field({ label, style, ...props }: TextInputProps & { label: string }) {
  const c = useColors();
  return (
    <View style={{ gap: 6 }}>
      <Text style={{ fontWeight: '700', fontSize: 14, color: c.ink }}>{label}</Text>
      <TextInput placeholderTextColor={c.muted} accessibilityLabel={label}
        style={[{ minHeight: 46, borderWidth: 1, borderColor: c.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 16, color: c.ink, backgroundColor: c.bg }, props.multiline ? { minHeight: 100, textAlignVertical: 'top' } : null, style]}
        {...props} />
    </View>
  );
}

export function SearchBox({ value, onChangeText, placeholder }: { value: string; onChangeText: (t: string) => void; placeholder: string }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: c.line, borderRadius: 12, paddingHorizontal: 12, backgroundColor: c.surface }}>
      <Icon name="search" size={18} color={c.muted} />
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={c.muted} accessibilityLabel={placeholder}
        returnKeyType="search" clearButtonMode="while-editing" style={{ flex: 1, minHeight: 46, fontSize: 16, color: c.ink }} />
    </View>
  );
}

export type MenuItem = { title: string; sub?: string; onPress: () => void };
export function Menu({ title, items }: { title?: string; items: MenuItem[] }) {
  const c = useColors();
  return (
    <View style={{ gap: 8 }}>
      {title ? <Text style={[type.eyebrow, { color: c.muted }]}>{title}</Text> : null}
      <View style={{ backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 14, overflow: 'hidden' }}>
        {items.map((it, i) => (
          <Pressable key={i} accessibilityRole="button" onPress={it.onPress}
            style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, paddingHorizontal: 16, borderTopWidth: i ? 1 : 0, borderTopColor: c.line, backgroundColor: pressed ? c.accentSoft : 'transparent' })}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: '700', fontSize: 16, color: c.ink }}>{it.title}</Text>
              {it.sub ? <Text style={[type.small, { color: c.muted }]}>{it.sub}</Text> : null}
            </View>
            <Icon name="chevron" size={18} color={c.muted} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export function Disclaimer() {
  return <Muted small>Access Ally IQ gives general legal information, not legal advice. Federal and state rules were last reviewed September 2026.</Muted>;
}

/** Opens a link, showing a message instead of failing silently when it can't. */
export function openLink(url: string) {
  Linking.openURL(url).catch(() => Alert.alert('Couldn’t open this link', url));
}
