import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigator from './src/navigation/AppNavigator';
import { useGameStore } from './src/store/gameStore';

function GameRoot() {
  const initGame = useGameStore((s) => s.initGame);

  useEffect(() => {
    initGame();
  }, []);

  return <AppNavigator />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="light" />
        <GameRoot />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
