import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import type { CutscenePanel } from '../game/types';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

interface ManhwaPanelProps {
  panel: CutscenePanel;
  panelIndex: number;
  total: number;
  onNext: () => void;
  onSkip: () => void;
}

export default function ManhwaPanel({
  panel,
  panelIndex,
  total,
  onNext,
  onSkip,
}: ManhwaPanelProps) {
  return (
    <View style={styles.container}>
      {/* Panel image placeholder */}
      <View style={styles.imageArea}>
        <Text style={styles.imagePlaceholder}>📜</Text>
        <Text style={styles.imageKey}>{panel.imageKey}</Text>
        <Text style={styles.counter}>{panelIndex + 1} / {total}</Text>
      </View>

      {/* Dialogue boxes */}
      <View style={styles.dialogueArea}>
        {panel.dialogue.map((line, i) => (
          <View key={i} style={styles.dialogueBubble}>
            <Text style={styles.speaker}>{line.speaker}</Text>
            <Text style={styles.dialogueText}>{line.text}</Text>
          </View>
        ))}
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={onSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onNext} style={styles.nextBtn}>
          <Text style={styles.nextText}>
            {panelIndex + 1 < total ? 'Next ▶' : 'Begin Battle ⚔️'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  imageArea: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#f0d060',
  },
  imagePlaceholder: {
    fontSize: 60,
    marginBottom: 8,
  },
  imageKey: {
    color: '#666',
    fontSize: 12,
  },
  counter: {
    position: 'absolute',
    top: 12,
    right: 16,
    color: '#f0d060',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dialogueArea: {
    padding: 16,
    gap: 8,
    maxHeight: SCREEN_H * 0.3,
  },
  dialogueBubble: {
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#f0d060',
    marginBottom: 6,
  },
  speaker: {
    color: '#f0d060',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  dialogueText: {
    color: '#e0e0e0',
    fontSize: 14,
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  skipBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
  },
  skipText: {
    color: '#888',
    fontSize: 14,
  },
  nextBtn: {
    flex: 2,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f0d060',
    alignItems: 'center',
  },
  nextText: {
    color: '#1a1a2e',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
