import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Circle, Text as SvgText, Line } from 'react-native-svg';
import type { BoardUnit, HexCoord } from '../game/types';
import { BOARD_COLS, BOARD_ROWS } from '../game/constants';

const { width: SCREEN_W } = Dimensions.get('window');
const BOARD_W = SCREEN_W - 32;
const HEX_SIZE = Math.floor(BOARD_W / (BOARD_COLS * 1.8));
const HEX_H = HEX_SIZE * Math.sqrt(3);
const BOARD_H = HEX_H * BOARD_ROWS + HEX_SIZE;

// Flat-top hex pixel center
function hexCenter(q: number, r: number): { cx: number; cy: number } {
  const cx = HEX_SIZE * 1.5 * q + HEX_SIZE + (r % 2 === 1 ? HEX_SIZE * 0.75 : 0);
  const cy = HEX_H * r + HEX_H / 2;
  return { cx, cy };
}

function hexPoints(cx: number, cy: number, size: number): string {
  return Array.from({ length: 6 })
    .map((_, i) => {
      const angle = (Math.PI / 180) * (60 * i - 30);
      return `${cx + size * Math.cos(angle)},${cy + size * Math.sin(angle)}`;
    })
    .join(' ');
}

const HERO_COLORS: Record<string, string> = {
  sun_wukong: '#f0a000',
  nezha: '#e05020',
  hayate: '#4090e0',
  oni_mai: '#c040a0',
  jinwoo: '#8060e0',
  iseul: '#30c0a0',
};

interface HexBoardProps {
  units: BoardUnit[];
  onHexPress?: (hex: HexCoord) => void;
  selectedHex?: HexCoord | null;
}

export default function HexBoard({ units, onHexPress, selectedHex }: HexBoardProps) {
  const hexes: HexCoord[] = [];
  for (let r = 0; r < BOARD_ROWS; r++) {
    for (let q = 0; q < BOARD_COLS; q++) {
      hexes.push({ q, r });
    }
  }

  return (
    <View style={styles.container}>
      <Svg width={BOARD_W} height={BOARD_H}>
        {/* Draw all hex cells */}
        {hexes.map(({ q, r }) => {
          const { cx, cy } = hexCenter(q, r);
          const isPlayer = r <= 2;
          const isSelected = selectedHex?.q === q && selectedHex?.r === r;
          const fill = isSelected ? '#f0d06040' : isPlayer ? '#0a1a3a' : '#1a0a0a';
          const stroke = isPlayer ? '#1a3a6a' : '#3a1a1a';
          return (
            <Polygon
              key={`hex-${q}-${r}`}
              points={hexPoints(cx, cy, HEX_SIZE - 2)}
              fill={fill}
              stroke={stroke}
              strokeWidth={1}
            />
          );
        })}

        {/* Dividing line */}
        <Line
          x1={0}
          y1={HEX_H * 3}
          x2={BOARD_W}
          y2={HEX_H * 3}
          stroke="#f0d06060"
          strokeWidth={1}
          strokeDasharray="4 4"
        />

        {/* Draw units */}
        {units.filter((u) => u.status === 'alive').map((unit) => {
          const { cx, cy } = hexCenter(unit.hex.q, unit.hex.r);
          const color = unit.isEnemy ? '#c04040' : (HERO_COLORS[unit.heroId] ?? '#a0a0a0');
          const hpPct = unit.currentHp / unit.maxHp;
          const barW = HEX_SIZE * 1.4;
          const barX = cx - barW / 2;
          const barY = cy + HEX_SIZE * 0.6;

          return (
            <React.Fragment key={unit.unitId}>
              <Circle
                cx={cx}
                cy={cy}
                r={HEX_SIZE * 0.55}
                fill={color}
                opacity={0.9}
              />
              <SvgText
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fontSize={10}
                fill="#fff"
                fontWeight="bold"
              >
                {unit.heroId.slice(0, 3).toUpperCase()}
              </SvgText>
              {/* HP bar background */}
              <Polygon
                points={`${barX},${barY} ${barX + barW},${barY} ${barX + barW},${barY + 4} ${barX},${barY + 4}`}
                fill="#333"
              />
              {/* HP bar fill */}
              <Polygon
                points={`${barX},${barY} ${barX + barW * hpPct},${barY} ${barX + barW * hpPct},${barY + 4} ${barX},${barY + 4}`}
                fill={hpPct > 0.5 ? '#40c040' : hpPct > 0.25 ? '#c0c040' : '#c04040'}
              />
            </React.Fragment>
          );
        })}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
