import React, { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useColors } from '../theme';
import { Button, Muted } from './ui';
import { shareText } from '../lib/share';

/** Editable letter preview with a Share button (copy, email, print, save to Files). */
export function LetterBox({ text, title }: { text: string; title: string }) {
  const c = useColors();
  const [value, setValue] = useState(text);
  useEffect(() => setValue(text), [text]);
  return (
    <View style={{ gap: 10 }}>
      <Muted small>You can edit the letter here. Changing the fields above rebuilds it.</Muted>
      <TextInput value={value} onChangeText={setValue} multiline accessibilityLabel={title}
        style={{ minHeight: 280, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, fontSize: 15, lineHeight: 22, color: c.ink, backgroundColor: c.bg, textAlignVertical: 'top' }} />
      <Button title="Share, copy, or print" icon="share" onPress={() => shareText(value, title)} />
    </View>
  );
}
