import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { BuildingDefinition } from '../game/types';
import { useGameStore } from '../store/gameStore';

interface BuildingCardProps {
  building: BuildingDefinition;
  onPress: () => void;
}

export default function BuildingCard({ building, onPress }: BuildingCardProps) {
  const buildingLevels = useGameStore((s) => s.buildingLevels);
  const level = buildingLevels[building.id] ?? 0;
  const maxed = level >= building.maxLevel;

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
      <Text style={styles.emoji}>{building.emoji}</Text>
      <View style={styles.info}>
        <Text style={styles.name}>{building.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>{building.description}</Text>
        <View style={styles.levelDots}>
          {Array.from({ length: building.maxLevel }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i < level && styles.dotFilled]}
            />
          ))}
        </View>
      </View>
      <View style={styles.levelBadge}>
        <Text style={[styles.levelText, maxed && styles.levelTextMaxed]}>
          {maxed ? 'MAX' : `Lv.${level}`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 10,
    padding: 14,
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0d06040',
  },
  emoji: {
    fontSize: 32,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#f0e0b0',
    fontSize: 14,
    fontWeight: 'bold',
  },
  desc: {
    color: '#a0a0c0',
    fontSize: 11,
    marginTop: 2,
  },
  levelDots: {
    flexDirection: 'row',
    gap: 4,
    marginTop: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333',
    borderWidth: 1,
    borderColor: '#f0d060',
  },
  dotFilled: {
    backgroundColor: '#f0d060',
  },
  levelBadge: {
    marginLeft: 8,
    backgroundColor: '#0d0d1a',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  levelText: {
    color: '#f0d060',
    fontSize: 12,
    fontWeight: 'bold',
  },
  levelTextMaxed: {
    color: '#40e040',
  },
});
