import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAVE_KEY } from '../game/constants';
import type { GameState } from '../game/types';

export async function saveGame(state: GameState): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Save failed:', e);
  }
}

export async function loadGame(): Promise<GameState | null> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GameState;
  } catch (e) {
    console.warn('Load failed:', e);
    return null;
  }
}
