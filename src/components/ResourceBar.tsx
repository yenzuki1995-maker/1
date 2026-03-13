import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { formatNumber } from '../game/utils/format';

export default function ResourceBar() {
  const resources = useGameStore((s) => s.resources);

  return (
    <View style={styles.bar}>
      <Text style={styles.item}>💰 {formatNumber(resources.gold)}</Text>
      <Text style={styles.item}>🔩 {formatNumber(resources.materials)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#0d0d1a',
    paddingHorizontal: 16,
    paddingVertical: 6,
    justifyContent: 'flex-end',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0d06040',
  },
  item: {
    color: '#f0d060',
    fontSize: 13,
    fontWeight: '600',
  },
});
