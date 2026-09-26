import React from 'react';
import { useRouter } from 'expo-router';
import { useApp } from '../src/store';
import { Screen, H1, Muted } from '../src/components/ui';
import { RoleOptions } from '../src/components/RoleOptions';

export default function RoleScreen() {
  const router = useRouter();
  const { setRole } = useApp();
  return (
    <Screen report={false}>
      <H1>Who are you here as?</H1>
      <Muted>We’ll put what matters most to you first. You can switch any time.</Muted>
      <RoleOptions onPick={r => { setRole(r); router.back(); }} />
    </Screen>
  );
}
