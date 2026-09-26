import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../store';
import { FLOW, SCRIPTS } from '../data';
import { useColors, type } from '../theme';
import { Icon } from '../components/Icon';
import { Card, Eyebrow, H1, H2, Muted, Cite, Rich, RuleList, TextLink, Menu, Disclaimer, Button, Mark } from '../components/ui';
import { StateCard, StatePicker } from '../components/StateCard';
import { RoleOptions } from '../components/RoleOptions';

function ShowStaffButton({ sub = 'Full-screen rules in English or Spanish' }: { sub?: string }) {
  const c = useColors();
  const router = useRouter();
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Show this to staff" onPress={() => router.push('/staff')}
      style={({ pressed }) => ({ backgroundColor: '#0A6FD0', borderRadius: 16, padding: 18, flexDirection: 'row', alignItems: 'center', gap: 14, opacity: pressed ? 0.9 : 1 })}>
      <Icon name="phone" size={34} color="#FFFFFF" />
      <View style={{ flex: 1 }}>
        <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 21 }}>Show this to staff</Text>
        <Text style={{ color: '#FFFFFF', opacity: 0.9, fontSize: 14, marginTop: 2 }}>{sub}</Text>
      </View>
    </Pressable>
  );
}

function Chooser() {
  const { roleChosen, setRole } = useApp();
  if (roleChosen) return null;
  return (
    <Card style={{ borderColor: '#0A6FD0' }}>
      <View style={{ alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 6 }}>
        <Image source={require('../../assets/logo.png')} style={{ width: 220, height: 176 }} resizeMode="contain" accessibilityLabel="Access Ally IQ. Clear answers. Equal access." />
      </View>
      <Eyebrow>Who are you here as?</Eyebrow>
      <Muted small>We’ll put what matters most to you first. You can switch any time.</Muted>
      <RoleOptions onPick={setRole} />
    </Card>
  );
}

function TwoQuestions() {
  const c = useColors();
  const router = useRouter();
  const Q = ({ n, t }: { n: number; t: string }) => (
    <View style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start' }}>
      <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: c.ink, alignItems: 'center', justifyContent: 'center' }}><Text style={{ color: c.bg, fontWeight: '800' }}>{n}</Text></View>
      <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: c.ink, lineHeight: 23 }}>{t}</Text>
    </View>
  );
  return (
    <Card>
      <Eyebrow>Staff may ask only two questions</Eyebrow>
      <Q n={1} t="Is the dog a service animal required because of a disability?" />
      <Q n={2} t="What work or task has the dog been trained to perform?" />
      <Muted small>This privacy rule comes from the ADA, not HIPAA. HIPAA only covers healthcare providers and insurers.</Muted>
      <TextLink title="Read more" onPress={() => router.push({ pathname: '/qa', params: { q: 'HIPAA' } })} />
      <Cite>28 CFR §36.302(c)(6)</Cite>
    </Card>
  );
}

function ProfileCard() {
  const c = useColors();
  const router = useRouter();
  const { profile } = useApp();
  if (!profile.dogName) {
    return (
      <Card>
        <Eyebrow>Your dog’s profile</Eyebrow>
        <Rich text="Add your dog’s name, a ready answer to “What task does it perform?”, and an emergency contact. They’ll show on the staff screen." />
        <View style={{ alignSelf: 'flex-start' }}><Button title="Set up profile" onPress={() => router.push('/profile')} /></View>
      </Card>
    );
  }
  return (
    <Card>
      <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
        {profile.photo ? <Image source={{ uri: profile.photo }} style={{ width: 64, height: 64, borderRadius: 14 }} accessibilityLabel={`Photo of ${profile.dogName}`} /> : null}
        <View style={{ flex: 1, gap: 2 }}>
          <Eyebrow>Your dog</Eyebrow>
          <H2>{profile.dogName}</H2>
          {profile.task ? <Text style={[type.small, { color: c.muted }]}>“{profile.task}”</Text> : null}
        </View>
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
        <TextLink title="Edit profile" onPress={() => router.push('/profile')} />
        <TextLink title="Incident log" onPress={() => router.push('/log')} />
        <TextLink title="Write a complaint" onPress={() => router.push('/letter')} />
      </View>
    </Card>
  );
}

export function HandlerHome() {
  const router = useRouter();
  return (
    <>
      <Chooser />
      <H1>Your dog’s rights, ready to show.</H1>
      <ShowStaffButton />
      <StatePicker />
      <ProfileCard />
      <TwoQuestions />
      <Card>
        <Eyebrow>Staff cannot</Eyebrow>
        <RuleList kind="cross" items={[
          'Ask for ID, a certificate, or a vest. There is no official registry.',
          'Ask about your disability or medical condition',
          'Ask the dog to demonstrate its task',
          'Charge a pet fee or deposit',
          'Refuse because of allergies or fear of dogs',
        ]} />
      </Card>
      <Card>
        <Eyebrow>Does a service dog need a vest?</Eyebrow>
        <H2>No. A vest is optional.</H2>
        <Rich text="Federal law does not require a service dog to wear a vest, patch, harness, ID tag, or special collar. A business can’t deny entry because the dog isn’t wearing one." />
        <RuleList items={[
          { text: '**Leash, harness, or tether is required** in public, unless it gets in the way of the dog’s task or the handler’s disability prevents it. Then the dog must be under voice or signal control.', mark: 'tick' },
          { text: 'Local dog licensing and vaccination rules still apply, the same as for any dog.', mark: 'tick' },
          { text: 'A vest doesn’t prove anything either. Staff may still ask the two questions whether or not the dog wears one.', mark: 'cross' },
        ]} />
        <Muted small>Many handlers choose a vest anyway because it tells people not to pet the dog and cuts down on questions.</Muted>
        <Cite>28 CFR §36.302(c)(4) · DOJ ADA Service Animal FAQ</Cite>
      </Card>
      <Card>
        <Eyebrow>A dog can be asked to leave only if</Eyebrow>
        <RuleList kind="warn" items={['It is out of control and the handler doesn’t take effective action', 'It is not housebroken']} />
        <Muted small>Even then, the person must be offered service without the dog.</Muted>
        <Cite>28 CFR §36.302(c)(2)–(3)</Cite>
      </Card>
      <Card>
        <Eyebrow>If you’re refused</Eyebrow>
        <Rich text="Stay calm and show the staff screen. If they still refuse, ask for a manager, then leave and write it down. Arguing can make an episode worse, and staying can lead to a trespass complaint. The complaint is where the business answers for it." />
        <TextLink title="See the 6 steps" onPress={() => router.push({ pathname: '/qa', params: { q: 'refuses my service dog' } })} />
      </Card>
      <StateCard />
      <Disclaimer />
    </>
  );
}

function Flow() {
  const c = useColors();
  const [path, setPath] = useState<string[]>(['start']);
  const cur: any = FLOW[path[path.length - 1]];
  const go = (k: 'yes' | 'no') => setPath(p => [...p, cur[k]]);
  const restart = () => setPath(['start']);
  if (cur.end) {
    return (
      <View style={{ gap: 12 }}>
        <View style={{ backgroundColor: cur.end === 'ok' ? c.okSoft : c.noSoft, borderRadius: 12, padding: 14 }}>
          <Rich text={cur.text} />
        </View>
        <View style={{ alignSelf: 'flex-start' }}><Button title="Start over" onPress={restart} /></View>
      </View>
    );
  }
  return (
    <View style={{ gap: 12 }} accessibilityLiveRegion="polite">
      {path.length > 1 ? <Text style={[type.small, { color: c.muted }]}>Step {path.length} · <Text style={{ color: c.accent, fontWeight: '700' }} onPress={restart}>Start over</Text></Text> : null}
      <Text style={{ fontSize: 19, fontWeight: '700', color: c.ink, lineHeight: 26 }}>{cur.q}</Text>
      {cur.note ? <Muted small>{cur.note}</Muted> : null}
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={{ flex: 1 }}><Button title="Yes" kind="ghost" onPress={() => go('yes')} /></View>
        <View style={{ flex: 1 }}><Button title="No" kind="ghost" onPress={() => go('no')} /></View>
      </View>
    </View>
  );
}

export function BusinessHome() {
  const c = useColors();
  const router = useRouter();
  return (
    <>
      <Chooser />
      <H1>A dog just walked in. Now what?</H1>
      <Card><Eyebrow>Decision guide</Eyebrow><Flow /></Card>
      <Card>
        <Eyebrow>What to say</Eyebrow>
        {SCRIPTS.map((s, i) => (
          <View key={i} style={{ backgroundColor: c.bg, borderRadius: 10, padding: 12, gap: 4 }}>
            <Text style={[type.eyebrow, { color: c.muted }]}>{s[0]}</Text>
            <Text style={[type.body, { color: c.ink }]}>{s[1]}</Text>
          </View>
        ))}
      </Card>
      <Card>
        <Eyebrow>Never do these</Eyebrow>
        <RuleList kind="cross" items={[
          'Ask for papers, an ID card, a certificate, or a vest',
          'Ask about the person’s disability or ask the dog to demonstrate',
          'Charge a pet fee, seat them apart, or make them wait outside',
          'Judge by breed, size, clothing, or whether the person “looks disabled”',
          'Make up an excuse to get them to leave',
        ]} />
      </Card>
      <Menu title="Train your team" items={[
        { title: 'Staff quiz', sub: '10 questions, with a completion record', onPress: () => router.push('/quiz') },
        { title: 'Sample service animal policy', sub: 'Fill in your business name and share it', onPress: () => router.push('/policy') },
        { title: 'Sign wording', sub: 'Replace “No pets” with signs that don’t invite a complaint', onPress: () => router.push('/signs') },
        { title: 'QR code door poster', sub: 'A sign customers scan to read your policy', onPress: () => router.push('/poster') },
        { title: 'Restaurants and the health code', sub: 'What the FDA Food Code allows', onPress: () => router.push('/foodcode') },
        { title: 'Get listed as a trained business', sub: 'Show handlers you’re ready', onPress: () => router.push('/directory') },
        { title: 'Free help for businesses', sub: 'ADA National Network and more', onPress: () => router.push('/help') },
      ]} />
      <StatePicker />
      <StateCard />
      <Disclaimer />
    </>
  );
}

export function PublicHome() {
  const router = useRouter();
  return (
    <>
      <Chooser />
      <H1>Service dogs are working. Here’s how to help.</H1>
      <Card>
        <Eyebrow>If you see a service dog</Eyebrow>
        <RuleList items={[
          { text: 'Don’t pet, call to, whistle at, or make eye contact with the dog. A distracted dog can miss a medical alert.', mark: 'cross' },
          { text: 'Don’t offer food or treats.', mark: 'cross' },
          { text: 'Don’t ask the person about their disability.', mark: 'cross' },
          { text: 'Keep your own dog away and on a short leash.', mark: 'cross' },
          { text: 'Talk to the person, not the dog. If you want to ask something, ask them.', mark: 'tick' },
          { text: 'A service dog alone may mean its handler needs help. Look around for the person. If someone needs help, call 911. Don’t follow the dog into traffic or unsafe places.', mark: 'tick' },
        ]} />
        <TextLink title="More etiquette, and what to teach kids" onPress={() => router.push({ pathname: '/guide/[id]', params: { id: 'etiquette' } })} />
      </Card>
      <Card>
        <Eyebrow>Think it’s a fake?</Eyebrow>
        <Rich text="Don’t confront the person. Businesses can ask two questions and can remove any dog that’s out of control. If a dog is causing a problem, tell a manager. Many states also fine people who pass off a pet as a service dog. Check your state below." />
        <TextLink title="Common myths about fakes" onPress={() => router.push({ pathname: '/qa', params: { q: 'fake' } })} />
      </Card>
      <Card>
        <Eyebrow>Worth knowing</Eyebrow>
        <RuleList items={[
          'Service dogs don’t need a vest, ID, or certificate.',
          'Many disabilities can’t be seen, such as diabetes, seizures, PTSD, or heart conditions.',
          'Emotional support animals aren’t service dogs and don’t have the right to enter stores.',
        ]} />
        <TextLink title="Which animals count" onPress={() => router.push('/animals')} />
      </Card>
      <StatePicker />
      <StateCard />
      <Disclaimer />
    </>
  );
}
