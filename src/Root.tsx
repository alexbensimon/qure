import React from 'react';
import { AntDesign } from '@expo/vector-icons/';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Home } from './Home';
import { Discover } from './Discover';
import { Community } from './Community';
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
        console.log('TCL: tintColor', typeof tintColor);
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = 'home';
        } else if (routeName === 'Découvrir') {
          iconName = `find`;
        } else if (routeName === 'Communauté') {
          iconName = `earth`;
        } else if (routeName === 'Profil') {
          iconName = `user`;
        }

        return <AntDesign name={iconName} size={25} color={tintColor} />;
      },
    }),
  },
);

export default createAppContainer(TabNavigator);
