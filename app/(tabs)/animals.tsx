import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ANIMAL_ROWS, SD_JOBS } from '../../src/data';
import { useColors, type } from '../../src/theme';
import { Screen, Card, Eyebrow, H1, H2, Muted, Rich, RuleList, Cite } from '../../src/components/ui';

function Section({ eyebrow, title, children, cite }: { eyebrow: string; title: string; children: React.ReactNode; cite?: string }) {
  return <Card><Eyebrow>{eyebrow}</Eyebrow><H2>{title}</H2>{children}{cite ? <Cite>{cite}</Cite> : null}</Card>;
}

export default function AnimalsTab() {
  const c = useColors();
  const tone = (k: string) => (k === 'y' ? c.ok : k === 'x' ? c.no : c.maybe);
  const COLS = ['Stores & restaurants', 'Housing', 'Airline cabin', 'Workplace'];
  return (
    <Screen>
      <H1>Which animals count?</H1>
      <Muted>Most arguments start here. Under the ADA, only dogs, and sometimes miniature horses, have the right to go into stores and restaurants. Other laws cover housing, flights, and work.</Muted>

      <ScrollView horizontal showsHorizontalScrollIndicator contentContainerStyle={{ borderWidth: 1, borderColor: c.line, borderRadius: 14, backgroundColor: c.surface }}>
        <View>
          <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: c.line }}>
            <Text style={{ width: 150, padding: 10, fontWeight: '700', color: c.ink }}>Animal</Text>
            {COLS.map(h => <Text key={h} style={{ width: 120, padding: 10, fontWeight: '700', color: c.ink }}>{h}</Text>)}
          </View>
          {ANIMAL_ROWS.map((r, i) => (
            <View key={i} style={{ flexDirection: 'row', borderTopWidth: i ? 1 : 0, borderTopColor: c.line }}>
              <Text style={{ width: 150, padding: 10, fontWeight: '700', color: c.ink }}>{r[0]}</Text>
              {[1, 3, 5, 7].map(j => <Text key={j} style={{ width: 120, padding: 10, fontWeight: '700', color: tone(r[j]) }}>{r[j + 1]}</Text>)}
            </View>
          ))}
        </View>
      </ScrollView>
      <Cite>Swipe the table sideways to see every column. “Case by case” at work means the employer decides through the ADA accommodation process. Housing follows the Fair Housing Act.</Cite>

      <H2>Kinds of service dogs</H2>
      <Muted small>Every service dog is trained to do a specific job. Naming the task is how a handler answers staff’s second question.</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 }}>
        {SD_JOBS.map(j => (
          <View key={j[0]} style={{ width: '48.5%', backgroundColor: c.surface, borderWidth: 1, borderColor: c.line, borderRadius: 14, padding: 12, gap: 4 }}>
            <Text style={{ fontWeight: '700', fontSize: 15, color: c.ink }}>{j[0]}</Text>
            <Text style={{ fontWeight: '700', fontSize: 12, color: c.accent }}>{j[1]}</Text>
            <Text style={[type.small, { color: c.muted }]}>{j[2]}</Text>
          </View>
        ))}
      </View>

      <Section eyebrow="Any breed, any size" title="Breed and size don’t matter" cite="DOJ ADA Service Animal FAQ">
        <Rich text="A service dog can be any breed, including pit bulls, rottweilers, and Chihuahuas. A city or county breed ban can’t be used to keep a service dog out. Each dog is judged by its own behavior." />
        <Rich text="The same goes for size. A small dog can do medical alert or psychiatric work, and a large dog can pull a wheelchair." />
      </Section>

      <Section eyebrow="Miniature horses" title="A separate rule for small horses" cite="28 CFR §36.302(c)(9) · 14 CFR §382.3">
        <Rich text="Miniature horses can be trained as guide animals and for mobility work. They usually stand 24 to 34 inches tall at the shoulder and weigh 70 to 100 pounds. They often have longer working lives than dogs." />
        <Rich text="Businesses must allow a trained miniature horse where it’s reasonable. They weigh four things:" />
        <RuleList items={[
          { text: 'Is the horse housebroken?', sym: '1' },
          { text: 'Is the horse under the handler’s control?', sym: '2' },
          { text: 'Can the place handle the horse’s type, size, and weight?', sym: '3' },
          { text: 'Would the horse’s presence compromise safety?', sym: '4' },
        ]} />
        <Rich text="Airlines aren’t required to accept miniature horses. Since 2021, federal airline rules only cover dogs." />
      </Section>

      <Section eyebrow="Emotional support animals" title="Comfort, not a trained task" cite="42 U.S.C. §3604(f) · 24 CFR §100.204">
        <Rich text="An emotional support animal helps a person with a disability just by being there. It doesn’t need special training, and it can be almost any species." />
        <RuleList items={[
          { text: '**Housing:** allowed in “no pets” housing, including college dorms, with no pet fees. The landlord may ask for a letter from a health care provider when the need isn’t obvious.', mark: 'tick' },
          { text: '**Stores, restaurants, and other public places:** no right to enter. The business’s pet rules apply.', mark: 'cross' },
          { text: '**Airlines:** treated as pets since 2021.', mark: 'cross' },
        ]} />
        <Rich text="Common household animals, such as dogs, cats, small birds, rabbits, and fish, are the easiest to get approved. For an unusual animal like a pig, snake, or monkey, expect to show a specific need for that animal." />
        <Rich text="Be careful with websites that sell instant letters or “registrations.” A letter from a provider who actually knows you carries much more weight. HUD withdrew its 2020 guidance on assistance animals in 2025, but the Fair Housing Act and its rules still apply." />
      </Section>

      <Section eyebrow="Psychiatric service dogs vs. emotional support" title="The task is the difference" cite="28 CFR §36.104">
        <Rich text="A dog trained to do a task for a mental health condition, such as interrupting a panic attack, waking someone from a nightmare, or blocking people in a crowd, is a service dog with full access rights." />
        <Rich text="A dog whose only job is to calm someone by being there is an emotional support animal, even if it helps a great deal." />
      </Section>

      <Section eyebrow="Therapy animals" title="They help other people">
        <Rich text="Therapy dogs, cats, and other animals visit hospitals, schools, nursing homes, and disaster areas to comfort other people. They’re often certified by groups like Pet Partners or Alliance of Therapy Dogs." />
        <Rich text="They don’t have public access rights. They go where the facility invites them. Their handler usually doesn’t have a disability." />
      </Section>

      <Section eyebrow="Service dogs in training" title="Depends on your state">
        <Rich text="The ADA doesn’t cover dogs in training. Most states give some access, often only when the dog is with a trainer. A few states, like Arizona, let owners train their own dogs in public. Hawaii gives no access. Pick your state on the Home tab to see its rule." />
      </Section>

      <Section eyebrow="Other species" title="Cats, monkeys, birds, pigs, reptiles" cite="28 CFR §36.104">
        <Rich text="Under the ADA, no other species can be a service animal, no matter how well trained. The Justice Department made this choice in 2010. Capuchin monkeys, for example, were once trained to help people with paralysis, but they’re no longer covered, partly because of disease and safety risks." />
        <Rich text="These animals may still qualify as emotional support animals in housing. In public places they follow the business’s pet rules." />
      </Section>

      <Section eyebrow="Working dogs" title="Police, search and rescue, detection, facility dogs">
        <Rich text="Police K9s, search and rescue dogs, and bomb or drug detection dogs aren’t service animals. They go where their agency’s job takes them, under agency rules and some state laws." />
        <Rich text="Facility dogs work in courthouses, hospitals, and schools, for example comforting a child who has to testify. They’re handled by professionals, so they aren’t service animals either. They’re there because the facility invited them." />
      </Section>
    </Screen>
  );
}
