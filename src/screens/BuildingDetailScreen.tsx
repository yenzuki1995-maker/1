import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { BaseStackParams } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { BUILDINGS } from '../game/data/buildings';

type BuildingRoute = RouteProp<BaseStackParams, 'BuildingDetail'>;

export default function BuildingDetailScreen() {
  const route = useRoute<BuildingRoute>();
  const { buildingId } = route.params;

  const { buildingLevels, resources, upgradeBuilding } = useGameStore();
  const building = BUILDINGS[buildingId];
  const currentLevel = buildingLevels[buildingId] ?? 0;

  if (!building) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Building not found</Text>
      </View>
    );
  }

  const maxed = currentLevel >= building.maxLevel;
  const upgradeCost = building.upgradeCost(currentLevel);
  const canAfford =
    !maxed &&
    resources.gold >= upgradeCost.gold &&
    resources.materials >= upgradeCost.materials;

  const effectDescription =
    building.effect.target === 'all'
      ? 'all heroes'
      : 'origin' in building.effect.target
      ? `${building.effect.target.origin} heroes`
      : `${building.effect.target.heroClass} heroes`;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.emoji}>{building.emoji}</Text>
        <Text style={styles.name}>{building.name}</Text>
        <Text style={styles.desc}>{building.description}</Text>

        {/* Level display */}
        <View style={styles.levelRow}>
          {Array.from({ length: building.maxLevel }).map((_, i) => (
            <View
              key={i}
              style={[styles.levelDot, i < currentLevel && styles.levelDotFilled]}
            />
          ))}
          <Text style={styles.levelText}>
            {maxed ? 'MAX' : `Level ${currentLevel} / ${building.maxLevel}`}
          </Text>
        </View>

        {/* Current effect */}
        <View style={styles.effectCard}>
          <Text style={styles.effectTitle}>Current Bonus</Text>
          <Text style={styles.effectText}>
            {currentLevel === 0
              ? 'Not built yet'
              : `+${building.effect.bonusPerLevel * currentLevel}% ${building.effect.stat} to ${effectDescription}`}
          </Text>
          {!maxed && (
            <>
              <Text style={styles.effectTitle}>After Upgrade</Text>
              <Text style={[styles.effectText, { color: '#f0d060' }]}>
                +{building.effect.bonusPerLevel * (currentLevel + 1)}% {building.effect.stat} to {effectDescription}
              </Text>
            </>
          )}
        </View>

        {/* Upgrade button */}
        {!maxed && (
          <View style={styles.upgradeSection}>
            <Text style={styles.costTitle}>Upgrade Cost</Text>
            <Text style={styles.cost}>💰 {upgradeCost.gold} gold</Text>
            <Text style={styles.cost}>🔩 {upgradeCost.materials} materials</Text>
            <TouchableOpacity
              style={[styles.upgradeBtn, !canAfford && styles.upgradeBtnDisabled]}
              onPress={() => upgradeBuilding(buildingId)}
              disabled={!canAfford}
            >
              <Text style={styles.upgradeBtnText}>
                {canAfford ? 'Upgrade Building' : 'Insufficient Resources'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {maxed && (
          <View style={styles.maxedBadge}>
            <Text style={styles.maxedText}>✅ Fully Upgraded</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a1a' },
  container: { flex: 1, padding: 24 },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: 8 },
  name: { color: '#f0e0b0', fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  desc: { color: '#a0a0c0', fontSize: 14, textAlign: 'center', marginTop: 6, marginBottom: 16, lineHeight: 20 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 16 },
  levelDot: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#333', borderWidth: 1, borderColor: '#f0d060' },
  levelDotFilled: { backgroundColor: '#f0d060' },
  levelText: { color: '#888', fontSize: 13, marginLeft: 6 },
  effectCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0d06040',
  },
  effectTitle: { color: '#888', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', marginTop: 6, marginBottom: 3 },
  effectText: { color: '#c0c0e0', fontSize: 14 },
  upgradeSection: { backgroundColor: '#1a1a2e', borderRadius: 10, padding: 14, borderWidth: 1, borderColor: '#f0d06040' },
  costTitle: { color: '#888', fontSize: 11, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 6 },
  cost: { color: '#f0e0b0', fontSize: 14, marginBottom: 3 },
  upgradeBtn: { marginTop: 12, backgroundColor: '#f0d060', borderRadius: 10, padding: 14, alignItems: 'center' },
  upgradeBtnDisabled: { backgroundColor: '#555' },
  upgradeBtnText: { color: '#1a1a2e', fontSize: 15, fontWeight: 'bold' },
  maxedBadge: { backgroundColor: '#0d1a0d', borderRadius: 10, padding: 14, alignItems: 'center', borderWidth: 1, borderColor: '#40e040' },
  maxedText: { color: '#40e040', fontSize: 16, fontWeight: 'bold' },
  error: { color: '#e04040', padding: 20, textAlign: 'center' },
});
