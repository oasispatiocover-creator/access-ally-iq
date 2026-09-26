import React from 'react';
import { Image, View } from 'react-native';
import Constants from 'expo-constants';
import { Screen, Card, Eyebrow, H1, Muted, RuleList, Disclaimer } from '../src/components/ui';

export default function AboutScreen() {
  return (
    <Screen>
      <View style={{ alignSelf: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 8 }}>
        <Image source={require('../assets/logo.png')} style={{ width: 240, height: 192 }} resizeMode="contain" accessibilityLabel="Access Ally IQ. Clear answers. Equal access." />
      </View>
      <H1>About this information</H1>
      <Card>
        <Eyebrow>Review status</Eyebrow>
        <RuleList items={[
          { text: '**Federal rules:** researched from the ADA regulations and Justice Department guidance, September 2026.', mark: 'tick' },
          { text: '**State and territory laws:** researched from each state’s statutes, September 2026. Rechecked every year.', mark: 'tick' },
          { text: '**Place guides:** fact-checked against DOJ guidance and agency sources, September 2026.', mark: 'tick' },
          { text: '**Attorney review:** pending.', mark: 'warn' },
          { text: '**Spanish staff screen:** pending review by a native speaker.', mark: 'warn' },
        ]} />
      </Card>
      <Card>
        <Eyebrow>Accessibility</Eyebrow>
        <Muted>Built to work with VoiceOver, TalkBack, and large text. The staff screen is high contrast, keeps the screen awake, and can read itself aloud. Everything works offline.</Muted>
      </Card>
      <Muted small>Version {Constants.expoConfig?.version ?? '1.0.0'}</Muted>
      <Disclaimer />
    </Screen>
  );
}
