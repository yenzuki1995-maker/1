import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { WorldStackParams } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { DISTRICTS } from '../game/data/stages';
import ResourceBar from '../components/ResourceBar';

type WorldNav = StackNavigationProp<WorldStackParams, 'WorldMap'>;

export default function WorldMapScreen() {
  const navigation = useNavigation<WorldNav>();
  const { clearedStages, currentChapter } = useGameStore();

  return (
    <SafeAreaView style={styles.safe}>
      <ResourceBar />
      <ScrollView style={styles.container}>
        <Text style={styles.title}>World Map</Text>
        {DISTRICTS.map((district) => {
          const isDistrictUnlocked = currentChapter >= district.unlockCondition.chapter;
          return (
            <View key={district.id} style={styles.district}>
              <Text style={[styles.districtName, !isDistrictUnlocked && styles.locked]}>
                {isDistrictUnlocked ? district.name : '??? Locked District'}
              </Text>
              {isDistrictUnlocked && (
                <Text style={styles.flavor}>{district.flavor}</Text>
              )}
              {isDistrictUnlocked && (
                <View style={styles.stageList}>
                  {district.stages.map((stage) => {
                    const cleared = clearedStages.includes(stage.id);
                    // A stage is playable if it's the first, or the previous stage is cleared
                    const stageIdx = district.stages.findIndex((s) => s.id === stage.id);
                    const prevCleared =
                      stageIdx === 0 ||
                      clearedStages.includes(district.stages[stageIdx - 1].id);
                    const isPlayable = prevCleared;

                    return (
                      <TouchableOpacity
                        key={stage.id}
                        style={[
                          styles.stageBtn,
                          cleared && styles.stageBtnCleared,
                          !isPlayable && styles.stageBtnLocked,
                        ]}
                        onPress={() => {
                          if (!isPlayable) return;
                          navigation.navigate('Stage', { stageId: stage.id });
                        }}
                        disabled={!isPlayable}
                      >
                        <Text style={styles.stageNum}>
                          {cleared ? '✅' : isPlayable ? '⚔️' : '🔒'} Stage {stage.stageNumber}
                        </Text>
                        <Text style={styles.stageName} numberOfLines={1}>{stage.name}</Text>
                        {stage.heroUnlock && (
                          <Text style={styles.heroUnlock}>
                            {cleared ? '🦸 Unlocked' : '🦸 Hero Unlock'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0a0a1a',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    color: '#f0d060',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  district: {
    marginBottom: 24,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#f0d06040',
  },
  districtName: {
    color: '#f0e0b0',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locked: {
    color: '#555',
  },
  flavor: {
    color: '#8080a0',
    fontSize: 12,
    marginBottom: 10,
    fontStyle: 'italic',
  },
  stageList: {
    gap: 6,
  },
  stageBtn: {
    backgroundColor: '#0d0d1a',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#f0d06040',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stageBtnCleared: {
    borderColor: '#40e04040',
    backgroundColor: '#0d1a0d',
  },
  stageBtnLocked: {
    opacity: 0.4,
  },
  stageNum: {
    color: '#f0d060',
    fontSize: 13,
    fontWeight: 'bold',
    minWidth: 80,
  },
  stageName: {
    color: '#c0c0e0',
    fontSize: 13,
    flex: 1,
  },
  heroUnlock: {
    color: '#a060f0',
    fontSize: 11,
  },
});
