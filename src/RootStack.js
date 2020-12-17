import React,{Component, useContext,useState,useEffect} from 'react'
import {View,Text} from 'react-native'
import  {connect} from 'react-redux'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import auth from '@react-native-firebase/auth'
// import {UserContext} from './components/UserProvider'
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
import UserProvider from './components/UserProvider'




const RStack=createStackNavigator()
const RootDrawer=createDrawerNavigator()



//global.userAuth=false

class RootStack extends Component{

    // constructor(props){
    //     super(props)
    // }

    state={
        user:false,
        load:false
    }

    // componentDidMount(){
    // //    setTimeout(()=>this.props.LoadPage(),1200) 
       
    //     auth().onAuthStateChanged((user)=>{
    //         if(user){
    //             this.props.authTrue()
               
    //         }
    //         else{
    //             this.props.authFalse()

    //         }
    //     })
        
    // }


    
    
    componentDidMount(){
        auth().onAuthStateChanged((user)=>{
            if(user){
                this.setState({
                    user:true
                })
                
            }
            else{
                this.setState({
                    user:false
                })
            }
          })

        setTimeout(()=>{
            this.setState({
                load:true
            })
        },2000)
    }

   

   


  
    
   

  
        render(){
            return(
                <View style={{flex:1}}>
                    {this.state.load?
                            <NavigationContainer>
                     
                                {!this.state.user?
                                
                                <RStack.Navigator initialRouteName="carousel">
                                <RStack.Screen options={{headerShown:false}} name="carousel" component={CarouselScene}/>
                                <RStack.Screen options={{headerShown:false}} name="signin" component={SigninScene}/>  
                                <RStack.Screen options={{headerShown:false}} name="signup" component={SignupScene}/> 
                                </RStack.Navigator>
                                :
                                
                                <RootDrawer.Navigator   drawerStyle={{ width:'70%'}}  drawerContent={props=><DrawerContent {...props}/>} initialRouteName="maincontent">
                                
                                <RootDrawer.Screen options={{swipeEnabled:false}}  name="maincontent" component={mainScene} />
                                <RootDrawer.Screen options={{swipeEnabled:false}} name="profile" component={Myprofile} />
                                <RootDrawer.Screen options={{swipeEnabled:false}} name="notification" component={NotificationScene} />
                                </RootDrawer.Navigator>
                                }
                                
                    
                            </NavigationContainer>
                    :
                       <LoadingScene/>
                    }
                </View>
                
    
                
               
                
            )  
    
        }
       
       
        
}


// function mapStateToProps(state){
   
//     return{
//         isAuth:state.isAuth,
//         Loading:state.Loading,
//     }
// }

// function mapDispatchToProps(dispatch){
//     return{
//         authTrue:()=>dispatch({type:'AUTH_TRUE'}),
//         authFalse:()=>dispatch({type:'AUTH_FALSE'}),
//     }
// }




// export default connect(mapStateToProps,mapDispatchToProps)(RootStack)
export default RootStack