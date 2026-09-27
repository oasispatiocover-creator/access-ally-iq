import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import { useApp, Profile, deletePhoto } from '../src/store';
import { TASK_IDEAS } from '../src/data';
import { useColors } from '../src/theme';
import { Screen, Card, Eyebrow, H1, Muted, Field, Button, Chip } from '../src/components/ui';

export default function ProfileScreen() {
  const c = useColors();
  const router = useRouter();
  const { profile, saveProfile, ready } = useApp();
  const [p, setP] = useState<Profile>({ showEmergency: true, ...profile });
  const set = (k: keyof Profile) => (v: any) => setP(x => ({ ...x, [k]: v }));
  // If this screen opens before saved data has loaded, fill the form once it arrives.
  useEffect(() => { if (ready) setP({ showEmergency: true, ...profile }); }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // The photo is copied into the app's own documents folder and only its path is saved,
  // so large photos never go into on-device storage (Android limits entries to about 2 MB).
  const pickPhoto = async () => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.5 });
      if (res.canceled || !res.assets?.[0]?.uri) return;
      const src = new File(res.assets[0].uri);
      const ext = (src.extension || '.jpg').replace(/^\./, '').toLowerCase() || 'jpg';
      const dest = new File(Paths.document, `dog-photo-${Date.now()}.${ext}`);
      await src.copy(dest);
      if (p.photo) deletePhoto(p.photo);
      set('photo')(dest.uri);
    } catch {
      Alert.alert('Couldn’t add the photo', 'Try a different picture.');
    }
  };

  const save = () => {
    if (!p.dogName?.trim()) { Alert.alert('Add your dog’s name', 'The name shows on the staff screen.'); return; }
    saveProfile({ ...p, dogName: p.dogName.trim() });
    router.back();
  };

  if (!ready) return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: c.bg }}><ActivityIndicator /></View>;
  return (
    <Screen>
      <H1>Your dog’s profile</H1>
      <Muted>Saved only on this phone. The name, task, and emergency info appear on the staff screen.</Muted>
      <Card>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
          {p.photo ? <Image source={{ uri: p.photo }} style={{ width: 72, height: 72, borderRadius: 14 }} accessibilityLabel="Your dog’s photo" />
            : <View style={{ width: 72, height: 72, borderRadius: 14, backgroundColor: c.bg, borderWidth: 1, borderColor: c.line }} />}
          <View style={{ flex: 1, gap: 6 }}>
            <Button title={p.photo ? 'Change photo' : 'Add a photo'} kind="ghost" onPress={pickPhoto} />
            {p.photo ? <Pressable onPress={() => set('photo')(undefined)} accessibilityRole="button" hitSlop={10} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: c.no, fontWeight: '700' }}>Remove photo</Text></Pressable> : null}
          </View>
        </View>
        <Field label="Dog’s name" value={p.dogName || ''} onChangeText={set('dogName')} />
        <Field label="Breed (optional)" value={p.breed || ''} onChangeText={set('breed')} />
        <Field label="Your answer to “What task is it trained to do?”" value={p.task || ''} onChangeText={set('task')} multiline placeholder="Describe the task, not your condition" />
        <Muted small>Ideas. Tap one to use it, then make it yours:</Muted>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {TASK_IDEAS.map((t, i) => <Chip key={i} label={t.split(' ').slice(1, 5).join(' ') + '…'} onPress={() => set('task')(t)} />)}
        </View>
      </Card>
      <Card>
        <Eyebrow>Emergency</Eyebrow>
        <Field label="Contact name" value={p.contactName || ''} onChangeText={set('contactName')} />
        <Field label="Contact phone" value={p.contactPhone || ''} onChangeText={set('contactPhone')} keyboardType="phone-pad" />
        <Field label="If I can’t respond" value={p.notes || ''} onChangeText={set('notes')} multiline placeholder="e.g. I have seizures. Keep my dog with me. Medicine is in my bag." />
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Text style={{ flex: 1, fontSize: 16, color: c.ink }}>Show emergency info on the staff screen</Text>
          <Switch value={p.showEmergency !== false} onValueChange={set('showEmergency')} accessibilityLabel="Show emergency info on the staff screen" />
        </View>
      </Card>
      <Card>
        <Eyebrow>Records</Eyebrow>
        <Field label="Rabies shot date" value={p.rabies || ''} onChangeText={set('rabies')} placeholder="MM/DD/YYYY" />
        <Field label="Microchip number" value={p.chip || ''} onChangeText={set('chip')} />
        <Field label="Vet name and phone" value={p.vet || ''} onChangeText={set('vet')} />
      </Card>
      <Button title="Save profile" onPress={save} />
    </Screen>
  );
}
