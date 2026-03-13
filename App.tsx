import React, { useEffect, Component } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useGameStore } from './src/store/gameStore';

// ── Error Boundary ────────────────────────────────────────────────────────────
class ErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error;
      return (
        <ScrollView style={styles.errContainer}>
          <Text style={styles.errTitle}>💥 Crash Report</Text>
          <Text style={styles.errMessage}>{err.message}</Text>
          <Text style={styles.errStack}>{err.stack}</Text>
        </ScrollView>
      );
    }
    return this.props.children;
  }
}

// ── App Root ──────────────────────────────────────────────────────────────────
function GameRoot() {
  const initGame = useGameStore((s) => s.initGame);
  useEffect(() => { initGame(); }, []);
  return <AppNavigator />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StatusBar style="light" />
          <GameRoot />
        </NavigationContainer>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errContainer: { flex: 1, backgroundColor: '#1a0000', padding: 20, paddingTop: 60 },
  errTitle: { color: '#ff4444', fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  errMessage: { color: '#ffaaaa', fontSize: 14, marginBottom: 16, lineHeight: 20 },
  errStack: { color: '#ff8888', fontSize: 11, fontFamily: 'monospace', lineHeight: 16 },
});
