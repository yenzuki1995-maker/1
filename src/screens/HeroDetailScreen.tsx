import React, { useState } from 'react';
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
import type { ClanStackParams } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { HEROES } from '../game/data/heroes';
import { SKILL_TREES } from '../game/data/skillTrees';
import { BONDS, getBondsForHero, getBondLevel } from '../game/data/bonds';
import { ITEM_TEMPLATES } from '../game/data/equipment';
import { calcHeroStats } from '../game/engine/combat';
import SkillTreeView from '../components/SkillTreeView';
import BondCard from '../components/BondCard';

type HeroDetailRoute = RouteProp<ClanStackParams, 'HeroDetail'>;

type TabName = 'stats' | 'skills' | 'gear' | 'bonds';

export default function HeroDetailScreen() {
  const route = useRoute<HeroDetailRoute>();
  const { heroId } = route.params;
  const [activeTab, setActiveTab] = useState<TabName>('stats');

  const { heroes, inventory, unlockSkillNode, bondXp, unlockedHeroIds } =
    useGameStore();

  const gameState = useGameStore.getState();
  const definition = HEROES[heroId];
  const instance = heroes[heroId];

  if (!definition || !instance) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Hero not found</Text>
      </View>
    );
  }

  const stats = calcHeroStats(heroId, instance, gameState);
  const skillNodes = SKILL_TREES[heroId] ?? [];
  const heroBonds = getBondsForHero(heroId);

  const tabs: TabName[] = ['stats', 'skills', 'gear', 'bonds'];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Hero header */}
      <View style={styles.heroHeader}>
        <Text style={styles.portrait}>
          {definition.origin === 'ChineseMythology' ? '🐉' :
           definition.origin === 'Japanese' ? '⛩️' :
           definition.origin === 'Korean' ? '🌀' : '✨'}
        </Text>
        <View style={styles.heroMeta}>
          <Text style={styles.heroName}>{definition.name}</Text>
          <Text style={styles.heroTitle}>{definition.title}</Text>
          <Text style={styles.heroClass}>{definition.heroClass} · {definition.origin}</Text>
          <View style={styles.levelRow}>
            <Text style={styles.level}>Lv.{instance.level}</Text>
            <View style={styles.xpBar}>
              <View
                style={[
                  styles.xpFill,
                  {
                    width: `${Math.min(100, (instance.xp / instance.xpToNextLevel) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.xpText}>{instance.xp}/{instance.xpToNextLevel}</Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'stats' && (
          <View style={styles.statsPanel}>
            {[
              { label: 'HP', value: stats.hp },
              { label: 'Attack', value: stats.attack },
              { label: 'Defense', value: stats.defense },
              { label: 'Atk Speed', value: stats.attackSpeed.toFixed(2) },
              { label: 'Ability Pwr', value: `+${stats.abilityPower}%` },
              { label: 'Range', value: definition.attackRange },
            ].map(({ label, value }) => (
              <View key={label} style={styles.statRow}>
                <Text style={styles.statLabel}>{label}</Text>
                <Text style={styles.statValue}>{value}</Text>
              </View>
            ))}
            <Text style={styles.sectionTitle}>Abilities</Text>
            {definition.abilities.map((ability, i) => {
              const unlockLvl = i === 0 ? 1 : [10, 20, 30][i - 1];
              const isUnlocked = instance.level >= unlockLvl;
              return (
                <View key={ability.id} style={[styles.abilityCard, !isUnlocked && styles.abilityLocked]}>
                  <Text style={styles.abilityName}>{ability.name}</Text>
                  <Text style={styles.abilityUnlockLvl}>Unlocks at Lv.{unlockLvl}</Text>
                  <Text style={styles.abilityDesc}>{ability.description}</Text>
                </View>
              );
            })}
          </View>
        )}

        {activeTab === 'skills' && (
          <View style={styles.padded}>
            <SkillTreeView
              heroId={heroId}
              nodes={skillNodes}
              unlockedIds={instance.unlockedSkillNodeIds}
              fragments={instance.skillFragments}
              onUnlock={(nodeId) => unlockSkillNode(heroId, nodeId)}
            />
          </View>
        )}

        {activeTab === 'gear' && (
          <View style={styles.statsPanel}>
            <Text style={styles.fragmentText}>🔷 Fragments: {instance.skillFragments}</Text>
            {(['weapon', 'armor', 'helm', 'gloves', 'boots', 'accessory'] as const).map(
              (slot) => {
                const itemId = instance.equipment[slot];
                const itemInst = itemId ? inventory[itemId] : undefined;
                const tmpl = itemInst ? ITEM_TEMPLATES[itemInst.templateId] : undefined;
                return (
                  <View key={slot} style={styles.gearRow}>
                    <Text style={styles.gearSlot}>{slot}</Text>
                    <Text style={styles.gearItem}>
                      {tmpl
                        ? `${tmpl.name} +${itemInst!.upgradeLevel}`
                        : '— empty —'}
                    </Text>
                  </View>
                );
              }
            )}
          </View>
        )}

        {activeTab === 'bonds' && (
          <View style={styles.padded}>
            {heroBonds.length === 0 ? (
              <Text style={styles.emptyText}>No bonds for this hero yet.</Text>
            ) : (
              heroBonds.map((bond) => (
                <BondCard
                  key={bond.id}
                  bond={bond}
                  bondXp={bondXp[bond.id] ?? 0}
                  heroNames={Object.fromEntries(
                    bond.heroIds.map((id) => [id, HEROES[id]?.name ?? id])
                  )}
                />
              ))
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a1a' },
  container: { flex: 1, backgroundColor: '#0a0a1a', alignItems: 'center', justifyContent: 'center' },
  error: { color: '#e04040', fontSize: 16 },
  heroHeader: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#f0d06040',
    alignItems: 'center',
  },
  portrait: { fontSize: 48, marginRight: 16 },
  heroMeta: { flex: 1 },
  heroName: { color: '#f0e0b0', fontSize: 18, fontWeight: 'bold' },
  heroTitle: { color: '#a090c0', fontSize: 11, fontStyle: 'italic', marginTop: 2 },
  heroClass: { color: '#888', fontSize: 12, marginTop: 2 },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  level: { color: '#f0d060', fontSize: 12, fontWeight: 'bold', minWidth: 40 },
  xpBar: { flex: 1, height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#4090e0' },
  xpText: { color: '#666', fontSize: 10 },
  tabs: { flexDirection: 'row', backgroundColor: '#1a1a2e' },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#f0d060' },
  tabText: { color: '#666', fontSize: 12 },
  tabTextActive: { color: '#f0d060', fontWeight: 'bold' },
  content: { flex: 1, padding: 16 },
  statsPanel: { gap: 8 },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statLabel: { color: '#a0a0c0', fontSize: 13 },
  statValue: { color: '#f0e0b0', fontSize: 13, fontWeight: 'bold' },
  sectionTitle: { color: '#f0d060', fontSize: 14, fontWeight: 'bold', marginTop: 12, marginBottom: 4 },
  abilityCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 10,
    marginBottom: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#8060e0',
  },
  abilityLocked: { opacity: 0.4 },
  abilityName: { color: '#f0e0b0', fontSize: 13, fontWeight: 'bold' },
  abilityUnlockLvl: { color: '#888', fontSize: 10, marginBottom: 3 },
  abilityDesc: { color: '#a0a0c0', fontSize: 12 },
  fragmentText: { color: '#4090e0', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  gearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 4,
  },
  gearSlot: { color: '#888', fontSize: 12, textTransform: 'capitalize' },
  gearItem: { color: '#f0e0b0', fontSize: 12 },
  padded: { paddingBottom: 40 },
  emptyText: { color: '#666', fontSize: 14, textAlign: 'center', marginTop: 20 },
});
