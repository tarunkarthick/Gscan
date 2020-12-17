import React,{Component, useEffect} from 'react'
import {View,Text,TouchableOpacity,FlatList, Alert,Dimensions} from 'react-native'
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import messaging from '@react-native-firebase/messaging';
import {IconButton} from 'react-native-paper'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import { firebase } from '@react-native-firebase/functions';
import Moment from 'moment'
import * as Progress from 'react-native-progress'

const DEVICE_WIDTH=Dimensions.get("window").width
const DEVICE_HEIGHT=Dimensions.get("window").height




const notificationStack=createStackNavigator()

class Notification extends Component{

    constructor(props){
        super(props);
         this.state={
             item:'',
             owner:"",
             Role:"",
             author:"",
             type:'',
             invite:"",
             Notifications:[],
             loading:true
         }
         this.props.navigation.addListener('focus',()=>{
             this.componentDidMount()
         })
 
    }


    clearDoc(){
        const userId = auth().currentUser.uid;
        this.setState({
            loading:true
        })
        try{
            const ref=firestore().collection('Users').doc(userId).collection('Notifications')
            ref.get().then(querySnapshot=>{
                if(querySnapshot){
                      const Notifications=[]
                      querySnapshot.forEach(DocumentSnapshot=>{
                          if(DocumentSnapshot.data().type=="invite")
                          {
                            Notifications.push({
                                ...DocumentSnapshot.data(),
                                key:DocumentSnapshot.id
                            })
                          }
                          else{
                                ref.doc(DocumentSnapshot.id).delete()
                          }
                         
                         
                      })
                      this.setState({
                        Notifications:Notifications,
                    })
                }
            })
            .then(()=>{
                this.setState({
                    loading:false
                })
            })
        }
        catch(e){
        }
    }

    componentDidMount(){
        const {navigation}=this.props
        const userId = auth().currentUser.uid;
        var Role,item,owner,author,type
        navigation.setOptions({
            title:"Notification",
            headerTitleStyle:{
                fontSize:23
            },
            headerTintColor:"#fff",
            headerStyle:{
                backgroundColor:'#800080'
            },
            headerLeft: ()=>(
                <TouchableOpacity
                onPress={()=>this.props.navigation.goBack()}
               style={{marginLeft:13}}>
               <MaterialIcons
                   name="arrow-back"
                   color="#fff"
                   size={30}
               />
               </TouchableOpacity>
             ),
             headerRight: ()=>(
               <TouchableOpacity
               onPress={()=>this.clearDoc()}
               style={{marginRight:10,flexDirection:"row"}}>
               <MaterialCommunityIcons
                   name="notification-clear-all"
                   color="#fff"
                   size={24}
               />
               <Text style={{marginLeft:5,color:"#fff",fontSize:17,marginTop:2}}>Clear All</Text>
               </TouchableOpacity>
             )
        })
        
       
        // try{
        //     messaging().onMessage(async remoteMessage => {
        //     if(JSON.parse(remoteMessage.data.type)=="invite"){
        //         // Role = JSON.parse(remoteMessage.data.Role);
        //         // item = JSON.parse(remoteMessage.data.item);
        //         // owner= JSON.parse(remoteMessage.data.owner);   
        //         // author= JSON.parse(remoteMessage.data.author);   
        //         // type= JSON.parse(remoteMessage.data.type); 
        //         console.log(JSON.parse(remoteMessage.data.Role))
            
             
        //     }

        //     firestore().collection('Users').doc(userId).collection('Notifications')
        //     .doc().add({
        //         Role:Role,
        //         item:item,
        //         owner:owner,
        //         author:author,
        //         type:type
        //         })  
            
           
        // }
        // catch(e){}

        messaging().onNotificationOpenedApp(remoteMessage => {
            navigation.navigate("maincontent");
          });

        messaging().getInitialNotification().then((remoteMessage)=>{
            var rem=remoteMessage
        })
    
        

         try{
            firestore().collection('Users').doc(userId).collection('Notifications')
            .orderBy('timestamp', 'desc')
            .onSnapshot(querySnapshot=>{
                if(querySnapshot){
                      const Notifications=[]
                      querySnapshot.forEach(DocumentSnapshot=>{
                          Notifications.push({
                              ...DocumentSnapshot.data(),
                              key:DocumentSnapshot.id
                          })
                         
                      })
                      this.setState({
                        Notifications:Notifications,
                        loading:false
                    })
                }
            })
         }
         catch(e){}
          
    }

    accept=async(item)=>{
        const userId = auth().currentUser.uid;
        this.setState({
            loading:true
        })
        await firestore().collection('Events').doc(item.item.key).set({
            members:{
                [userId]:{
                    role:item.Role
                }
            }
        },{
            merge:true
        })

        await firestore().collection('Users').doc(item.author.authId).collection('Notifications').doc().set({
            owner:item.owner,
            type:'accept',
            time:Moment().format('LT'),
            date:Moment().format('L'),
            timestamp: firestore.FieldValue.serverTimestamp(),
        })

        await firestore().collection('Users').doc(userId).collection('Notifications').doc(item.key).delete()
        .then(() => {
          console.log('Notification deleted!');
          this.setState({
            loading:false
        })
        });

        

        await firebase.functions().httpsCallable('acceptCall')({
            author:item.author,
            owner:item.owner
        })
    }


    decline=async(item)=>{
        const userId = auth().currentUser.uid;
        this.setState({
            loading:true
        })

        await firestore().collection('Events').doc(item.item.key).set({
            members:{
                [userId]:firestore.FieldValue.delete()
            }
        },{
            merge:true
        })


        await firestore().collection('Users').doc(item.author.authId).collection('Notifications').doc().set({
            owner:item.owner,
            type:'decline',
            time:Moment().format('LT'),
            date:Moment().format('L'),
            timestamp: firestore.FieldValue.serverTimestamp(),
        })

       

        await firestore().collection('Users').doc(userId).collection('Notifications').doc(item.key).delete()
        .then(() => {
          console.log('Notification deleted!');
          this.setState({
              loading:false
          })
        });

        

        await firebase.functions().httpsCallable('declineCall')({
            author:item.author,
            owner:item.owner
        })
    }

    

    render(){
        const {Notifications}=this.state
        return(
           <View style={{flex:1}}>
                {this.state.loading?

                <Progress.Bar
                style={{borderWidth:0}}
                width={DEVICE_WIDTH}
                height={4}
                indeterminate={true}
                />


                :


                <View style={{flex:1}} >
                {Notifications[0]?
                <FlatList
                 data={Notifications}
                 renderItem={({item})=>(
                     <View style={{flex:1}}>
                        {item.type=="invite"?
                            <View style={{flex:1}}>
                                <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",padding:20}}>
                                    <IconButton  size={30} style={{backgroundColor:"#000072",marginTop:6}} color="#fff" icon="pencil-box"/> 
                                    <View style={{flex:1,flexDirection:"column",marginLeft:5}}>
                                        <Text style={{fontFamily:"Montserrat-Bold",fontSize:14,alignSelf:"center"}}>{item.author.name} sent you a request</Text>
                                        <Text style={{fontSize:16,color:"#646c64"}}>{item.author.name} invited you to join their workspace-{item.item.name}</Text>
                                    </View>
                                    <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                                        <Text>{item.time}</Text>
                                        <Text>{item.date}</Text>
                                    </View>
                                </View>
                                <View style={{flex:1,flexDirection:"row",marginTop:10,justifyContent:"space-around",margin:15}}>
                                    <TouchableOpacity style={{backgroundColor:"#0AC92B",borderRadius:5,width:90}} onPress={()=>this.accept(item)}>
                                        <Text style={{color:"#fff",padding:10,alignSelf:"center"}}>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{backgroundColor:"#FF0000",borderRadius:5,width:90}} onPress={()=>this.decline(item)}>
                                        <Text style={{color:"#fff",padding:10,alignSelf:"center"}}>Decline</Text>
                                    </TouchableOpacity>
                                </View>
                                <View
                                    style={{
                                        marginLeft:8,
                                        marginRight:8,
                                        marginTop:5,
                                        borderBottomColor: 'grey',
                                        borderBottomWidth: 1,
                                    }}
                                    />
                            
                            </View>
                        
                        :
                         <View>
 
                            {item.type=="leave"?
                                 <View style={{flex:1}}>
                                 <View style={{flex:1}}>
                                     <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",padding:20}}>
                                             <IconButton  size={30} style={{backgroundColor:"#000072",marginTop:6}} color="#fff" icon="hand-pointing-right"/> 
                                             <View style={{flex:1,flexDirection:"column",marginLeft:5}}>
                                                 <Text style={{fontFamily:"Montserrat-Bold",fontSize:14}}>{item.item.name}</Text>
                                                 <Text style={{fontSize:16,color:"#646c64",alignSelf:"center"}}>You have been removed from the workspace</Text>
                                             </View>
                                             <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                                                 <Text>{item.time}</Text>
                                                 <Text>{item.date}</Text>
                                             </View>
                                     </View>
                                     <View
                                 style={{
                                     marginLeft:8,
                                     marginRight:8,
                                     marginTop:5,
                                     borderBottomColor: 'grey',
                                     borderBottomWidth: 1,
                                 }}
                                 />
                                 </View>
                             </View>


                            :
                            <View>
                                 {item.type=='roleChange'?

                                    
                                        <View style={{flex:1}}>
                                        <View style={{flex:1}}>
                                            <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",padding:20}}>
                                                    <IconButton  size={30} style={{backgroundColor:"#000072",marginTop:6}} color="#fff" icon="hand-pointing-right"/> 
                                                    <View style={{flex:1,flexDirection:"column",marginLeft:5}}>
                                                        <Text style={{fontFamily:"Montserrat-Bold",fontSize:14}}>{item.item.name} - Role updated</Text>
                                                        <Text style={{fontSize:16,color:"#646c64",alignSelf:"center"}}>You are now an {item.Role}</Text>
                                                    </View>
                                                    <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                                                        <Text>{item.time}</Text>
                                                        <Text>{item.date}</Text>
                                                    </View>
                                            </View>
                                            <View
                                        style={{
                                            marginLeft:8,
                                            marginRight:8,
                                            marginTop:5,
                                            borderBottomColor: 'grey',
                                            borderBottomWidth: 1,
                                        }}
                                        />
                                        </View>
                                        </View>
                             :
                             <View>
                                 {item.type=='accept'?
                                        <View style={{flex:1}}>
                                        <View style={{flex:1}}>
                                           <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",padding:20}}>
                                                   <IconButton  size={30} style={{backgroundColor:"#000072",marginTop:6}} color="#fff" icon="hand-pointing-right"/> 
                                                   <View style={{flex:1,flexDirection:"column",marginLeft:5}}>
                                                       <Text style={{fontFamily:"Montserrat-Bold",fontSize:14}}>Invitation Accepted</Text>
                                                       <Text style={{fontSize:16,color:"#646c64",alignSelf:"center"}}>{item.owner.name} accepted your invite to join the workspace</Text>
                                                   </View>
                                                   <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                                                       <Text>{item.time}</Text>
                                                       <Text>{item.date}</Text>
                                                   </View>
                                           </View>
                                           <View
                                          style={{
                                              marginLeft:8,
                                              marginRight:8,
                                              marginTop:5,
                                              borderBottomColor: 'grey',
                                              borderBottomWidth: 1,
                                          }}
                                          />
                                       </View>
                                   </View>
                                   :
                                  <View style={{flex:1}}>
                                      <View style={{flex:1}}>
                                          <View style={{flex:1,flexDirection:"row",justifyContent:"space-around",padding:20}}>
                                                  <IconButton  size={30} style={{backgroundColor:"#000072",marginTop:6}} color="#fff" icon="hand-pointing-right"/> 
                                                  <View style={{flex:1,flexDirection:"column",marginLeft:5}}>
                                                      <Text style={{fontFamily:"Montserrat-Bold",fontSize:14}}>Invitation Declined</Text>
                                                      <Text style={{fontSize:16,color:"#646c64",alignSelf:"center"}}>{item.owner.name} declined your invite to join the workspace</Text>
                                                  </View>
                                                  <View style={{flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                                                      <Text>{item.time}</Text>
                                                      <Text>{item.date}</Text>
                                                  </View>
                                          </View>
                                          <View
                                      style={{
                                          marginLeft:8,
                                          marginRight:8,
                                          marginTop:5,
                                          borderBottomColor: 'grey',
                                          borderBottomWidth: 1,
                                      }}
                                      />
                                      </View>
                                  </View>
                                 }
                             </View>
 
                             }
                            </View>

                            }
                            
                         </View>
 
                        }
                     </View>
                 )}
 
                />
                 :
                 <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                     <Text style={{fontSize:18}}>You have no notifications!</Text>
                 </View>
                }
             </View>

               }
           </View>
        )
    }
}

const NotificationScene=()=>{
    return(
        <notificationStack.Navigator initialRouteName="notify">
            <notificationStack.Screen name="notify" component={Notification}/>
        </notificationStack.Navigator>
    )
}

export default NotificationScene