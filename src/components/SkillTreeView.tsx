import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import type { SkillNode } from '../game/types';

const { width: SCREEN_W } = Dimensions.get('window');
const TREE_W = SCREEN_W - 32;
const NODE_SIZE = 56;
const COL_W = TREE_W / 3;
const ROW_H = 80;

interface SkillTreeViewProps {
  heroId: string;
  nodes: SkillNode[];
  unlockedIds: string[];
  fragments: number;
  onUnlock: (nodeId: string) => void;
}

const BRANCH_COLOR: Record<string, string> = {
  offense: '#e05030',
  survival: '#30a060',
  special: '#8060e0',
};

export default function SkillTreeView({
  nodes,
  unlockedIds,
  fragments,
  onUnlock,
}: SkillTreeViewProps) {
  const treeHeight = ROW_H * 5 + ROW_H;

  return (
    <ScrollView>
      <View style={styles.header}>
        <Text style={styles.headerText}>🔷 Fragments: {fragments}</Text>
      </View>
      <View style={styles.branchLabels}>
        {(['offense', 'survival', 'special'] as const).map((branch) => (
          <Text key={branch} style={[styles.branchLabel, { color: BRANCH_COLOR[branch] }]}>
            {branch.charAt(0).toUpperCase() + branch.slice(1)}
          </Text>
        ))}
      </View>

      <View style={{ width: TREE_W, height: treeHeight }}>
        {/* SVG edges */}
        <Svg width={TREE_W} height={treeHeight} style={StyleSheet.absoluteFill}>
          {nodes.map((node) =>
            node.requires.map((reqId) => {
              const parent = nodes.find((n) => n.id === reqId);
              if (!parent) return null;
              const cx1 = parent.position.col * COL_W + COL_W / 2;
              const cy1 = parent.position.row * ROW_H + ROW_H / 2;
              const cx2 = node.position.col * COL_W + COL_W / 2;
              const cy2 = node.position.row * ROW_H + ROW_H / 2;
              const unlocked = unlockedIds.includes(node.id) && unlockedIds.includes(reqId);
              return (
                <Line
                  key={`${reqId}-${node.id}`}
                  x1={cx1}
                  y1={cy1}
                  x2={cx2}
                  y2={cy2}
                  stroke={unlocked ? BRANCH_COLOR[node.branch] : '#444'}
                  strokeWidth={2}
                />
              );
            })
          )}
        </Svg>

        {/* Nodes */}
        {nodes.map((node) => {
          const cx = node.position.col * COL_W + COL_W / 2 - NODE_SIZE / 2;
          const cy = node.position.row * ROW_H + ROW_H / 2 - NODE_SIZE / 2;
          const isUnlocked = unlockedIds.includes(node.id);
          const prereqsMet = node.requires.every((r) => unlockedIds.includes(r));
          const canAfford = fragments >= node.fragmentCost;
          const canUnlock = !isUnlocked && prereqsMet && canAfford;
          const color = BRANCH_COLOR[node.branch];

          return (
            <TouchableOpacity
              key={node.id}
              style={[
                styles.node,
                {
                  left: cx,
                  top: cy,
                  width: NODE_SIZE,
                  height: NODE_SIZE,
                  borderColor: isUnlocked ? color : canUnlock ? '#f0d060' : '#444',
                  backgroundColor: isUnlocked ? color + '40' : '#1a1a2e',
                },
              ]}
              onPress={() => canUnlock && onUnlock(node.id)}
              disabled={!canUnlock && !isUnlocked}
            >
              <Text style={[styles.nodeName, { color: isUnlocked ? '#fff' : canUnlock ? '#f0d060' : '#666' }]} numberOfLines={2}>
                {node.name}
              </Text>
              {!isUnlocked && (
                <Text style={[styles.nodeCost, { color: canAfford && prereqsMet ? '#f0d060' : '#666' }]}>
                  {node.fragmentCost}🔷
                </Text>
              )}
              {isUnlocked && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  headerText: {
    color: '#4090e0',
    fontSize: 15,
    fontWeight: 'bold',
  },
  branchLabels: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  branchLabel: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  node: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  nodeName: {
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '600',
  },
  nodeCost: {
    fontSize: 9,
    marginTop: 2,
  },
  checkmark: {
    color: '#40e040',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
