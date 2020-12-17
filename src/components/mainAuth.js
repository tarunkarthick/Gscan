import React, { Component } from 'react'
import {View,Text,TouchableOpacity,FlatList,TouchableWithoutFeedback,StatusBar,Alert,Dimensions,ScrollView,SafeAreaView} from 'react-native'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Avatar, Drawer} from 'react-native-paper'
import Moment from 'moment'
import  {connect} from 'react-redux'
import * as Animatable from 'react-native-animatable'
import Modal from 'react-native-modal'
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import {Spinner} from './Spinner'




const DEVICE_WIDTH=Dimensions.get("window").width
const DEVICE_HEIGHT=Dimensions.get("window").height

class mainAuth extends Component{

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
   
      constructor(props){
          super(props);
          this. state={
            users:[],
            main:[],
            present:false,
            past:false,
            future:false,
            visible:false,
            itemCon:'',
            loading:true
            }
            this.props.navigation.addListener('focus',()=>this.check())
      }

      check(){
          if(this.props.isAuth){
              setTimeout(()=>this.props.authFalse(),4000)
          }
      }

    showModal=(item)=>{
        var userId=auth().currentUser.uid
        if(item.members[userId].role=='administrator'){
            this.setState({
                visible:true,
                itemCon:item
            })
        }
        
    }
    hideModal=()=>{
        this.setState({
            visible:false,
            itemCon:''
        })
    }

    allEvents(){
        this.hideMenu()
        this.setState({
            loading:true
        })
        const {main}=this.state
        if(main[0]){
            this.setState({
                users:main,
                loading:false,               
            })
        }
        else{
            this.setState({
                users:'',
                loading:false,
                present:true,
                past:false,
                future:false
            })
        }
    }

    

    upComing(){
        this.hideMenu()
        const {main}=this.state
        this.setState({
            loading:true
        })
        const upcome=[]
        main.forEach(user=>{
            if(Moment(Moment(new Date()), 'YYYY-MM-DD HH:mm:ss').unix()<=user.createdAt)
            {
                upcome.push(user)
            }
        })

        if(upcome[0]){
            this.setState({
                users:upcome,
                loading:false,
            })
        }
        else{
           this.setState({
               users:'',
               loading:false,
                present:false,
                past:false,
                future:true
           })
        }
    }

    pastComing(){
        this.hideMenu()
        const {main}=this.state
        this.setState({
            loading:true
        })
        const pastcome=[]
        main.forEach(user=>{
            if(Moment(Moment(new Date()), 'YYYY-MM-DD HH:mm:ss').unix()>=user.createdAt){
                pastcome.push(user)
            }
        })

        if(pastcome[0]){
            this.setState({
                users:pastcome,
                loading:false,
            })
        }
        else{
            this.setState({
                 users:'',
                 loading:false,
                 present:false,
                 past:true,
                 future:false
            })
         }
    }

        
   

    componentDidMount(){
        const {navigation}=this.props
        navigation.setOptions({
            headerStyle:{
                backgroundColor:'#65187A'
            },
         headerRight: () => (
            //  <View style={{marginRight:13}}>
            //    <MaterialCommunityIcons
            //        name="filter-variant"
            //        color="#fff"
            //        size={35}
            //    />
            //  </View>
            <View style={{ flex: 1,marginRight:10 }}>
                <Menu
                style={{maxWidth:'auto',maxHeight:"auto"}}
                ref={this.setMenuRef}
                button={ <MaterialCommunityIcons
                        style={{marginTop:10}}
                         onPress={this.showMenu}
                           name="filter-variant"
                           color="#fff"
                           size={35}
                       /> }
                >
                <MenuItem  style={{maxWidth:'auto',padding:5}}  onPress={()=>this.allEvents()}>
                   
                      <View style={{maxWidth:'auto'}}>
                       <Text style={{fontSize:18,marginLeft:5}}>All Events</Text>
                   
                      </View> 
                        
                </MenuItem>

                <MenuItem  style={{maxWidth:'auto',padding:5}} onPress={()=>this.upComing()}>

                    <View style={{maxWidth:'auto'}}>
                      
                       <Text style={{fontSize:18,marginLeft:5}}>Upcoming Events</Text>
                      
                        
                    </View>
                       
                  
                </MenuItem>

                <MenuItem  style={{maxWidth:'auto',padding:5}} onPress={()=>this.pastComing()}>

                    <View style={{maxWidth:'auto'}}>
                      
                       <Text style={{fontSize:18,marginLeft:5}}>Past Events</Text>
                      
                        
                    </View>
                       
                  
                </MenuItem>
                
                </Menu>
            </View>
          
         ),
            headerTitle:()=>(
                   <View>
                       <Text style={styles.textStyle}>My Events</Text>
                       <TouchableOpacity 
                     style={styles.addButton}
                     onPress={()=>navigation.navigate('addevent',{
                         name:"",
                         date:"",
                         location:"",
                         key:""
                     })}
                     >
                       <Text style={styles.addButtonText}>+</Text>
                     </TouchableOpacity>
                       
                     
                   </View>                 
               
            ),
             headerLeft: ()=>(
                <TouchableOpacity
                onPress={()=>navigation.openDrawer()}
               style={{marginLeft:13}}>
               <Entypo
                   name="menu"
                   color="#fff"
                   size={35}
               />
               </TouchableOpacity>
             )
        })
        
        
        var userId=auth().currentUser.uid
        firestore()
        .collection('Events')
        .orderBy('createdAt', 'desc')
        .onSnapshot(querySnapshot=>{
            if(querySnapshot){
            const user=[]

                querySnapshot.forEach(documentSnapshot=>{
                    
                    var authlog=Object.keys(documentSnapshot.data().members)
                   
                    if(authlog.includes(userId))
                    {
                        if(documentSnapshot.data().members[userId].role!='invited'){
                            user.push({
                                ...documentSnapshot.data(),
                                key:documentSnapshot.id
                            })
                        }
                       
                    }
              
                    
                })
                this.setState({
                    users:user,
                    main:user,
                    loading:false,
                    present:true
                })  

            }
         
        })
      
       

    }

    deleteEvent=async(item)=>{
        this.setState({
            loading:true
        })
        this.hideModal()
        const ref=firestore().collection('Events').doc(item.key).collection('Participants')
        await ref.get().then(async(querySnapshot)=>{
                querySnapshot.forEach(DocumentSnapshot=>{
                    ref.doc(DocumentSnapshot.id).delete()
                })

                await firestore().collection('Events').doc(item.key).delete().then(() => {
                    this.setState({
                        loading:false
                    })
                  })
        })
       
    }

      movecontent(item){
          const {navigation}=this.props
          navigation.navigate('overview',{
              item:item
          })
      }


      
    

    

    render(){
        const {navigation}=this.props
        const {users,visible,itemCon}=this.state
        var userId=auth().currentUser.uid
       
       
      
        return(
           
            
            <View style={{flex:1,backgroundColor:'#65187A'}}>
                <StatusBar backgroundColor="#65187A" barStyle="light-content" />
               
                <View style={{flex:1,backgroundColor:"#fff",borderTopLeftRadius: 30,borderTopRightRadius: 30}}>
                
                {this.state.loading?

                <Spinner/>
                :

                    <View style={{flex:1}}>
                    {users[0]?
                    <FlatList
                    data={users}
                    renderItem={({ item }) => (
                    <View style={{flex:1}}>
                        <Modal   
                        isVisible={visible}
                        testID={'modal'}
                        onBackdropPress={()=>this.hideModal()}
                        >
                        <View style={{backgroundColor:"#fff",borderRadius:10,padding:23}}>
                            <Text style={{fontSize:23,marginTop:5,fontFamily:"Montserrat-Bold"}}>{itemCon.name}</Text>
                            <Text style={{fontSize:20,marginTop:10,padding:5}}>Delete or Modify event</Text>
                            <View style={{marginTop:30,flexDirection:"row",justifyContent:"space-around"}}>
                                <Text style={{color:"#fff"}}>hi</Text>
                                <Text style={{color:"#fff"}}>hello</Text>
                                {userId==item.uid?
                                <TouchableOpacity onPress={()=>{this.deleteEvent(item)}}><Text style={{color:"#FF0000",fontSize:18}}>Delete</Text></TouchableOpacity>
                                :
                                <View/>
                                }
                                
                            
                                <TouchableOpacity 
                                onPress={()=>{
                                    this.hideModal()
                                    navigation.navigate('addevent',{
                                    name:itemCon.name,
                                    date:itemCon.date,
                                    location:itemCon.location,
                                    key:item.key
                                })}}
                                ><Text style={{color:"#65187A",fontSize:18}}>Modify</Text></TouchableOpacity>
                                
                            </View>
                        </View>
                            
                            
                        </Modal>
                    
                    <TouchableWithoutFeedback onPress={()=>this.movecontent(item)} onLongPress={()=>this.showModal(item)}>
                        <View style={styles.action}>
                            <View style={{flexDirection:'row'}}>
                            <Avatar.Text style={{backgroundColor:'#002b80'}}  size={45} label={item.name[0]} />
                            <View style={styles.box}>
                                <Text style={{fontSize:20}}>{item.name}</Text>
                                <Text style={{fontSize:16,color:'#646c64'}}>{item.location}</Text>
                            </View>
                            </View>
                            
                            <View style={{flexDirection:"column"}}>
                                <Text style={styles.dateStyle}>{Moment(item.date).format('D MMM')}</Text>
                                {item.members[userId].role=='administrator'?
                                    <Text style={{backgroundColor:"#0AC92B",padding:2,fontSize:12,marginTop:5,marginRight:5,color:"#fff",borderRadius:10,alignSelf:"center"}}>{item.members[userId].role}</Text>
                                    :
                                    <Text style={{backgroundColor:"#ffba00",padding:2,fontSize:12,marginTop:5,marginRight:5,color:"#fff",borderRadius:10,alignSelf:"center"}}>{item.members[userId].role}</Text>
                                }
                                
                            </View>
                                                
                        
                        </View>
                    </TouchableWithoutFeedback>
                    </View>
                                        
                    )}
                    />
                :
                    <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                        {this.state.present?
                            <Text style={{fontSize:18}}>You don't have any events.Start Organizing!</Text>
                        
                        :
                        <View>
                            {this.state.past?
                                <Text style={{fontSize:18}}>You don't have any past events.</Text>
                            :
                            <View>
                                {this.state.future?
                                    <Text style={{fontSize:18}}>You don't have any upcoming events.</Text>
                                :
                                null

                                }
                            </View>

                            }
                        </View>

                        }
                    </View>
                }
                    <View>
                        {this.props.isAuth?
                        <Animatable.View animation="fadeInUpBig" style={styles.viewStyle} >
                    
                        <Text style={{textAlign:"center",color:"#fff",fontSize:14,fontFamily:"Montserrat-Medium"}}>Display Name has been changed....</Text>
                    
                        </Animatable.View>
                        :
                        null

                        }

                    </View>
                   
                
                </View>


                }
                
                </View>      
               
                
            </View>
            
              
        )
    }
    
}

const styles={
    textStyle:{
        top:2,
        fontSize:24,
        fontFamily:'Montserrat-ExtraBold',
        color:'#fff',
        alignSelf:"center"
    },
    addButton:{
        alignSelf:"center",
        backgroundColor:"#FF0000",
        width:50,
        height:50,
        borderRadius:50,
        borderColor:'#ccc',
        alignItems:"center",
        justifyContent:"center",
        elevation:8,
        marginBottom:-20,
        zIndex:10
    },
    addButtonText:{
        color:"#fff",
        fontSize:35
    },
    action: {
        flex:1,
        flexDirection: 'row',
        justifyContent : 'space-between',
        marginLeft:10,
        marginRight:10,
        marginTop:23,
        padding: 5
    },
    box:{
        flexDirection:"column",
        marginLeft:20
    },
    dateStyle:{
        fontSize:17,
        marginRight:18,
        alignSelf:"center"
    },
    viewStyle:{
        backgroundColor:"#003725",
        padding:13,
        justifyContent:"flex-end",
        bottom:0
    }
}


function mapStateToProps(state){
   
    return{
        isAuth:state.isAuth
    }
}

function mapDispatchToProps(dispatch){
    return{
        authTrue:()=>dispatch({type:'AUTH_TRUE'}),
        authFalse:()=>dispatch({type:'AUTH_FALSE'}),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(mainAuth)