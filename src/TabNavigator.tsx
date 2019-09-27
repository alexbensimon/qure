import { AntDesign } from '@expo/vector-icons/';
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { colors } from './colors';
import { Community } from './community/Community';
import { DiscoverStack } from './discover/DiscoverStack';
import { HomeStack } from './home/HomeStack';
import { ProfileStack } from './profile/ProfileStack';

const TabNavigator = createBottomTabNavigator(
  {
    Home: HomeStack,
    Découvrir: DiscoverStack,
    Communauté: Community,
    Profil: ProfileStack,
  },
  {
    // @ts-ignore
    tabBarOptions: {
      activeTintColor: colors.primary,
      inactiveTintColor: colors.light,
      style: {
        backgroundColor: colors.white,
      },
      labelStyle: {
        fontFamily: 'concert-one-regular',
      },
    },
    // @ts-ignore
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ tintColor }: { tintColor: string }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home';
        } else if (routeName === 'Découvrir') {
          iconName = 'find';
        } else if (routeName === 'Communauté') {
          iconName = 'earth';
        } else if (routeName === 'Profil') {
          iconName = 'user';
        }

        return <AntDesign name={iconName} size={25} color={tintColor} />;
      },
    }),
  },
);

// @ts-ignore
export default createAppContainer(TabNavigator);
