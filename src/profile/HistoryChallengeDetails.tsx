import React, { FC } from 'react';
import { ChallengeDetails } from '../ChallengeDetails';
import { NavigationStackProp } from 'react-navigation-stack';

type Props = {
  navigation: NavigationStackProp<{ challengeId: string }>;
};

export const HistoryChallengeDetails: FC<Props> = ({ navigation }) => (
  <ChallengeDetails challengeId={navigation.getParam('challengeId')} />
);
