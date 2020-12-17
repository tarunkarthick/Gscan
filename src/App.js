import React,{Component,useState,useEffect} from 'react'
import {View,Text,Dimensions, Alert,LogBox} from 'react-native'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack'
import auth from '@react-native-firebase/auth'
import { createDrawerNavigator } from '@react-navigation/drawer'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import LoadingScene from './components/LoadingScene'
import CarouselScene from './components/CaroselScene'
import SigninScene from './components/SigninScene'
import SignupScene from './components/SignupScene'
import mainScene from './components/mainScene'
import AddEventScene from './components/AddEventScene'
import OverviewScene from './components/OverviewScene'
import AddGuestScene from './components/AddGuestScene'
import displayQrScene from './components/displayQrScene'
import TicketScene from './components/TicketScene'
import InviteScene from './components/InviteScene'
import NotificationScene from './components/NotificationScene'
import DrawerContent from './components/DrawerContent'
import Myprofile from './components/MyProfile'
import RootStack from './RootStack'
// import {UserProvider} from './components/UserProvider'




const initialState={
    isAuth:false,
    Loading:false,
    inviteUser:false,
    leaveRights:false,
    roleUpdate:false
}

const reducer=(state=initialState,action)=>{
    switch(action.type){
        case "AUTH_TRUE":
            return{isAuth:true}
        case "AUTH_FALSE":
            return{isAuth:false}
        case "LOAD_TRUE":
            return{Loading:true}
        case "LOAD_FALSE":
            return{Loading:false}
        case "INVITE_TRUE":
            return{inviteUser:true}
        case "INVITE_FALSE":
            return{inviteUser:false}
        case "LEAVE_TRUE":
            return{leaveRights:true}
        case "LEAVE_FALSE":
            return{leaveRights:false}
        case "ROLE_TRUE":
            return{roleUpdate:true}
        case "ROLE_FALSE":
            return{roleUpdate:false}
    }
   

    return state
}

const store=createStore(reducer)


// const Drawer=createDrawerNavigator()

// const Stack=createStackNavigator()


// global.isAuth=false

LogBox.ignoreAllLogs()

class App extends Component{
    //     state={
    //         isAuth:false
    //     }
        
    //     componentDidMount(){
    //         auth().onAuthStateChanged((user)=>{
    //             if(user){
    //                 this.setState({
    //                     isAuth:true
    //                 })
    //             }
    //             else{
    //                 this.setState({
    //                     isAuth:false
    //                 })
    //             }
    //         })
                
    // }


    

    render(){
       
        return(
            <Provider store={store}>
                <RootStack/>
            </Provider>
            // <UserProvider>
            //  </UserProvider>
           
            // <NavigationContainer>
            //     {!isAuth?
            //      <Stack.Navigator initialRouteName="carousel">
                    
            //          <Stack.Screen options={{headerShown:false}} name="carousel" component={CarouselScene}/>
            //          <Stack.Screen options={{headerShown:false}} name="signin" component={SigninScene}/>  
            //          <Stack.Screen options={{headerShown:false}} name="signup" component={SignupScene}/> 
            //      </Stack.Navigator>
            //      :
            //      <Drawer.Navigator   drawerStyle={{ width:'70%'}}  drawerContent={props=><DrawerContent {...props}/>} initialRouteName="maincontent">
                      
            //          <Drawer.Screen options={{swipeEnabled:false}}  name="maincontent" component={mainScene} />
            //          <Drawer.Screen options={{swipeEnabled:false}} name="profile" component={Myprofile} />
            //          <Drawer.Screen options={{swipeEnabled:false}} name="notification" component={NotificationScene} />
            //       </Drawer.Navigator>
    
            //     }
    
    
            //     {/* <Stack.Navigator initialRouteName="Loading">
            //         <Stack.Screen options={{headerShown:false}} name="loading" component={LoadingScene}/>
            //         <Stack.Screen options={{headerShown:false}} name="carousel" component={CarouselScene}/>
            //         <Stack.Screen name="main" component={mainScene}/>
            //         <Stack.Screen options={{headerShown:false}} name="signin" component={SigninScene}/>  
            //         <Stack.Screen options={{headerShown:false}} name="signup" component={SignupScene}/>                    
            //         <Stack.Screen  name="addevent" component={AddEventScene}/> 
            //         <Stack.Screen  name="overview" component={OverviewScene}/>
            //         <Stack.Screen  name="guests" component={AddGuestScene}/>
            //         <Stack.Screen  name="display" component={displayQrScene}/>
            //         <Stack.Screen name="view" component={TicketScene}/>
            //         <Stack.Screen name="invite" component={InviteScene}/>
    
    
                   
    
            //     </Stack.Navigator> */}
    
    
    
            // </NavigationContainer>
    

         )  
        
    }
   
   
}

export default App

