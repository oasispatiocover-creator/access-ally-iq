import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { QUIZ } from '../src/data';
import { useColors, type } from '../src/theme';
import { Screen, Card, Eyebrow, H1, H2, Muted, Field, Button } from '../src/components/ui';
import { shareText } from '../src/lib/share';

export default function QuizScreen() {
  const c = useColors();
  const [ans, setAns] = useState<(number | undefined)[]>([]);
  const [name, setName] = useState('');
  const done = ans.filter(a => a !== undefined).length;
  const score = ans.reduce((n, a, i) => n + (a === QUIZ[i][2] ? 1 : 0), 0);
  const passed = done === QUIZ.length && score >= 8;
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const record = `${name.trim() || '[Name]'} completed Access Ally IQ service animal training for staff on ${date}, scoring ${score} of ${QUIZ.length}. This is a training record, not a government certification.`;

  return (
    <Screen>
      <H1>Staff quiz</H1>
      <Muted>Ten real situations. Tap an answer to see why.</Muted>
      {QUIZ.map(([q, opts, right, why], i) => {
        const a = ans[i];
        return (
          <Card key={i}>
            <Eyebrow>Question {i + 1}</Eyebrow>
            <Text style={{ fontSize: 17, fontWeight: '700', color: c.ink, lineHeight: 24 }}>{q}</Text>
            {opts.map((o, j) => {
              const state = a === undefined ? 'idle' : j === right ? 'right' : j === a ? 'wrong' : 'idle';
              const bg = state === 'right' ? c.okSoft : state === 'wrong' ? c.noSoft : c.bg;
              const bd = state === 'right' ? c.ok : state === 'wrong' ? c.no : c.line;
              return (
                <Pressable key={j} accessibilityRole="button" disabled={a !== undefined} accessibilityState={{ selected: a === j, disabled: a !== undefined }}
                  onPress={() => setAns(x => { const n = [...x]; n[i] = j; return n; })}
                  style={{ minHeight: 46, justifyContent: 'center', borderWidth: 1, borderColor: bd, backgroundColor: bg, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 }}>
                  <Text style={[type.body, { color: c.ink }]}>{o}</Text>
                </Pressable>
              );
            })}
            {a !== undefined ? <Text accessibilityLiveRegion="polite" style={[type.small, { color: c.muted }]}>{a === right ? 'Correct. ' : 'Not quite. '}{why}</Text> : null}
          </Card>
        );
      })}
      <Card>
        <Eyebrow>Your score</Eyebrow>
        <H2>{score} of {QUIZ.length}{done < QUIZ.length ? ` · ${QUIZ.length - done} left` : ''}</H2>
        {done === QUIZ.length ? (
          passed ? (
            <View style={{ gap: 10 }}>
              <Muted>You passed. Enter your name for a completion record your manager can keep.</Muted>
              <Field label="Your name" value={name} onChangeText={setName} placeholder="First and last name" />
              <View style={{ backgroundColor: c.bg, borderRadius: 12, padding: 14, gap: 6 }}>
                <Eyebrow>Completion record</Eyebrow>
                <Text style={[type.body, { color: c.ink }]}>{record}</Text>
              </View>
              <Button title="Share the record" icon="share" onPress={() => shareText(record, 'Training record')} />
            </View>
          ) : <Muted>Review the answers above and try again. You need 8 of 10 to pass.</Muted>
        ) : null}
        {done === QUIZ.length ? <Button title="Retake quiz" kind="ghost" onPress={() => { setAns([]); setName(''); }} /> : null}
      </Card>
    </Screen>
  );
}
