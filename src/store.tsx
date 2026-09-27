import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';

/** Deletes a saved dog photo, but only if it lives in this app's documents folder. */
export function deletePhoto(uri?: string) {
  if (!uri) return;
  try {
    if (!uri.startsWith(Paths.document.uri)) return;
    const f = new File(uri);
    if (f.exists) f.delete();
  } catch {
    // Nothing to clean up.
  }
}

export type Role = 'handler' | 'business' | 'public';

export type Profile = {
  dogName?: string;
  breed?: string;
  task?: string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  showEmergency?: boolean;
  rabies?: string;
  chip?: string;
  vet?: string;
  photo?: string; // file path in the app's documents folder
};

export type LogEntry = { id: string; date: string; place: string; what: string; outcome: string };
export type Report = { id: string; date: string; page: string; type: string; text: string };

type State = {
  ready: boolean;
  role: Role;
  roleChosen: boolean;
  state: string; // two-letter code, or 'US' for federal only
  profile: Profile;
  log: LogEntry[];
  reports: Report[];
};

type Actions = {
  setRole: (r: Role) => void;
  setUsState: (code: string) => void;
  saveProfile: (p: Profile) => void;
  addLog: (e: Omit<LogEntry, 'id'>) => void;
  removeLog: (id: string) => void;
  addReport: (r: Omit<Report, 'id' | 'date'>) => void;
  wipe: () => Promise<void>;
};

const KEY = 'accessallyiq:v1';
const initial: State = { ready: false, role: 'handler', roleChosen: false, state: 'AZ', profile: {}, log: [], reports: [] };

const Ctx = createContext<(State & Actions) | null>(null);

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(initial);
  // If saved data can't be read, never write over it: the user may still recover it after an update.
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        const saved = raw ? JSON.parse(raw) : {};
        // Photos are stored as files; drop any inline photo data so this entry stays small.
        if (saved.profile?.photo?.startsWith?.('data:')) delete saved.profile.photo;
        setS({ ...initial, ...saved, ready: true });
      } catch {
        setLoadFailed(true);
        setS({ ...initial, ready: true });
      }
    })();
  }, []);

  useEffect(() => {
    if (!s.ready || loadFailed) return;
    const { ready, ...persist } = s;
    AsyncStorage.setItem(KEY, JSON.stringify(persist)).catch(() => {});
  }, [s]);

  const setRole = useCallback((role: Role) => setS(p => ({ ...p, role, roleChosen: true })), []);
  const setUsState = useCallback((state: string) => setS(p => ({ ...p, state })), []);
  const saveProfile = useCallback((profile: Profile) => setS(p => ({ ...p, profile })), []);
  const addLog = useCallback((e: Omit<LogEntry, 'id'>) => setS(p => ({ ...p, log: [{ ...e, id: uid() }, ...p.log] })), []);
  const removeLog = useCallback((id: string) => setS(p => ({ ...p, log: p.log.filter(x => x.id !== id) })), []);
  const addReport = useCallback((r: Omit<Report, 'id' | 'date'>) =>
    setS(p => ({ ...p, reports: [{ ...r, id: uid(), date: new Date().toISOString().slice(0, 10) }, ...p.reports] })), []);
  const wipe = useCallback(async () => {
    setS(p => {
      deletePhoto(p.profile.photo);
      return { ...p, profile: {}, log: [], reports: [] };
    });
  }, []);

  const value = useMemo(() => ({ ...s, setRole, setUsState, saveProfile, addLog, removeLog, addReport, wipe }),
    [s, setRole, setUsState, saveProfile, addLog, removeLog, addReport, wipe]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}
