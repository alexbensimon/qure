import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import { Home } from './Home';
import { Discover } from './Discover';
import { Community } from './Community';
import { Profile } from './Profile';

const TabNavigator = createBottomTabNavigator({
  Home: Home,
  Découvrir: Discover,
  Communauté: Community,
  Profil: Profile,
});

export default createAppContainer(TabNavigator);
