import React, { Component } from 'react'
import {View,Image,Animated,StatusBar} from 'react-native'
import auth from '@react-native-firebase/auth'
import Logo from '../images/logo.jpg'


class LoadingScene extends Component{
        state={
            LogoAnime:new Animated.Value(0)
        }
    
    componentDidMount(){
        const {navigation}=this.props
        const {LogoAnime}=this.state
        Animated.spring(LogoAnime,{
            toValue:1,
            tension:10,
            friction:2,
            duration:1000,
            useNativeDriver:true
        }).start()
        // setTimeout( function(){
        //     console.log("Load")
        // }
        //    this.props.Loading()
        // //     auth().onAuthStateChanged((user)=>{
        // //             if(user){
        //                 // navigation.reset({
        //                 //     index:0,
        //                 //     routes:[{name:'main'}]
        //                 // })               
        // //            }
        // //            else{
        // //             navigation.reset({
        // //                 index:0,
        // //                 routes:[{name:'carousel'}]
        // //             })
        // //            }
               
        // //    })
        // ,1200)
    }

    render(){
        return(
            <View style={styles.container}>
                 <StatusBar backgroundColor="#000000" barStyle="light-content" />
                <Animated.View style={{
                    opacity:this.state.LogoAnime,
                    transform:[{
                        translateY:this.state.LogoAnime.interpolate({
                            inputRange:[0,1],
                            outputRange:[80,0]
                        })
                    }]
                }}>
                    <Image source={Logo}/>
                </Animated.View>
            </View>
        )
    }
}


const styles={
    container:{
        flex:1,
        backgroundColor:"#000000",
        justifyContent:"center",
        alignItems:"center"
    }
}

export default LoadingScene
