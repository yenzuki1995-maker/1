import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Text } from 'react-native';

import WorldMapScreen from '../screens/WorldMapScreen';
import StageScreen from '../screens/StageScreen';
import BattleScreen from '../screens/BattleScreen';
import CutsceneScreen from '../screens/CutsceneScreen';
import BaseScreen from '../screens/BaseScreen';
import BuildingDetailScreen from '../screens/BuildingDetailScreen';
import ClanScreen from '../screens/ClanScreen';
import HeroDetailScreen from '../screens/HeroDetailScreen';

// ── Stack param lists ─────────────────────────────────────────────────────────

export type WorldStackParams = {
  WorldMap: undefined;
  Stage: { stageId: string };
  Battle: { stageId: string };
  Cutscene: { stageId: string; panelIndex: number };
};

export type BaseStackParams = {
  Base: undefined;
  BuildingDetail: { buildingId: string };
};

export type ClanStackParams = {
  Clan: undefined;
  HeroDetail: { heroId: string };
};

const WorldStack = createStackNavigator<WorldStackParams>();
const BaseStack = createStackNavigator<BaseStackParams>();
const ClanStack = createStackNavigator<ClanStackParams>();
const Tab = createBottomTabNavigator();

// ── Sub-stacks ────────────────────────────────────────────────────────────────

function WorldNavigator() {
  return (
    <WorldStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#f0d060' }}>
      <WorldStack.Screen name="WorldMap" component={WorldMapScreen} options={{ title: 'World Map' }} />
      <WorldStack.Screen name="Stage" component={StageScreen} options={{ title: 'Stage' }} />
      <WorldStack.Screen name="Battle" component={BattleScreen} options={{ title: 'Battle' }} />
      <WorldStack.Screen name="Cutscene" component={CutsceneScreen} options={{ headerShown: false }} />
    </WorldStack.Navigator>
  );
}

function BaseNavigator() {
  return (
    <BaseStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#f0d060' }}>
      <BaseStack.Screen name="Base" component={BaseScreen} options={{ title: 'Clan Base' }} />
      <BaseStack.Screen name="BuildingDetail" component={BuildingDetailScreen} options={{ title: 'Building' }} />
    </BaseStack.Navigator>
  );
}

function ClanNavigator() {
  return (
    <ClanStack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#1a1a2e' }, headerTintColor: '#f0d060' }}>
      <ClanStack.Screen name="Clan" component={ClanScreen} options={{ title: 'Clan' }} />
      <ClanStack.Screen name="HeroDetail" component={HeroDetailScreen} options={{ title: 'Hero' }} />
    </ClanStack.Navigator>
  );
}

// ── Tab navigator ─────────────────────────────────────────────────────────────

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#1a1a2e', borderTopColor: '#f0d060', borderTopWidth: 1 },
        tabBarActiveTintColor: '#f0d060',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tab.Screen
        name="WorldTab"
        component={WorldNavigator}
        options={{ tabBarLabel: 'World', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🗺</Text> }}
      />
      <Tab.Screen
        name="BaseTab"
        component={BaseNavigator}
        options={{ tabBarLabel: 'Base', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>🏯</Text> }}
      />
      <Tab.Screen
        name="ClanTab"
        component={ClanNavigator}
        options={{ tabBarLabel: 'Clan', tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚔️</Text> }}
      />
    </Tab.Navigator>
  );
}
