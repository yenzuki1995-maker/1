import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { WorldStackParams } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import HexBoard from '../components/HexBoard';
import { getStage } from '../game/data/stages';

type BattleNav = StackNavigationProp<WorldStackParams, 'Battle'>;
type BattleRoute = RouteProp<WorldStackParams, 'Battle'>;

export default function BattleScreen() {
  const navigation = useNavigation<BattleNav>();
  const route = useRoute<BattleRoute>();
  const { stageId } = route.params;

  const { currentBattle, startBattle, stopBattle, claimRewards } = useGameStore();
  const hasHandledOutcome = useRef(false);

  useEffect(() => {
    hasHandledOutcome.current = false;
    startBattle(stageId);
    return () => {
      stopBattle();
    };
  }, [stageId]);

  useEffect(() => {
    if (!currentBattle || hasHandledOutcome.current) return;
    if (currentBattle.outcome === 'victory') {
      hasHandledOutcome.current = true;
      claimRewards(stageId);
      Alert.alert(
        '⚔️ Victory!',
        'Your clan triumphed!',
        [{ text: 'Continue', onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    } else if (currentBattle.outcome === 'defeat') {
      hasHandledOutcome.current = true;
      Alert.alert(
        '💀 Defeat',
        'Your clan has fallen. Retreat and grow stronger.',
        [{ text: 'Retreat', onPress: () => navigation.goBack() }],
        { cancelable: false }
      );
    }
  }, [currentBattle?.outcome]);

  const stage = getStage(stageId);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stageName}>{stage?.name ?? stageId}</Text>
        <Text style={styles.tick}>Tick: {currentBattle?.tick ?? 0}</Text>
      </View>

      {/* Hex board */}
      <View style={styles.boardContainer}>
        <HexBoard units={currentBattle?.units ?? []} />
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={[styles.legendDot, { backgroundColor: '#f0a000' }]} />
        <Text style={styles.legendText}>Your Heroes</Text>
        <View style={[styles.legendDot, { backgroundColor: '#c04040' }]} />
        <Text style={styles.legendText}>Enemies</Text>
      </View>

      {/* Combat log */}
      <Text style={styles.logTitle}>Combat Log</Text>
      <ScrollView
        style={styles.log}
        ref={(ref) => {
          if (ref && currentBattle?.log.length) {
            ref.scrollToEnd({ animated: true });
          }
        }}
      >
        {(currentBattle?.log ?? []).map((entry, i) => (
          <Text key={i} style={styles.logEntry}>{entry}</Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: '#f0d06040',
  },
  stageName: {
    color: '#f0e0b0',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tick: {
    color: '#888',
    fontSize: 13,
  },
  boardContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: '#888',
    fontSize: 11,
    marginRight: 12,
  },
  logTitle: {
    color: '#f0d060',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 2,
  },
  log: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  logEntry: {
    color: '#a0a0c0',
    fontSize: 11,
    paddingVertical: 1,
    fontFamily: 'monospace',
  },
});
