
import React from 'react';
import {
  createStackNavigator,
  createAppContainer,
  createBottomTabNavigator
} from 'react-navigation';
import {
  Image,
} from 'react-native';
import HomePage from './HomePage';
import VideoPage from './VideoPage';
import GlobalPage from './GlobalPage';
import TabBar from './TabBar';
import routeIndex from './RouteIndex';
const video_normal = require('./images/video.png');
const global_normal = require('./images/global.png');
const news_normal = require('./images/news.png');
const TabRouteConfigs = {
    HomePage:{
      screen:HomePage,
      navigationOptions:{
          header:null,
          tabBarIcon:({focused,tintColor}) => (
            <Image
              source={news_normal}
              style={{width:23,height:23,tintColor:tintColor}}
            />)
          },
        },
    GlobalPage:{
      screen:GlobalPage,
      navigationOptions:{
          header:null,
          tabBarIcon:({focused,tintColor}) => (
            <Image
              source={global_normal}
              style={{width:23,height:23,tintColor:tintColor}}
            />)
          },
        },
       
    VideoPage:{
      screen:VideoPage,
      navigationOptions:{
          header:null,
          tabBarIcon:({focused,tintColor}) => (
            <Image
              source={video_normal}
              style={{width:23,height:23,tintColor:tintColor}}
            />)
          },
        },
  };
  
  const TabNavigatorConfigs = {
      initialRouteName:'HomePage',
      animationEnabled: false,
      tabBarPosition: 'bottom',
      mode: 'card',
      headerMode: 'screen',
      //是否允许在标签之间进行滑动
      swipeEnabled: true,
      backBehavior: "none",
      tabBarOptions:{
        activeTintColor:'#333333',
        inactiveTintColor:'grey',
        showIcon:true,
      },
      tabBarComponent:(props) => <TabBar {...props} />,// 自定义tab样式
  };
  const APP = createBottomTabNavigator(TabRouteConfigs,TabNavigatorConfigs);
  const GlobalNavigator = createStackNavigator(
        {
          aPP: {
            screen:APP,
            navigationOptions:{
              header:null,
            }
          },
          ...routeIndex,
      },{
          // mode: 'modal',
          // headerMode:'screen'
      }
  );
  export default createAppContainer(GlobalNavigator);
  