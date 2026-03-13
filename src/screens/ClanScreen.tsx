import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ClanStackParams } from '../navigation/AppNavigator';
import { useGameStore } from '../store/gameStore';
import { HEROES, HERO_IDS } from '../game/data/heroes';
import HeroCard from '../components/HeroCard';
import ResourceBar from '../components/ResourceBar';

type ClanNav = StackNavigationProp<ClanStackParams, 'Clan'>;

export default function ClanScreen() {
  const navigation = useNavigation<ClanNav>();
  const { unlockedHeroIds, heroes } = useGameStore();

  const allHeroes = HERO_IDS.map((id) => ({
    id,
    definition: HEROES[id],
    instance: heroes[id],
    unlocked: unlockedHeroIds.includes(id),
  }));

  return (
    <SafeAreaView style={styles.safe}>
      <ResourceBar />
      <View style={styles.container}>
        <Text style={styles.title}>Clan Roster</Text>
        <Text style={styles.subtitle}>
          {unlockedHeroIds.length} / {HERO_IDS.length} heroes unlocked
        </Text>
        <FlatList
          data={allHeroes}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HeroCard
              definition={item.definition}
              instance={item.instance}
              locked={!item.unlocked}
              onPress={() => {
                if (item.unlocked) {
                  navigation.navigate('HeroDetail', { heroId: item.id });
                }
              }}
            />
          )}
          contentContainerStyle={styles.grid}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0a0a1a' },
  container: { flex: 1, padding: 16 },
  title: { color: '#f0d060', fontSize: 22, fontWeight: 'bold', marginBottom: 2 },
  subtitle: { color: '#888', fontSize: 13, marginBottom: 12 },
  grid: { alignItems: 'center' },
});
