import { AntDesign } from '@expo/vector-icons/';
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Community } from './Community';
import { DiscoverStack } from './DiscoverStack';
import { Home } from './Home';
import { Profile } from './Profile';

const TabNavigator = createBottomTabNavigator(
  {
    Home: Home,
    Découvrir: DiscoverStack,
    Communauté: Community,
    Profil: Profile,
  },
  {
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
