import React, { Component } from 'react'
import {Text,View} from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DashboardScene from './DashboardScene'
import GuestScene from './GuestScene'
import CheckScene from './CheckScene'
import WorkSpace from './WorkSpace'

const Tab = createMaterialBottomTabNavigator();


class OverviewScene extends Component{

  


    componentDidMount(){
        const {route,navigation}=this.props
        const {item}=route.params
        navigation.setOptions({
            title:item.name,
            headerTitleStyle:{
                alignSelf:'center',
                fontSize:23
            },
            headerTintColor:'#fff',
            headerStyle:{
                backgroundColor:'#65187A'
            },
            headerRight: () => (
              <View/>
             
            )
        })
    }

    render(){
        const {navigation,route}=this.props
        const {item}=route.params
        const {checkinuser}=route.params
      
        return (
            <Tab.Navigator
            initialRouteName="Dashboard"
            activeColor="#fff"
            barStyle={{ backgroundColor: '#65187A' }}
            
          >
            <Tab.Screen
              name="Dashboard"
              options={{
                tabBarLabel: 'Dashboard',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home" color={color} size={26} />
                ),
              }}
            >
              {(props) => <DashboardScene  {...props} item={item} />}
            </Tab.Screen>
            <Tab.Screen
              name="Guests"
              options={{
                tabBarLabel: 'Guests',
                tabBarIcon: ({ color }) => (
                  <MaterialIcons name="group" color={color} size={26} />
                ),
              }}

            >
              {(props) => <GuestScene  {...props} user={item} />}
            </Tab.Screen>
            <Tab.Screen
              name="Checkin"
              options={{
                tabBarLabel: 'Check-In',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="send-circle-outline" color={color} size={26} />
                ),
              }}
            >
              {(props) => <CheckScene   {...props} item={item} checkinuser={checkinuser} />}
            </Tab.Screen>
            <Tab.Screen
              name="Work"
              options={{
                tabBarLabel: 'WorkSpace',
                tabBarIcon: ({ color }) => (
                  <MaterialCommunityIcons name="home-city" color={color} size={26} />
                ),
              }}
            >
              {(props) => <WorkSpace   {...props} item={item}  />}
              </Tab.Screen>
          </Tab.Navigator>
        )
    }
}


export default OverviewScene