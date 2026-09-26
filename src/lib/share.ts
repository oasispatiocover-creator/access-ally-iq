import { Share, Linking, Alert } from 'react-native';

/** Opens the system share sheet with plain text: copy, email, Messages, Notes, save to Files, print. */
export async function shareText(text: string, title?: string) {
  try {
    await Share.share({ message: text, title });
  } catch {
    Alert.alert('Couldn’t open sharing', 'Select the text and copy it instead.');
  }
}

export const SUPPORT_EMAIL = 'info@AccessAllyIQ.com';

/** Opens the user's email app with a prefilled message. */
export async function emailSupport(subject: string, body: string) {
  const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  try {
    // openURL rejects when no mail app is set up; canOpenURL needs extra
    // platform configuration for mailto, so we just try it.
    await Linking.openURL(url);
    return true;
  } catch {
    return false;
  }
}
