import {
  createSwitchNavigator,
  createAppContainer,
} from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, NavigationStackOptions } from 'react-navigation-stack';
import { Platform } from 'react-native';
import OnboardingScreen from '../screens/onboarding-screen';
import MainScreen from '../screens/main-screen';
import SymptomsScreen from '../screens/symptoms-screen';
import SettingsScreen from '../screens/settings-screen';
import LoadingScreen from '../screens/loading-screen';
import { Colors, Metrics, Fonts } from '../themes';
import iconTab from './icontab';
import { IconButton } from '../components/iconbutton';
import MapsScreen from '../screens/maps-screen';
import RegisterScreen from '../screens/register-screen/';
import ResultsScreen from '../screens/results-screen';
import RothScreen from '../screens/roth-screen';
import StatsScreen from '../screens/stats-scren';
import HelpScreen from '../screens/help-screen';

const iconLeft = (props) => IconButton({...props, name: 'arrow-left', style: {...Platform.select({ android: { marginTop: -15, top: -15 }}) }});

const defaultNavigationOptions: NavigationStackOptions = {
  headerStyle: {
    backgroundColor: 'white',
    shadowColor: '#22222266',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.5,
    height: Metrics.headerSize,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    marginTop: Platform.OS === 'ios' ? 0 : -25,
    fontWeight: '400',
    fontSize: Fonts.size.h4,
    color: '#222'
  },
};

const MainNavigator = createStackNavigator({
  main: {
    screen: MainScreen,
    navigationOptions: { 
      title: 'COVID-19 Tester',
    }
  },
  main_symptoms: { 
    screen: SymptomsScreen,
    navigationOptions: {
      title: 'Check Symptoms',
      headerLeft: (props) => iconLeft(props),
    }
  },
  main_test: { 
    screen: RothScreen,
    navigationOptions: { 
      title: 'Roth Breathing Test',
      headerLeft: (props) => iconLeft(props),
    }
  },
  main_stats: {
    screen: StatsScreen,
    navigationOptions: { 
      title: 'Latest Stats',
      headerLeft: (props) => iconLeft(props),
    }
  },
}, {
  defaultNavigationOptions,
});

const ResultsNavigator = createStackNavigator({
  maps: {
    screen: ResultsScreen,
    navigationOptions: { 
      title: 'Symptoms Scores',
    }
  },
}, {
  defaultNavigationOptions,
});

const MapsNavigator = createStackNavigator({
  maps: {
    screen: MapsScreen,
    navigationOptions: { 
      title: 'Discover on Map',
    }
  },
}, {
  defaultNavigationOptions,
});

const SettingsNavigator = createStackNavigator({
  settings: {
    screen: SettingsScreen,
    navigationOptions: { 
      title: 'More Options',
    }
  },
  register: { 
    screen: RegisterScreen,
    navigationOptions: { 
      title: 'Change Code',
      headerLeft: (props) => iconLeft(props),
    }
  },
  help: { 
    screen: HelpScreen,
    navigationOptions: { 
      title: 'Privacy Terms',
      headerLeft: (props) => iconLeft(props),
    }
  },
  about: { 
    screen: HelpScreen,
    navigationOptions: { 
      title: 'About COVID-19 Tester',
      headerLeft: (props) => iconLeft(props),
    }
  },
  symptoms: { 
    screen: HelpScreen,
    navigationOptions: { 
      title: 'About Symptoms',
      headerLeft: (props) => iconLeft(props),
    }
  },
}, {
  defaultNavigationOptions,
});

const TabNavigator = createBottomTabNavigator({
  home: {
    screen: MainNavigator,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: (props) => iconTab({ name: 'home', ...props }),
    },
  },
  results: {
    screen: ResultsNavigator,
    navigationOptions: {
      tabBarLabel: 'Scores',
      tabBarIcon: (props) => iconTab({ name: 'heartbeat', ...props }),
    },
  },
  maps: {
    screen: MapsNavigator,
    navigationOptions: {
      tabBarLabel: 'On Map',
      tabBarIcon: (props) => iconTab({ name: 'street-view', ...props }),
    },
  },
  settings: {
    screen: SettingsNavigator,
    navigationOptions: {
      tabBarLabel: 'More',
      tabBarIcon: (props) => iconTab({ name: 'ellipsis-h', ...props }),
    },
  },
}, {
    ...defaultNavigationOptions,
    initialRouteName: 'home',
    lazy: false,
    backBehavior: 'initialRoute',
    tabBarOptions: {
      allowFontScaling: false,
      activeTintColor: Colors.error,
      inactiveTintColor: Colors.bar,
      activeBackgroundColor: Colors.snow,
      showLabel: true,
      showIcon: true,
      labelPosition: 'beside-icon',
      tabStyle: {
        backgroundColor: 'white',
        padding: 0,
        marginTop: Platform.OS === 'ios' ? 0 : 10,
      },
      labelStyle: {
        fontSize: Fonts.size.label,
        left: 0,
        top: Platform.OS === 'ios' ? 0 : 5,
      },
      style: {
        height: Metrics.tabBarHeight,
        backgroundColor: 'white',
        shadowColor: '#367be2',
        shadowOffset: { height: -2, width: 0 },
        shadowOpacity: 0.2,
        marginBottom: 0,
      },
    },
  }
);

const RootNavigator = createSwitchNavigator({
  main: { screen: TabNavigator},
  loading: { screen: LoadingScreen },
  register: { screen: RegisterScreen },
  onboarding: { screen: OnboardingScreen },
}, {
  initialRouteName: 'loading',
});

export default createAppContainer(RootNavigator);
