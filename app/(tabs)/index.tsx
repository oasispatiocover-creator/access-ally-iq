import React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../src/store';
import { useColors } from '../../src/theme';
import { Screen } from '../../src/components/ui';
import { HandlerHome, BusinessHome, PublicHome } from '../../src/screens/Home';

const LABEL = { handler: 'Handler view', business: 'Business view', public: 'Public view' };

export default function HomeTab() {
  const c = useColors();
  const router = useRouter();
  const { ready, role, roleChosen } = useApp();
  if (!ready) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}><ActivityIndicator /></View>;
  return (
    <Screen>
      {roleChosen ? (
        <Pressable accessibilityRole="button" accessibilityLabel={`${LABEL[role]}. Change who this app is for`} onPress={() => router.push('/role')}
          style={{ alignSelf: 'flex-start', borderWidth: 1, borderColor: c.line, backgroundColor: c.surface, borderRadius: 999, paddingHorizontal: 14, minHeight: 36, justifyContent: 'center' }}>
          <Text style={{ fontWeight: '700', fontSize: 13, color: c.muted }}>{LABEL[role]} ▾</Text>
        </Pressable>
      ) : null}
      {role === 'business' ? <BusinessHome /> : role === 'public' ? <PublicHome /> : <HandlerHome />}
    </Screen>
  );
}
