import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { WorldStackParams } from '../navigation/AppNavigator';
import ManhwaPanel from '../components/ManhwaPanel';
import { getStage } from '../game/data/stages';

type CutsceneNav = StackNavigationProp<WorldStackParams, 'Cutscene'>;
type CutsceneRoute = RouteProp<WorldStackParams, 'Cutscene'>;

export default function CutsceneScreen() {
  const navigation = useNavigation<CutsceneNav>();
  const route = useRoute<CutsceneRoute>();
  const { stageId } = route.params;

  const stage = getStage(stageId);
  const panels = stage?.cutscenePanels ?? [];
  const [panelIndex, setPanelIndex] = useState(0);

  const goToBattle = () => {
    navigation.replace('Battle', { stageId });
  };

  const handleNext = () => {
    if (panelIndex + 1 < panels.length) {
      setPanelIndex(panelIndex + 1);
    } else {
      goToBattle();
    }
  };

  if (panels.length === 0) {
    goToBattle();
    return null;
  }

  return (
    <ManhwaPanel
      panel={panels[panelIndex]}
      panelIndex={panelIndex}
      total={panels.length}
      onNext={handleNext}
      onSkip={goToBattle}
    />
  );
}
