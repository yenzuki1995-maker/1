import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { BondDefinition } from '../game/types';
import { getBondLevel } from '../game/data/bonds';

interface BondCardProps {
  bond: BondDefinition;
  bondXp: number;
  heroNames: Record<string, string>;
}

export default function BondCard({ bond, bondXp, heroNames }: BondCardProps) {
  const level = getBondLevel(bondXp, bond.thresholds);
  const nextThreshold = level < bond.thresholds.length ? bond.thresholds[level] : bond.thresholds[bond.thresholds.length - 1];
  const prevThreshold = level > 0 ? bond.thresholds[level - 1] : 0;
  const progress = level >= bond.thresholds.length
    ? 1
    : (bondXp - prevThreshold) / (nextThreshold - prevThreshold);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{bond.name}</Text>
        <Text style={styles.level}>Lv.{level}/{bond.thresholds.length}</Text>
      </View>
      <Text style={styles.heroes}>
        {bond.heroIds.map((id) => heroNames[id] ?? id).join(' + ')}
      </Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>
      <Text style={styles.xpText}>{bondXp} / {nextThreshold} XP</Text>
      {level > 0 && bond.levelEffects[level - 1] && (
        <Text style={styles.effect}>✨ {bond.levelEffects[level - 1].description}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#f0d06040',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    color: '#f0d060',
    fontSize: 14,
    fontWeight: 'bold',
  },
  level: {
    color: '#4090e0',
    fontSize: 13,
  },
  heroes: {
    color: '#a0a0c0',
    fontSize: 12,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#333',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f0d060',
    borderRadius: 3,
  },
  xpText: {
    color: '#888',
    fontSize: 11,
  },
  effect: {
    color: '#c0a0ff',
    fontSize: 12,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
