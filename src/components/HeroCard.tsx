import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { HeroDefinition, HeroInstance } from '../game/types';

interface HeroCardProps {
  definition: HeroDefinition;
  instance?: HeroInstance;
  locked?: boolean;
  onPress?: () => void;
  size?: 'small' | 'large';
}

const ORIGIN_COLOR: Record<string, string> = {
  ChineseMythology: '#e08000',
  Japanese: '#4090e0',
  Korean: '#8060e0',
  PanAsian: '#30c080',
};

export default function HeroCard({ definition, instance, locked, onPress, size = 'large' }: HeroCardProps) {
  const isSmall = size === 'small';
  const color = ORIGIN_COLOR[definition.origin] ?? '#aaa';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.card, isSmall && styles.cardSmall, { borderColor: color }]}
      activeOpacity={0.8}
    >
      {locked ? (
        <Text style={[styles.portrait, { opacity: 0.3 }]}>❓</Text>
      ) : (
        <Text style={styles.portrait}>
          {definition.origin === 'ChineseMythology' ? '🐉' :
           definition.origin === 'Japanese' ? '⛩️' :
           definition.origin === 'Korean' ? '🌀' : '✨'}
        </Text>
      )}
      <Text style={[styles.name, isSmall && styles.nameSmall]} numberOfLines={1}>
        {locked ? '???' : definition.name}
      </Text>
      {!isSmall && (
        <>
          <Text style={[styles.class, { color }]}>{locked ? '???' : definition.heroClass}</Text>
          {instance && (
            <View style={styles.levelRow}>
              <Text style={styles.level}>Lv.{instance.level}</Text>
              <View style={styles.xpBar}>
                <View
                  style={[
                    styles.xpFill,
                    { width: `${(instance.xp / instance.xpToNextLevel) * 100}%` },
                  ]}
                />
              </View>
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a2e',
    borderWidth: 2,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    margin: 6,
    width: 110,
  },
  cardSmall: {
    width: 70,
    padding: 8,
    margin: 3,
  },
  portrait: {
    fontSize: 32,
    marginBottom: 4,
  },
  name: {
    color: '#f0e0b0',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  nameSmall: {
    fontSize: 10,
  },
  class: {
    fontSize: 10,
    marginTop: 2,
  },
  levelRow: {
    width: '100%',
    marginTop: 6,
    alignItems: 'center',
  },
  level: {
    color: '#f0d060',
    fontSize: 11,
    marginBottom: 2,
  },
  xpBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#4090e0',
  },
});
