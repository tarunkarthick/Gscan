import React,{Component} from 'react'
import {View,Text,TextInput,TouchableOpacity,Dimensions,ScrollView} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Hr from "react-native-hr-component"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import  {connect} from 'react-redux'
import { Avatar } from 'react-native-paper';
import Modal from 'react-native-modal'
import * as Animatable from 'react-native-animatable'
import { firebase } from '@react-native-firebase/functions';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from "react-native-share"
import Moment from 'moment'
import * as Progress from 'react-native-progress'






var b=true
var user2=''
const DEVICE_WIDTH=Dimensions.get("window").width

class InviteScene extends Component{

    constructor(props){
        super(props);
        this.state={
            email:'',
            isValidEmail:true,
            user:'',
            isUser:false,
            member:false,
            invited:false,
            visible:false,
            Role:"",
            loading:false
        }
       
    }

    buildLink=async(id,role)=>{

        
        await dynamicLinks().buildShortLink({
          link:`https://guesturescan.page.link/?wID=${id}&role=${role}`,
          // domainUriPrefix is created in your Firebase console
          domainUriPrefix: 'https://guesturescan.page.link',
          // optional set up which updates Firebase analytics campaign
          // "banner". This also needs setting up before hand
          analytics: {
            campaign: 'banner',
          },
          android: {
            packageName: 'com.gscan',
            minimumVersion: '0',
          }
        }).then((link)=>{
            Share.open({
                title:"Guesture Scan",
                message:`Hey!Click this link and join my workspace on Guesture Scan!\n\n${link}`
            })
            
        })
        
      
    //    console.log(url.parse(`https://guesturescan.page.link/workspace?wID=${id}&role=${role}`).query.split('&')[0].split('='))
      }

    

    showModal=(item)=>{
        this.setState({
            visible:true,
        })
    }
    hideModal=()=>{
        this.setState({
            visible:false
        })
    }

    search=()=>{

     
        this.setState({
            user:'',
            isUser:false,
            member:false,
            loading:true
        })
        const {email}=this.state
        const {route}=this.props
        const {item}=route.params
        if(!email){
            this.setState({
                isValidEmail:false
            })
            b=false
        }

        if(b){
           
            firestore().collection('Users').get()
            .then(querySnapshot=>{
                if(querySnapshot){
                    var user1
                    querySnapshot.forEach(documentSnapshot=>{
                        if(documentSnapshot.data().email==email)
                        {
                            user1={
                                ...documentSnapshot.data(),
                                key:documentSnapshot.id
                            }
                          
                        }
                        user2=user1
                        this.setState({
                            user:user1,
                            isUser:true
                        })
                    })
                }

               firestore().collection('Events').doc(item.key).get()
                .then(querySnapshot=>{
                  if(querySnapshot){
                      if(user2)
                      {
                        if(querySnapshot.data().members[user2.key]){
                            if(querySnapshot.data().members[user2.key].role=='invited')
                            {
                                this.setState({
                                    invited:true,
                                    member:true
                                })
                            }
                            else{
                                this.setState({
                                    member:true
                                })
                            }
                        }
                    }

                  }
                    
                    
                })

                this.setState({
                    loading:false
                })

            })
          
        

            
            
               
           

            
            




        }



        
    }

    textChange=(val)=>{
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        
        if(val.trim().length>=6 && reg.test(val)){
            this.setState({
                email:val,
                isValidEmail:true
            })
            b=true
        }
        else{
            this.setState({
                email:val,
                isValidEmail:false
            })  
            b=false         
        }
        
    }

   

    componentDidMount(){
        const {navigation}=this.props
        navigation.setOptions({
            title:"Invite People",
            headerTitleStyle:{
                alignSelf:'center',
                fontSize:23
            },
            headerTintColor:'#fff',
            headerStyle:{
                backgroundColor:'#65187A'
            },
            headerLeft: ()=>(
                <TouchableOpacity
                onPress={()=>this.props.navigation.navigate('overview')}
               style={{marginLeft:13}}>
               <MaterialIcons
                   name="arrow-back"
                   color="#fff"
                   size={30}
               />
               </TouchableOpacity>
             ),
            headerRight: () => (
              <View/>
             
            )
        })
    }

        inviteSet=async(Role,user)=>{

            this.props.inviteTrue()
            this.setState({
                Role:Role
            })
            const {route}=this.props
            const {item}=route.params
            const userId = auth().currentUser.uid;
            this.setState({
                member:true,
                invited:true,
                visible:false
            })

            

            await firestore().collection("Events").doc(item.key).set({
                members:{
                    [user.key]:{
                        role:"invited"
                    }
                }
            },{
                merge:true
            })

           
            
            await firestore()
            .collection('Users')
            .doc(userId)
            .get()
            .then(async(querySnapshot)=>{
                
               if(querySnapshot){
                await firestore().collection('Users').doc(user.key).collection("Notifications").doc().set({
                    Role:Role,
                    item:{name:item.name,key:item.key},
                    owner:{tokens:user.tokens,name:user.name},
                    author:{name:querySnapshot.data().name,tokens:querySnapshot.data().tokens,authId:userId},
                    type:"invite",
                    time:Moment().format('LT'),
                    date:Moment().format('L'),
                    timestamp: firestore.FieldValue.serverTimestamp(),
    
                })

                await firebase.functions().httpsCallable('notifyUser')({
                    Role:Role,
                    item:{name:item.name,key:item.key},
                    owner:{tokens:user.tokens},
                    author:{name:querySnapshot.data().name,tokens:querySnapshot.data().tokens,authId:userId},
                    type:"invite"
    
                })

                setTimeout(()=>this.props.inviteFalse(),4000)
               }

               
    
            })

          

            
          
            
           
              
        
        
        
        
    }

    

    render(){
       const {user,visible}=this.state
       const {route}=this.props
       const {item}=route.params
       
        return(
            <View style={{flex:1,backgroundColor:"#fff"}}>
                <Modal   
                    isVisible={visible}
                    testID={'modal'}
                    >
                    <View style={{backgroundColor:"#fff",borderRadius:10,padding:23}}>
                        <Text style={{fontFamily:"Montserrat-Bold",fontSize:20}}>Send Invite?</Text>      
                        <View style={{alignItems:"flex-end"}}>
                            <TouchableOpacity style={{marginTop:24}} onPress={()=>this.inviteSet("administrator",user)}>
                                <Text style={{backgroundColor:"#4c9900",padding:10,borderRadius:7,color:"#fff"}}>Administrator</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop:15}} onPress={()=>this.inviteSet("organizer",user)}>
                                <Text style={{backgroundColor:"#ffba00",padding:10,borderRadius:7,color:"#fff"}}>Organizer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginTop:13}} onPress={()=>this.hideModal()}>
                                <Text style={{padding:10,color:"#65187A"}}>Cancel</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                        
                        
                </Modal>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{flex:2,alignItems:"center",margin:5}}>
                    <Text style={{fontSize:21,color:'#65187A',padding:2,fontFamily:"Montserrat-Bold"}}>Send a request now</Text>
                    <Text style={{fontSize:19,color:"#65187A",padding:2,fontFamily:"Montserrat-SemiBold"}}>(Recommended)</Text>
                    <Text style={{fontSize:15,textAlign:"center",padding:2,fontFamily:"Montserrat-Medium"}} >If the person is already on Guesture Scan,you can invite them right away.Once they accept your invite they'll become member of this workspace.</Text>
                    <View style={styles.action}>
                        <TextInput
                            placeholder="Enter email address"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={this.state.email}
                            onChangeText={(val)=>this.textChange(val)}  
                        /> 

                        <TouchableOpacity
                            onPress={()=>this.search()}
                        >
                            <MaterialIcons
                            name="search"
                            color="grey"
                            size={25}
                            />
                        </TouchableOpacity>
                    </View>
                    {this.state.loading?
                    <Progress.Bar
                        style={{borderWidth:1,marginTop:20,marginBottom:20,backgroundColor:"#D3D3D3"}}
                        width={DEVICE_WIDTH}
                        height={4}
                        indeterminate={true}
                        
                        borderColor="#D3D3D3"
                        />
                    :
                   <>
                    {this.state.isUser?

                            <View style={{alignSelf:"stretch"}}>
                            {this.state.user?
                           
                            <View style={{alignSelf:"stretch",flexDirection:'row',justifyContent:'space-between',margin:10,padding:5}}>
                             <View style={{flexDirection:'row'}}> 
                               <Avatar.Text style={{backgroundColor:'#002b80'}}  size={30} label={user.name[0]} /> 
                               <Text style={{fontSize:20,marginLeft:10}}>{user.name}</Text>   
                             </View>
                            <View>
                                {!this.state.member?
                                    <TouchableOpacity onPress={()=>this.showModal()}>
                                        <Text  style={{backgroundColor:"#002b80",padding:5,borderRadius:5,color:"#fff",fontSize:16}}>Invite</Text>
                                    </TouchableOpacity>
                                :
                                   <View>
                                       {!this.state.invited?
                                            <TouchableOpacity onPress={()=>{}}>
                                                <Text style={{borderColor:"#002b80",borderWidth:2,padding:5,borderRadius:5,color:"#002b80",fontSize:16}}>Member</Text>
                                            </TouchableOpacity> 
                                        :
                                        <TouchableOpacity onPress={()=>{}}>
                                            <Text style={{borderColor:"#002b80",borderWidth:2,padding:5,borderRadius:5,color:"#002b80",fontSize:16}}>Invited</Text>
                                        </TouchableOpacity>

                                       }
                                    </View>
                                }
                            </View>
                             </View>

                            :
                            
                                <Text style={{alignSelf:"center",margin:20}}>User not found</Text>

                            }
                        </View>


                        :
                        <View style={{alignItems:"center",justifyContent:"center",margin:20}}>
                            {this.state.isValidEmail?
                              <Text style={{fontFamily:"Montserrat-Medium"}}>Type an email address to send an invite</Text>
                        :
                            <Text style={{fontFamily:"Montserrat-Medium"}}>Enter a valid email</Text>
                        
                        }
                        </View>


                    }
                    </>
                    }

                    <Hr  text="OR" textStyles={{textAlign:"center",fontFamily:"Montserrat-Medium"}}/>
                   
                    

                
                </View>
                
                <View style={{flex:2,alignItems:"center"}}>
                    <Text style={{fontSize:21,color:'#65187A',padding:2,fontFamily:"Montserrat-Bold"}}>Invite through link</Text>
                    <Text style={{fontSize:15,textAlign:"center",padding:2,fontFamily:"Montserrat-Medium"}}>Anyone with the link will be able to join your workspace once you accept their request.</Text>
                    <TouchableOpacity
                    style={{marginTop:10,marginLeft:10,marginRight:10,width:DEVICE_WIDTH-120,borderRadius:10,backgroundColor:"#4c9900",flexDirection:"row",padding:10,justifyContent:"center"}}
                    onPress={()=>this.buildLink(item.key,'administrator')}
                    >
                     <MaterialCommunityIcons
                        name="link-variant-plus"
                        color="#fff"
                        size={20}
                        />   
                    <Text style={{color:"#fff",marginLeft:10,fontSize:16}}>Invite as Administrator</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                    style={{marginTop:10,marginLeft:10,marginRight:10,width:DEVICE_WIDTH-120,borderRadius:10,backgroundColor:"#ffba00",flexDirection:"row",padding:10,justifyContent:"center"}}
                    onPress={()=>this.buildLink(item.key,'organizer')}
                    >
                     <MaterialCommunityIcons
                        name="link-variant"
                        color="#fff"
                        size={20}
                        />   
                    <Text style={{color:"#fff",marginLeft:10,fontSize:16}}>Invite as Organizer</Text>
                    </TouchableOpacity>
                </View>
                
                
                </ScrollView>
                <View>
                        {this.props.inviteUser? 
                        <Animatable.View animation="fadeInUpBig" style={styles.viewStyle} >
                    
                        <Text style={{textAlign:"center",color:"#fff",fontSize:14,fontFamily:"Montserrat-Medium",padding:15}}>Invited as {this.state.Role} </Text>
                    
                        </Animatable.View>
                        :
                        null

                        } 

                </View>
            </View>
        )
    }
}


const styles={
    action: {
        flexDirection: 'row',
        margin:10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        fontSize:17,
        paddingLeft: 10,
        color: '#05375a',
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
        inviteUser:state.inviteUser
    }
}

function mapDispatchToProps(dispatch){
    return{
        inviteTrue:()=>dispatch({type:'INVITE_TRUE'}),
        inviteFalse:()=>dispatch({type:'INVITE_FALSE'}),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(InviteScene)