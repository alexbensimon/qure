import React, { FC } from 'react';
import { NavigationScreenProps } from 'react-navigation';
import { ChallengeDetails } from '../ChallengeDetails';

type Props = NavigationScreenProps;

export const HistoryChallengeDetails: FC<Props> = ({ navigation }) => (
  <ChallengeDetails challengeId={navigation.getParam('challengeId')} />
);
