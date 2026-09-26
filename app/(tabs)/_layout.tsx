import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { Tabs, useRouter } from 'expo-router';
import { useColors } from '../../src/theme';
import { Icon } from '../../src/components/Icon';

function Brand() {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }} accessible accessibilityLabel="Access Ally IQ">
      <View style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 2 }}>
        <Image source={require('../../assets/logo-mark.png')} style={{ width: 34, height: 27 }} resizeMode="contain" />
      </View>
      <Text style={{ fontWeight: '800', fontSize: 18, color: c.ink }}>
        Access Ally <Text style={{ color: c.accent }}>IQ</Text>
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const c = useColors();
  const router = useRouter();
  const tab = (name: string) => ({ color }: { color: string }) => <Icon name={name} color={color} size={24} />;
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: c.surface },
        headerTitle: () => <Brand />,
        headerTitleAlign: 'left',
        headerRight: () => (
          <Pressable accessibilityRole="button" accessibilityLabel="Search everything" onPress={() => router.push('/search')} hitSlop={10} style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            <Icon name="search" color={c.ink} size={24} />
          </Pressable>
        ),
        tabBarActiveTintColor: c.accent,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.line },
        tabBarLabelStyle: { fontWeight: '700', fontSize: 12 },
        sceneStyle: { backgroundColor: c.bg },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: tab('home') }} />
      <Tabs.Screen name="places" options={{ title: 'Places', tabBarIcon: tab('places') }} />
      <Tabs.Screen name="qa" options={{ title: 'Q&A', tabBarIcon: tab('qa') }} />
      <Tabs.Screen name="animals" options={{ title: 'Animals', tabBarIcon: tab('animals') }} />
      <Tabs.Screen name="more" options={{ title: 'More', tabBarIcon: tab('more') }} />
    </Tabs>
  );
}
