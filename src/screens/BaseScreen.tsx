import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { BaseStackParams } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { BUILDINGS, BUILDING_IDS } from '../game/data/buildings';
import { BONDS, getBondLevel } from '../game/data/bonds';
import { HEROES } from '../game/data/heroes';
import BuildingCard from '../components/BuildingCard';
import ResourceBar from '../components/ResourceBar';

type BaseNav = StackNavigationProp<BaseStackParams, 'Base'>;

export default function BaseScreen() {
  const navigation = useNavigation<BaseNav>();
  const { bondXp, buildingLevels, unlockedHeroIds } = useGameStore();

  // Active bonds (hero must be unlocked and bond XP > 0)
  const activeBonds = Object.values(BONDS).filter((bond) => {
    const allUnlocked = bond.heroIds.every((id) => unlockedHeroIds.includes(id));
    const xp = bondXp[bond.id] ?? 0;
    return allUnlocked || xp > 0;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ResourceBar />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Clan Base</Text>

        {/* Bond overview */}
        <Text style={styles.sectionTitle}>⚡ Active Bonds</Text>
        {activeBonds.length === 0 ? (
          <Text style={styles.emptyText}>
            Bonds unlock when heroes fight together. Unlock more heroes to discover bonds!
          </Text>
        ) : (
          activeBonds.map((bond) => {
            const xp = bondXp[bond.id] ?? 0;
            const level = getBondLevel(xp, bond.thresholds);
            return (
              <View key={bond.id} style={styles.bondRow}>
                <Text style={styles.bondName}>{bond.name}</Text>
                <Text style={styles.bondHeroes}>
                  {bond.heroIds.map((id) => HEROES[id]?.name ?? id).join(' + ')}
                </Text>
                <Text style={styles.bondLevel}>Lv.{level}/5 · {xp} XP</Text>
              </View>
            );
          })
        )}

        {/* Buildings */}
        <Text style={styles.sectionTitle}>🏗️ HQ Buildings</Text>
        <Text style={styles.buildingHint}>
          Upgrade buildings to give your heroes permanent stat bonuses.
        </Text>
        {BUILDING_IDS.map((id) => (
          <BuildingCard
            key={id}
            building={BUILDINGS[id]}
            onPress={() => navigation.navigate('BuildingDetail', { buildingId: id })}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a1a' },
  container: { flex: 1, padding: 16 },
  title: { color: '#f0d060', fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  sectionTitle: {
    color: '#f0e0b0',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  bondRow: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#8060e0',
  },
  bondName: { color: '#f0d060', fontSize: 13, fontWeight: 'bold' },
  bondHeroes: { color: '#a090c0', fontSize: 12, marginTop: 2 },
  bondLevel: { color: '#888', fontSize: 11, marginTop: 2 },
  buildingHint: {
    color: '#8080a0',
    fontSize: 12,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  emptyText: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
    padding: 16,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
  },
});
