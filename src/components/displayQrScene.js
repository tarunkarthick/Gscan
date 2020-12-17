import React, { Component } from 'react'
import {View,Text,TouchableOpacity,Linking,Dimensions} from 'react-native'
import { QRScannerView } from 'react-native-qrcode-scanner-view'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {IconButton} from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'

const SCREEN_HEIGHT = Dimensions.get("window").height;

class displayQrScene extends Component{

    state={
        name:"flashlight-off",
        torch:false
    }

    flash=(torch)=>{
        if(!torch){
            this.setState({
                name:"flashlight",
                torch:true
            })
        }
        else{
            this.setState({
                name:"flashlight-off",
                torch:false
            })
        }
    }

    componentDidMount(){
        const {navigation}=this.props
        navigation.setOptions({
           title:"Scan Ticket",
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
  


    barcodeReceived = (event) => { 
        const {navigation,route}=this.props
        const {item}=route.params
        var user=item.key
        var eventuser=event.data.toString()
        firestore().collection('Events').doc(user).collection('Participants')
        .onSnapshot(querySnapshot=>{
            var checkinuser
            querySnapshot.forEach(documentSnapshot=>{
                if(eventuser==documentSnapshot.data().qrnum){
                     checkinuser={
                        ...documentSnapshot.data(),
                        key:documentSnapshot.id
                     }                  

                    
                }
                  
            })
            navigation.navigate('overview',{
                item:item,
                checkinuser:checkinuser
            })
        })

       
        
     };

     renderMenu=()=><IconButton
     onPress={()=>this.flash(this.state.torch)}
     style={{backgroundColor:"#fff",alignSelf:"center",bottom:20}}
     icon={this.state.name}
     size={30}
     color="grey"
 />


    render(){
        const {navigation,route}=this.props
        const {torch}=this.state
        const {item}=route.params
        return(
            <View style={{flex:1}}>
            < QRScannerView
                onScanResult={ this.barcodeReceived }
                hintText={null}               
                scanBarAnimateReverse={ true }
                torchOn={torch}
                renderFooterView={ this.renderMenu }
                />
            
                
           </View>
        )
    }
}


export default displayQrScene