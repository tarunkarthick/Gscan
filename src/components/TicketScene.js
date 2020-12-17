import React, { Component } from 'react'
import {View,Text,StatusBar,TouchableOpacity,ScrollView,Dimensions,Linking,BackHandler} from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {IconButton} from 'react-native-paper'
import QRCode from 'react-native-qrcode-svg'
import Moment from 'moment'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import {captureScreen} from "react-native-view-shot";
import Share from "react-native-share"
var RNFS = require('react-native-fs')






const DEVICE_WIDTH=Dimensions.get("window").width

class TicketScene extends Component{

    _menu = null;

    setMenuRef = ref => {
      this._menu = ref;
    };
  
    hideMenu = () => {
      this._menu.hide();
    };
  
    showMenu = () => {
      this._menu.show();
    };


    sendImage=()=>{
        const {navigation,route}=this.props
        const {item,detail}=route.params
        captureScreen({
            format: "jpg",
            quality: 0.8
          })
          .then((uri)=>{
            RNFS.readFile(uri, 'base64').then((res) => {
                let urlString = 'data:image/jpeg;base64,' + res
                Share.shareSingle({
                    social: Share.Social.WHATSAPP,
                    whatsAppNumber: "91"+item.mobile, 
                    url:urlString,
                    type: 'image/jpeg'
                })
                .then((res) => { console.log(res) })
                .catch((err) => { err && console.log(err); });
            })
          })
          .catch((error)=>console.error("Oops, snapshot failed", error))
    }


    componentDidMount(){
        const {navigation,route}=this.props
        const {item,detail}=route.params
        BackHandler.addEventListener('hardwareBackPress', function() {return true})
       
      
        navigation.setOptions({
           title:"Entry Ticket",
           headerTitleStyle:{
               alignSelf:'center',
               fontSize:23
           },
           headerTintColor:'#fff',
           headerStyle:{
               backgroundColor:'#00b300'
           },
           headerLeft: () => (
            <View/>
        ),
            headerRight: () => (



              <View style={{ flex: 1,justifyContent: 'center',marginRight:10 }}>
                <Menu
                style={{maxWidth:'auto',maxHeight:"auto"}}
                ref={this.setMenuRef}
                button={ <SimpleLineIcons
                    onPress={this.showMenu}
                    name="options-vertical"
                    color="#fff"
                    size={26}
                  />}
                >
                <MenuItem  style={{maxWidth:'auto',padding:5}}  onPress={this.hideMenu}>
                   
                      <View style={{maxWidth:'auto',flexDirection:'row'}}>
                        <MaterialCommunityIcons
                        name="whatsapp"
                        color="#25D366"
                        size={26}
                         />
                       <Text ellipsizeMode="tail" numberOfLines={1} style={{fontSize:18,marginLeft:10,width:DEVICE_WIDTH-120}}>Invite via {item.name}'s Whatsapp</Text>
                   
                      </View> 
                        
                </MenuItem>

                <MenuItem  style={{maxWidth:'auto',padding:5}} onPress={this.sendImage}>

                    <View style={{maxWidth:'auto',flexDirection:"row"}}>
                        <MaterialIcons
                        name="share"
                        color="#25D366"
                        size={25}
                         />
                      
                       <Text style={{fontSize:18,marginLeft:10}}>share Ticket</Text>
                      
                        
                    </View>
                       
                  
                </MenuItem>
                
                </Menu>
            </View>
              
             
            )
        })
      }

      moveContent(){
        const {navigation}=this.props
        navigation.navigate('overview')
    }
    
    render(){
       const {route}=this.props
       const {item,detail}=route.params
        return(
    
            <View style={{flex:1,backgroundColor:'#fff'}}>
                <StatusBar backgroundColor="#4c9900" barStyle="light-content" />
                <ScrollView
                showsVerticalScrollIndicator={false}
                >
                <View >
                <Text style={{marginTop:5,textAlign:"center",fontSize:18,fontFamily:"Montserrat-ExtraBold"}}>Hey {item.name},</Text>
                <View style={{borderBottomWidth:1,marginTop:10,padding:10}}>
                    <Text style={{textAlign:"center"}}>Your reservation for {detail.name} is successful!.You can scan the following ticket at the venue to check-in</Text>
                </View>
                <View style={{alignItems:"center",marginTop:30}}>
                <QRCode
                    value={item.qrnum}
                    size={180}
                />
                <Text style={{fontSize:18}}>{item.qrnum}%{item.name.substring(0,3)}</Text>
                </View>

                </View>




                <View style={styles.topstyle}>
                    <Text style={styles.textStyle}>{detail.name}</Text>
                    <View style={{backgroundColor:"#eeeeee"}}>
                        <View style={styles.boxStyle}>
                        <Entypo
                            name="calendar"
                            color="#dc143c"
                            size={28}
                        />
                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontSize:17}}>Staring Date</Text>
                            <Text style={{fontSize:16,color:"#646c64",textAlign:"center"}}>{Moment(detail.date).format('MMMM Do,YYYY')}</Text>
                        </View>
                        <View>
                            <Text style={{color:"#fff",fontSize:15}}>{detail.location}</Text>
                        </View>
                        

                        </View>



                        <View style={styles.boxStyle}>
                            <MaterialCommunityIcons
                            name="update"
                            color="green"
                            size={28}
                            />
                            <View style={{flexDirection:"column"}}>
                                <Text style={{fontSize:17}}>Staring Time</Text>
                                <Text style={{fontSize:16,color:"#646c64",textAlign:"center"}}>{Moment(detail.date).format('h:mm A')}</Text>
                            </View>
                            <View>
                            <Text style={{color:"#fff",fontSize:15}}>{detail.location}</Text>
                        </View>

                        </View>

                        <View style={styles.boxStyle}>
                        <Ionicons
                            name="location"
                            color="#800080"
                            size={28}
                         />
                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontSize:17}}>Location</Text>
                            <Text style={{fontSize:16,color:"#646c64",textAlign:"center"}}>{detail.location}</Text>
                        </View>
                        <View>
                            <Text style={{color:"#fff",fontSize:15}}>{detail.location}</Text>
                        </View>

                        </View>
                    </View>

                    <Text style={{marginTop:10,marginBottom:10,fontSize:18,textAlign:"center",fontFamily:"Pacifico-Regular"}}>This event is managed on Guesture Scan</Text>
                    </View>


                </ScrollView>

                <IconButton onPress={()=>this.moveContent()}  size={37} style={{backgroundColor:"#b30000",alignSelf:"center",bottom:10,position:"absolute"}} color="#fff" icon="home"/> 


            </View>
        )
    }
}


const styles={
    topstyle:{
        backgroundColor:"#fff",
        marginLeft:10,
        marginRight:10,
        marginTop:30
    },
    textStyle:{
        textAlign:"center",
        borderRadius:5,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:"#002b80",
        color:"#fff",
        fontSize:18

    },
    boxStyle:{
        flexDirection:"row",
        justifyContent:"space-between",
        padding:10,
        borderRadius:5,
        backgroundColor:"#fff",
        margin:5

    }
}



export default TicketScene