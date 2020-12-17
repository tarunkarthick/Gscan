import React, { Component,useEffect } from 'react'
import {View,Text,TouchableOpacity,FlatList,TouchableWithoutFeedback,StatusBar,Alert} from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Avatar, Drawer} from 'react-native-paper'
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack'
import messaging from '@react-native-firebase/messaging';
import Moment from 'moment'
import dynamicLinks from '@react-native-firebase/dynamic-links';
import url from 'url';




import AddEventScene from './AddEventScene'
import OverviewScene from './OverviewScene'
import AddGuestScene from './AddGuestScene'
import displayQrScene from './displayQrScene'
import TicketScene from './TicketScene'
import InviteScene from './InviteScene'
import mainAuth from './mainAuth'



const mainStack=createStackNavigator()




// class main extends Component{
//     state={
//         users:[]
//     }



//     componentDidMount(){
//         const {navigation}=this.props
//         navigation.setOptions({
//             headerStyle:{
//                 backgroundColor:'#65187A'
//             },
//          headerRight: () => (
//              <View style={{marginRight:13}}>
//                <MaterialCommunityIcons
//                    name="filter-variant"
//                    color="#fff"
//                    size={35}
//                />
//              </View>
          
//          ),
//             headerTitle:()=>(
//                    <View>
//                        <Text style={styles.textStyle}>My Events</Text>
//                        <TouchableOpacity 
//                      style={styles.addButton}
//                      onPress={()=>navigation.navigate('addevent')}
//                      >
//                        <Text style={styles.addButtonText}>+</Text>
//                      </TouchableOpacity>
                       
                     
//                    </View>                 
               
//             ),
//              headerLeft: ()=>(
//                 <TouchableOpacity
//                 onPress={()=>navigation.openDrawer()}
//                style={{marginLeft:13}}>
//                <Entypo
//                    name="menu"
//                    color="#fff"
//                    size={35}
//                />
//                </TouchableOpacity>
//              )
//         })
        
        
//         var userId=auth().currentUser.uid
//         firestore()
//         .collection('Events')
//         .onSnapshot(querySnapshot=>{
//             if(querySnapshot){
//             const user=[]

//                 querySnapshot.forEach(documentSnapshot=>{
                    
//                     var authlog=Object.keys(documentSnapshot.data().members)
                   
//                     if(authlog.includes(userId))
//                     {
//                         user.push({
//                             ...documentSnapshot.data(),
//                             key:documentSnapshot.id
//                         })
//                     }
              
                    
//                 })
//                 this.setState({
//                     users:user
//                 })  

//             }
         
//         })
      
       

//     }

//       movecontent(item){
//           const {navigation}=this.props
//           navigation.navigate('overview',{
//               item:item
//           })
//       }


      
    

    

//     render(){
//         const {navigation}=this.props
//         const {users}=this.state
//         console.log(this.props.isAuth)
      
//         return(
           
            
//             <View style={{flex:1,backgroundColor:'#65187A'}}>
//                 <StatusBar backgroundColor="#65187A" barStyle="light-content" />
//                 <View style={{flex:1,backgroundColor:'#fff',borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
//                 {users[0]?
//                 <FlatList
//                 data={users}
//                 renderItem={({ item }) => (
//                 <TouchableWithoutFeedback onPress={()=>this.movecontent(item)}>
//                     <View style={styles.action}>
//                         <View style={{flexDirection:'row'}}>
//                         <Avatar.Text style={{backgroundColor:'#002b80'}}  size={45} label={item.name[0]} />
//                         <View style={styles.box}>
//                             <Text style={{fontSize:20}}>{item.name}</Text>
//                             <Text style={{fontSize:16,color:'#646c64'}}>{item.location}</Text>
//                         </View>
//                         </View>
                        
//                         <View style={{flexDirection:"column"}}>
//                             <Text style={styles.dateStyle}>{Moment(item.date).format('D MMM')}</Text>
//                             <Text style={{backgroundColor:"#0AC92B",padding:2,fontSize:12,marginTop:5,marginRight:5,color:"#fff",borderRadius:10,alignSelf:"center"}}>{item.members[item.uid].role}</Text>
//                         </View>
                                             
                    
//                     </View>
//                 </TouchableWithoutFeedback>
                                    
//                 )}
//                 />:
//                 <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
//                     <Text style={{fontSize:18}}>You don't have any events.Start Organizing!</Text>
//                 </View>
//                 }
//                 </View>
//             </View>
            
              
//         )
//     }
    
// }

// const styles={
//     textStyle:{
//         top:2,
//         fontSize:24,
//         fontFamily:'Montserrat-ExtraBold',
//         color:'#fff',
//         alignSelf:"center"
//     },
//     addButton:{
//         alignSelf:"center",
//         backgroundColor:"#FF0000",
//         width:50,
//         height:50,
//         borderRadius:50,
//         borderColor:'#ccc',
//         alignItems:"center",
//         justifyContent:"center",
//         elevation:8,
//         marginBottom:-20,
//         zIndex:10
//     },
//     addButtonText:{
//         color:"#fff",
//         fontSize:35
//     },
//     action: {
//         flex:1,
//         flexDirection: 'row',
//         justifyContent : 'space-between',
//         marginLeft:10,
//         marginRight:10,
//         marginTop:23,
//         padding: 5
//     },
//     box:{
//         flexDirection:"column",
//         marginLeft:20
//     },
//     dateStyle:{
//         fontSize:17,
//         marginRight:18,
//         alignSelf:"center"
//     }
// }

async function saveTokenToDatabase(token){
    // Assume user is already signed in
    const userId = auth().currentUser.uid;
  
    // Add the token to the users datastore
    await firestore()
      .collection('Users')
      .doc(userId)    
      .update({
        tokens: firestore.FieldValue.arrayUnion(token),
      });
  }

  






function mainScene(props){

    // componentDidMount(){
    //     const {navigation}=this.props
    //     navigation.setOptions({
    //         headerStyle:{
    //             backgroundColor:'#65187A'
    //         },
    //      headerRight: () => (
    //          <View style={{marginRight:13}}>
    //            <MaterialCommunityIcons
    //                name="filter-variant"
    //                color="#fff"
    //                size={35}
    //            />
    //          </View>
          
    //      ),
    //         headerTitle:()=>(
    //                <View>
    //                    <Text style={styles.textStyle}>My Events</Text>
    //                    <TouchableOpacity 
    //                  style={styles.addButton}
    //                  onPress={()=>navigation.navigate('addevent')}
    //                  >
    //                    <Text style={styles.addButtonText}>+</Text>
    //                  </TouchableOpacity>
                       
                     
    //                </View>                 
               
    //         ),
    //          headerLeft: ()=>(
    //             <TouchableOpacity
    //             onPress={()=>navigation.openDrawer()}
    //            style={{marginLeft:13}}>
    //            <Entypo
    //                name="menu"
    //                color="#fff"
    //                size={35}
    //            />
    //            </TouchableOpacity>
    //          )
    //     })
    // }

    const handleEvent=async(link)=>{
      var userId=auth().currentUser.uid
      if(link){
        var a=url.parse(link.url).query.split('&')
        var eventId=a[0].split('=')[1]
        var role=a[1].split('=')[1]
        await firestore().collection("Events").doc(eventId).set({
          members:{
              [userId]:{
                  role:role
              }
          }
      },{
          merge:true
      })
      }
      
    }


    

    
    useEffect(() => {
      var userId=auth().currentUser.uid
      dynamicLinks().onLink(handleEvent)
      dynamicLinks().getInitialLink()
      .then(async(link)=>{
          if(link){
            var a=url.parse(link.url).query.split('&')
            var eventId=a[0].split('=')[1]
            var role=a[1].split('=')[1]
            await firestore().collection("Events").doc(eventId).set({
              members:{
                  [userId]:{
                      role:role
                  }
              }
          },{
              merge:true
          })
          }
      })
        // Get the device token
        messaging()
          .getToken()
          .then(token => {
            return saveTokenToDatabase(token);
          });
          
        // If using other push notification providers (ie Amazon SNS, etc)
        // you may need to get the APNs token instead for iOS:
        // if(Platform.OS == 'ios') { messaging().getAPNSToken().then(token => { return saveTokenToDatabase(token); }); }
    
        // Listen to whether the token changes
        return messaging().onTokenRefresh(token => {
          saveTokenToDatabase(token);
        });
      }, []);



    
      
    
        return(
            
            
            <mainStack.Navigator   initialRouteName="mainclass">
                <mainStack.Screen  name="mainclass" component={mainAuth}/>
                <mainStack.Screen name="addevent" component={AddEventScene}/> 
                <mainStack.Screen  name="overview" component={OverviewScene}/>
                <mainStack.Screen  name="guests" component={AddGuestScene}/>
                <mainStack.Screen  name="display" component={displayQrScene}/>
                <mainStack.Screen name="view" component={TicketScene}/>
                <mainStack.Screen name="invite" component={InviteScene}/>
            </mainStack.Navigator>
        )
    
}





export default mainScene