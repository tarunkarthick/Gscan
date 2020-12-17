import React,{Component} from 'react'
import {View,Text,TouchableOpacity,ScrollView} from 'react-native'
import * as Animatable from 'react-native-animatable'
import firestore from '@react-native-firebase/firestore'
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import  {connect} from 'react-redux'
import {Avatar,Caption,TextInput,Title} from 'react-native-paper'
import MyProfileScene from './MyProfileScene'

const profileStack=createStackNavigator()




const MyProfile=({route})=>{
    const {item}=route.params
    return(
        <profileStack.Navigator initialRouteName="profilescreen">
            <profileStack.Screen name="profilescreen">
                {(props)=><MyProfileScene {...props} item={item}/>}
            </profileStack.Screen>
        </profileStack.Navigator>
    )
}



export default MyProfile