import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useKeepAwake } from 'expo-keep-awake';
import * as Speech from 'expo-speech';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../src/store';
import { STAFF_TXT, STATES } from '../src/data';
import { Icon } from '../src/components/Icon';

const NAVY = '#0B2350';
const MUTED = '#B9C6D6';

function Pill({ label, onPress, active, a11y }: { label: string; onPress: () => void; active?: boolean; a11y?: string }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={a11y || label} accessibilityState={{ selected: !!active }} onPress={onPress} hitSlop={6}
      style={{ minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 14, borderRadius: 999, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.45)', backgroundColor: active ? '#FFFFFF' : 'transparent' }}>
      <Text style={{ color: active ? NAVY : '#FFFFFF', fontWeight: '700', fontSize: 15 }}>{label}</Text>
    </Pressable>
  );
}

export default function StaffScreen() {
  useKeepAwake();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { place } = useLocalSearchParams<{ place?: string }>();
  const { profile: pr, state } = useApp();
  const [lang, setLang] = useState<'en' | 'es'>('en');
  const [big, setBig] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const T = STAFF_TXT[lang];
  const s = STATES[state];
  const k = big ? 1.25 : 1;
  const showE = pr.showEmergency !== false && !!(pr.contactName || pr.contactPhone || pr.notes);

  useEffect(() => () => { Speech.stop(); }, []);

  const read = async () => {
    if (speaking) { Speech.stop(); setSpeaking(false); return; }
    const parts: string[] = [T.h1];
    if (pr.dogName) parts.push(`${T.dog}: ${pr.dogName}.` + (pr.task ? ` ${T.task}: ${pr.task}` : ''));
    parts.push(T.mayask, T.q1.replace(/^1\. /, ''), T.q2.replace(/^2\. /, ''), T.maynot, ...T.list, T.applies, T.remove);
    if (showE) {
      parts.push(`${T.emerg}. ${T.emergDo}`);
      if (pr.notes) parts.push(pr.notes);
      if (pr.contactName || pr.contactPhone) parts.push(`${T.contact}: ${pr.contactName || ''} ${pr.contactPhone || ''}`);
    }
    setSpeaking(true);
    Speech.speak(parts.join('. '), {
      language: lang === 'es' ? 'es-US' : 'en-US',
      rate: 0.95,
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const close = () => { Speech.stop(); router.back(); };
  const P = ({ children, sub, bold }: { children: React.ReactNode; sub?: boolean; bold?: boolean }) => (
    <Text style={{ color: sub ? MUTED : '#FFFFFF', fontSize: 18 * k, lineHeight: 26 * k, fontWeight: bold ? '700' : '400' }}>{children}</Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: NAVY }}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: insets.bottom + 32, paddingHorizontal: 18, gap: 18 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <Pill label={T.close} onPress={close} />
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pill label="EN" a11y="English" active={lang === 'en'} onPress={() => { Speech.stop(); setSpeaking(false); setLang('en'); }} />
            <Pill label="ES" a11y="Español" active={lang === 'es'} onPress={() => { Speech.stop(); setSpeaking(false); setLang('es'); }} />
            <Pill label={big ? 'A−' : 'A+'} a11y={big ? T.normal : T.bigger} onPress={() => setBig(b => !b)} />
          </View>
        </View>

        <Pressable accessibilityRole="button" onPress={read}
          style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: speaking ? '#12B5C4' : '#FFFFFF', borderRadius: 999, paddingHorizontal: 16, minHeight: 44 }}>
          <Icon name="speaker" size={20} color={NAVY} />
          <Text style={{ color: NAVY, fontWeight: '700', fontSize: 15 }}>{speaking ? T.stop : T.read}</Text>
        </Pressable>

        <View style={{ alignSelf: 'flex-start', backgroundColor: '#0A6FD0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '700', letterSpacing: 1, fontSize: 13 }}>{T.badge.toUpperCase()}</Text>
        </View>
        <Text accessibilityRole="header" style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 28 * k, lineHeight: 34 * k }}>{T.h1}</Text>

        {pr.dogName ? (
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            {pr.photo ? <Image source={{ uri: pr.photo }} style={{ width: 64, height: 64, borderRadius: 12 }} accessibilityIgnoresInvertColors /> : null}
            <View style={{ flex: 1 }}>
              <Text style={{ color: MUTED, fontSize: 14 }}>{T.dog}</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 22 * k, fontWeight: '800' }}>{pr.dogName}</Text>
              {pr.task ? <P><Text style={{ color: MUTED }}>{T.task}: </Text>{pr.task}</P> : null}
            </View>
          </View>
        ) : null}

        <View style={{ borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)', borderRadius: 14, padding: 14, gap: 10 }}>
          <P sub>{T.mayask}</P>
          <Text style={{ color: '#FFFFFF', fontSize: 20 * k, lineHeight: 27 * k, fontWeight: '700' }}>{T.q1}</Text>
          <Text style={{ color: '#FFFFFF', fontSize: 20 * k, lineHeight: 27 * k, fontWeight: '700' }}>{T.q2}</Text>
        </View>

        <View style={{ gap: 6 }}>
          <P bold>{T.maynot}</P>
          {T.list.map((x: string, i: number) => <P key={i}>•  {x}</P>)}
        </View>
        <P>{T.applies}</P>
        <P>{T.remove}</P>
        {place === 'airlines' ? <P>{T.airline}</P> : null}
        {s && s.tr === 'yes' ? <P sub>{T.training.replace('{STATE}', s.name).replace('{LAW}', s.law)}</P> : null}

        {showE ? (
          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 14, padding: 14, gap: 6 }}>
            <Text style={{ color: NAVY, fontWeight: '800', fontSize: 18 * k }}>{T.emerg}</Text>
            <Text style={{ color: NAVY, fontSize: 17 * k, lineHeight: 24 * k }}>{T.emergDo}</Text>
            {pr.notes ? <Text style={{ color: NAVY, fontSize: 17 * k, lineHeight: 24 * k }}>{pr.notes}</Text> : null}
            {pr.contactName || pr.contactPhone ? (
              <Text selectable style={{ color: NAVY, fontSize: 17 * k }}><Text style={{ fontWeight: '700' }}>{T.contact}: </Text>{pr.contactName} {pr.contactPhone}</Text>
            ) : null}
          </View>
        ) : null}

        <Text style={{ color: MUTED, fontSize: 13 }}>28 CFR §35.136 and §36.302(c) · ADA.gov · ADA Information Line 800-514-0301</Text>
      </ScrollView>
    </View>
  );
}
