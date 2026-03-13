import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { WorldStackParams } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { getStage } from '../game/data/stages';
import { HEROES } from '../game/data/heroes';
import { ENEMY_TEMPLATES } from '../game/data/enemies';
import { ITEM_TEMPLATES } from '../game/data/equipment';
import HeroCard from '../components/HeroCard';

type StageNav = StackNavigationProp<WorldStackParams, 'Stage'>;
type StageRoute = RouteProp<WorldStackParams, 'Stage'>;

export default function StageScreen() {
  const navigation = useNavigation<StageNav>();
  const route = useRoute<StageRoute>();
  const { stageId } = route.params;

  const { clearedStages, unlockedHeroIds, heroes, playerBoard, placeHero } = useGameStore();
  const stage = getStage(stageId);
  const isCleared = clearedStages.includes(stageId);

  if (!stage) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Stage not found</Text>
      </View>
    );
  }

  const boardedHeroIds = Object.keys(playerBoard);
  const hasCutscene = !isCleared && (stage.cutscenePanels?.length ?? 0) > 0;

  const handleStartBattle = () => {
    if (hasCutscene) {
      navigation.navigate('Cutscene', { stageId, panelIndex: 0 });
    } else {
      navigation.navigate('Battle', { stageId });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>{stage.name}</Text>
        {isCleared && <Text style={styles.cleared}>✅ Cleared</Text>}

        {/* Enemies */}
        <Text style={styles.sectionTitle}>Enemies</Text>
        {stage.enemyWaves[0].enemies.map((e, i) => {
          const tmpl = ENEMY_TEMPLATES[e.templateId];
          return (
            <View key={i} style={styles.enemyRow}>
              <Text style={styles.enemyName}>{tmpl?.name ?? e.templateId}</Text>
              <Text style={styles.enemyLevel}>Lv.{e.level}</Text>
            </View>
          );
        })}

        {/* Rewards */}
        <Text style={styles.sectionTitle}>Rewards</Text>
        <View style={styles.rewardsRow}>
          <Text style={styles.reward}>💰 {stage.rewards.gold} gold</Text>
          <Text style={styles.reward}>⭐ {stage.rewards.xp} XP</Text>
        </View>
        {stage.heroUnlock && (
          <Text style={styles.heroUnlock}>
            🦸 {isCleared ? 'Unlocked: ' : 'First clear unlocks: '}
            {HEROES[stage.heroUnlock]?.name ?? stage.heroUnlock}
          </Text>
        )}
        <Text style={styles.lootTitle}>Possible drops:</Text>
        {stage.rewards.lootTable.map((entry) => {
          const tmpl = ITEM_TEMPLATES[entry.templateId];
          return (
            <Text key={entry.templateId} style={styles.lootItem}>
              • {tmpl?.name ?? entry.templateId} ({Math.round(entry.dropChance * 100)}%)
            </Text>
          );
        })}

        {/* Your team */}
        <Text style={styles.sectionTitle}>Your Team ({boardedHeroIds.length} heroes)</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.heroRow}>
          {unlockedHeroIds.map((heroId) => {
            const def = HEROES[heroId];
            const inst = heroes[heroId];
            const onBoard = boardedHeroIds.includes(heroId);
            if (!def) return null;
            return (
              <View key={heroId} style={[styles.heroSlot, onBoard && styles.heroSlotActive]}>
                <HeroCard
                  definition={def}
                  instance={inst}
                  onPress={() => {
                    if (onBoard) return;
                    // Auto-place on first empty player row hex
                    const taken = new Set(
                      Object.values(playerBoard).map((h) => `${h.q},${h.r}`)
                    );
                    for (let r = 0; r <= 2; r++) {
                      for (let q = 0; q <= 3; q++) {
                        if (!taken.has(`${q},${r}`)) {
                          placeHero(heroId, { q, r });
                          return;
                        }
                      }
                    }
                  }}
                  size="small"
                />
                {onBoard && <Text style={styles.onBoard}>ON BOARD</Text>}
              </View>
            );
          })}
        </ScrollView>
      </ScrollView>

      {/* Start button */}
      <TouchableOpacity
        style={[styles.startBtn, boardedHeroIds.length === 0 && styles.startBtnDisabled]}
        onPress={handleStartBattle}
        disabled={boardedHeroIds.length === 0}
      >
        <Text style={styles.startText}>
          {hasCutscene ? '📜 Watch Story & Battle' : '⚔️ Start Battle'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a1a' },
  container: { flex: 1, padding: 16 },
  title: { color: '#f0e0b0', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  cleared: { color: '#40e040', fontSize: 13, marginBottom: 8 },
  sectionTitle: { color: '#f0d060', fontSize: 14, fontWeight: 'bold', marginTop: 14, marginBottom: 6 },
  enemyRow: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#1a1a2e', borderRadius: 6, padding: 8, marginBottom: 4 },
  enemyName: { color: '#e0a0a0', fontSize: 13 },
  enemyLevel: { color: '#888', fontSize: 13 },
  rewardsRow: { flexDirection: 'row', gap: 16 },
  reward: { color: '#c0c0e0', fontSize: 13 },
  heroUnlock: { color: '#c080ff', fontSize: 13, marginTop: 4 },
  lootTitle: { color: '#888', fontSize: 12, marginTop: 6, marginBottom: 2 },
  lootItem: { color: '#a0a0c0', fontSize: 12, marginLeft: 8 },
  heroRow: { marginTop: 4 },
  heroSlot: { opacity: 0.7 },
  heroSlotActive: { opacity: 1 },
  onBoard: { color: '#40e040', fontSize: 9, textAlign: 'center', fontWeight: 'bold' },
  startBtn: { margin: 16, padding: 16, backgroundColor: '#f0d060', borderRadius: 12, alignItems: 'center' },
  startBtnDisabled: { backgroundColor: '#555' },
  startText: { color: '#1a1a2e', fontSize: 16, fontWeight: 'bold' },
  error: { color: '#e04040', padding: 20, textAlign: 'center' },
});
