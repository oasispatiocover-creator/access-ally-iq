import React, { useRef, useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useColors } from '../src/theme';
import { Screen, H1, Muted, Field, Chip, Button } from '../src/components/ui';

const LINES = {
  pets: 'Pets are not permitted inside.',
  esa: 'Emotional support animals are not service animals.',
  patio: 'Well-behaved pets welcome on the patio.',
};
const NAVY = '#0B2350';

export default function PosterScreen() {
  const c = useColors();
  const ref = useRef<View>(null);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [line, setLine] = useState<keyof typeof LINES>('pets');
  const target = url.trim() || 'https://www.ada.gov/topics/service-animals/';

  const save = async () => {
    try {
      const uri = await captureRef(ref, { format: 'png', quality: 1, width: 1275, height: 1650 });
      if (!(await Sharing.isAvailableAsync())) { Alert.alert('Sharing isn’t available', 'Take a screenshot of the poster instead.'); return; }
      await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Save or print the poster', UTI: 'public.png' });
    } catch {
      Alert.alert('Couldn’t create the image', 'Take a screenshot of the poster instead.');
    }
  };

  return (
    <Screen>
      <H1>QR code door poster</H1>
      <Muted>A sign for your door or counter. Customers and staff scan the code to read your service animal policy.</Muted>
      <Field label="Business name" value={name} onChangeText={setName} placeholder="e.g. Saguaro Street Café" />
      <Field label="Link to your policy" value={url} onChangeText={setUrl} placeholder="https://yourbusiness.com/service-animals" autoCapitalize="none" keyboardType="url" autoCorrect={false} maxLength={300} />
      <Muted small>Post your policy on your website or Google business profile, then paste the link here. With no link, the code goes to the Justice Department’s service animal page.</Muted>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <Chip label="No pets inside" selected={line === 'pets'} onPress={() => setLine('pets')} />
        <Chip label="Emotional support note" selected={line === 'esa'} onPress={() => setLine('esa')} />
        <Chip label="Pets on patio" selected={line === 'patio'} onPress={() => setLine('patio')} />
      </View>

      {/* The poster itself: letter proportions (8.5 x 11). Captured as an image when saved. */}
      <View ref={ref} collapsable={false} style={{ width: '100%', aspectRatio: 8.5 / 11, backgroundColor: '#FFFFFF', borderRadius: 4, overflow: 'hidden', borderWidth: 1, borderColor: c.line }}>
        <View style={{ backgroundColor: NAVY, paddingVertical: 18, paddingHorizontal: 12, borderBottomWidth: 5, borderBottomColor: '#12B5C4' }}>
          <Text style={{ color: '#FFFFFF', fontSize: 30, fontWeight: '800', textAlign: 'center' }}>Service animals welcome</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly', paddingHorizontal: 16 }}>
          <Text style={{ color: NAVY, fontSize: 17, fontWeight: '700', textAlign: 'center' }}>{LINES[line]}</Text>
          <QRCode value={target} size={150} color={NAVY} backgroundColor="#FFFFFF" onError={() => Alert.alert('That link is too long for a QR code', 'Try a shorter link.')} />
          <Text style={{ color: NAVY, fontSize: 15, fontWeight: '700', textAlign: 'center' }}>{url.trim() ? 'Scan to read our service animal policy' : 'Scan to learn the service animal rules'}</Text>
          <Text style={{ color: '#3A4A63', fontSize: 12, textAlign: 'center' }}>Staff may ask only: Is the dog a service animal required because of a disability? What task is it trained to perform?</Text>
          {name.trim() ? <Text style={{ color: NAVY, fontSize: 20, fontWeight: '800', textAlign: 'center' }}>{name.trim()}</Text> : null}
        </View>
        <View style={{ backgroundColor: '#EEF3F8', flexDirection: 'row', alignItems: 'center', gap: 10, padding: 10 }}>
          <Image source={require('../assets/logo.png')} style={{ width: 60, height: 48 }} resizeMode="contain" />
          <Text style={{ color: NAVY, fontSize: 12, fontWeight: '700', flex: 1 }}>Our staff is trained on service animal rules.</Text>
        </View>
      </View>

      <Button title="Save, share, or print poster" icon="share" onPress={save} />
    </Screen>
  );
}
