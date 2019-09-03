import { AntDesign } from '@expo/vector-icons/';
import React from 'react';
import { createAppContainer, createBottomTabNavigator } from 'react-navigation';
import { Community } from './Community';
import { Discover } from './Discover';
import { Home } from './Home';
import { Profile } from './Profile';

const TabNavigator = createBottomTabNavigator(
  {
    Home: Home,
    Découvrir: Discover,
    Communauté: Community,
    Profil: Profile,
  },
  {
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

export default createAppContainer(TabNavigator);
