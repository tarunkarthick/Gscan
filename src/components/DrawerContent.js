import React, { Component } from 'react'
import {View,Text,TouchableOpacity,Alert,Dimensions} from 'react-native'

import {Avatar, Caption, Drawer, Title,Badge} from 'react-native-paper'
import {DrawerContentScrollView,DrawerItem} from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Modal from 'react-native-modal'


const DEVICE_WIDTH=Dimensions.get("window").width
const DEVICE_HEIGHT=Dimensions.get("window").height



class DrawerContent extends Component{

  
     state={
        authuser:'',
        visible:false,
      }
      
    showModal=()=>{
      this.setState({
          visible:true
      })
    }
    hideModal=()=>{
        this.setState({
            visible:false
        })
    }


    componentDidMount(){
     
      var userId=auth().currentUser.uid
       firestore().collection('Users').onSnapshot(querySnapshot=>{
        var user=''
        if(querySnapshot){
          querySnapshot.forEach(documentSnapshot=>{
            if(documentSnapshot.id==userId){
                user={
                  ...documentSnapshot.data(),
                  key:documentSnapshot.id
                }
            }
          })
          this.setState({
              authuser:user
          })
        }
      })

  }


  modeon(){
    const visible=this.state
    this.props.navigation.closeDrawer()
    this.showModal()
  
  }


  


    render(){
      const {authuser,visible}=this.state
      return(
        <View style={{flex:1}}>
         
              <Modal 
              isVisible={visible}
              deviceWidth={DEVICE_WIDTH}
              deviceHeight={DEVICE_HEIGHT}
              onBackdropPress={()=>this.hideModal()}
              swipeDirection="left"
              onSwipeComplete={() =>this.hideModal()}
              >
                <View style={{backgroundColor:"#fff",padding:20,borderRadius:10}}>
                    <View style={{flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <Text style={{fontFamily:'Pacifico-Regular',fontSize:23,color:"#65187A"}}>Gs</Text>
                        <Text style={{marginLeft:10,marginTop:5,fontSize:25,fontFamily:'Montserrat-Bold',color:"#65187A"}}>Guesture Scan</Text>
                    </View>
                    <View style={{marginTop:10,padding:10}}>
                            <Text style={{alignSelf:"center",fontSize:17,fontFamily:"Montserrat-Bold"}}>Developed By</Text>
                            <Text style={{marginTop:5,alignSelf:"center",fontSize:17,fontFamily:"Montserrat-Medium"}}>I Tarun karthick,PSG College Of Technology Coimbatore</Text>
                    </View>
                </View>
            </Modal>
          
            {authuser?
                    <View style={{flex:1}}>
                     <View style={{backgroundColor:"#8565c4",padding:5}}>
                     <Text style={{alignSelf:"center",fontFamily:"Pacifico-Regular",fontSize:25}}>Gs</Text>
                  </View>
                  <DrawerContentScrollView  {...this.props}>
                      <View style={styles.drawerContent}>
                         
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate('profile',{
                                item:authuser
                            })}>
                                  <View style={{marginTop:15}}>
                                      <Avatar.Text style={{backgroundColor:'#002b80',alignSelf:"center"}}  size={100} label={authuser.name[0]} />
                                      <View style={{marginTop:10,justifyContent:"center",alignItems:"center"}}>
                                        <Title style={styles.title}>{authuser.name}</Title>
                                        <Caption style={styles.caption}>{authuser.email}</Caption>
                                      </View>
                                    </View>
                                </TouchableOpacity>
      
                          <Drawer.Section style={styles.drawerSection}>
      
                              <DrawerItem
                              icon={({color,size})=>(<MaterialIcons 
                                  name='notifications'
                                  color="#ffba00"
                                  size={size}
                                  
                              />
                          
                              )}
                              
                              labelStyle={{color:"#000",fontFamily:"Montserrat-Medium"}}
                              label="Notifications"
                              onPress={()=>this.props.navigation.navigate('notification')}
                          
                          />
                         
      
      
      
                            <DrawerItem
                              icon={({color,size})=>(<MaterialIcons 
                                  name='info'
                                  color="#0198E1"
                                  size={size}
                              />
                              )}
                              labelStyle={{color:"#000",fontFamily:"Montserrat-Medium"}}
                              label="About Guesture Scan"
                              onPress={()=>this.modeon()}
                          
                          />
      
                          </Drawer.Section>
                      </View>
                  </DrawerContentScrollView>
                  <Drawer.Section style={styles.bottomDrawerSection}>
                      <DrawerItem
                          icon={({color,size})=>(<Icon 
                              name='exit-to-app'
                              color="#FF0000"
                              size={size}
                          />
                          )}
                          labelStyle={{color:"#000",fontFamily:"Montserrat-Medium"}}
                          label="Sign Out"
                          onPress={()=>auth().signOut().then(() => console.log('User signed out!'))}
                      
                      />
                  </Drawer.Section>
                </View>

              :
              null
            }
           
        </View>
    )
    }
   
}

export default DrawerContent

const styles = {
    drawerContent: {
      flex: 1,
    },
    title: {
      fontSize: 16,
      marginTop: 3,
      fontWeight: 'bold',
    },
    caption: {
      fontSize: 14,
      lineHeight: 14,
    },
    row: {
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
    },
    section: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 15,
    },
    paragraph: {
      fontWeight: 'bold',
      marginRight: 3,
    },
    drawerSection: {
      marginTop: 15,
    },
    bottomDrawerSection: {
        marginBottom: 15,
      
    },
  }