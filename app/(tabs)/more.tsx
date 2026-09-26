import React from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/store';
import { Screen, H1, Menu, Button, MenuItem } from '../../src/components/ui';

export default function MoreTab() {
  const router = useRouter();
  const { role } = useApp();
  const go = (path: any) => () => router.push(path);
  const guide = (id: string) => go({ pathname: '/guide/[id]', params: { id } });

  const handler: MenuItem[] = [
    { title: 'Dog profile', sub: 'Name, task answer, emergency info', onPress: go('/profile') },
    { title: 'Incident log', sub: 'Write down what happened', onPress: go('/log') },
    { title: 'Write a complaint', sub: 'Turn a log entry into a letter', onPress: go('/letter') },
    { title: 'Asking your landlord', sub: 'Steps and a sample request', onPress: go('/request/housing') },
    { title: 'Asking your employer', sub: 'Steps and a sample request', onPress: go('/request/work') },
  ];
  const business: MenuItem[] = [
    { title: 'Staff quiz', sub: '10 questions, with a completion record', onPress: go('/quiz') },
    { title: 'Sample policy', sub: 'Fill in and share', onPress: go('/policy') },
    { title: 'Sign wording', sub: 'Better than “No pets”', onPress: go('/signs') },
    { title: 'QR code door poster', sub: 'A sign that links to your policy', onPress: go('/poster') },
    { title: 'Restaurants and the health code', sub: 'FDA Food Code rules', onPress: go('/foodcode') },
    { title: 'Trained business directory', sub: 'Get listed', onPress: go('/directory') },
  ];
  const guides: MenuItem[] = [
    { title: 'Getting a service dog', sub: 'Programs, owner training, scams', onPress: guide('getdog') },
    { title: 'Etiquette for the public', sub: 'And what to teach kids', onPress: guide('etiquette') },
    { title: 'Medical emergencies', sub: 'If a handler can’t respond', onPress: guide('emergency') },
    { title: 'Two service dogs', sub: 'When one isn’t enough', onPress: guide('twodogs') },
    { title: 'Children and teens', sub: 'Kids, school, and handlers', onPress: guide('minors') },
    { title: 'Veterans', sub: 'VA benefits and PTSD programs', onPress: guide('veterans') },
    { title: 'Traveling abroad', sub: 'Mexico, Canada, coming home', onPress: guide('abroad') },
    { title: 'Heat and paw safety', sub: 'Hot pavement and heatstroke', onPress: guide('heat') },
    { title: 'Retiring a service dog', sub: 'What changes and what’s next', onPress: guide('retire') },
  ];
  const help: MenuItem[] = [
    { title: 'Free help', sub: 'Phone lines and legal aid', onPress: go('/help') },
    { title: 'Privacy', sub: 'Where your data lives', onPress: go('/privacy') },
    { title: 'About this information', sub: 'Sources and review status', onPress: go('/about') },
  ];
  const sections = role === 'business'
    ? [['For businesses', business], ['Guides', guides], ['Handler tools', handler]]
    : role === 'public'
      ? [['Guides', guides], ['For businesses', business], ['Handler tools', handler]]
      : [['Your tools', handler], ['Guides', guides], ['For businesses', business]];

  return (
    <Screen>
      <H1>More</H1>
      {sections.map(([t, items]) => <Menu key={t as string} title={t as string} items={items as MenuItem[]} />)}
      <Menu title="Help and about" items={help} />
      <Button title="Switch who this app is for" kind="ghost" onPress={go('/role')} />
    </Screen>
  );
}
