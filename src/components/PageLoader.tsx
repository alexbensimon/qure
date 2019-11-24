import React, { FC } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../colors';

export const PageLoader: FC = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
