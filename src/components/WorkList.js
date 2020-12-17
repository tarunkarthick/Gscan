import React,{Component} from 'react'
import {View,Text,TextInput,TouchableOpacity,Dimensions,ScrollView,TouchableWithoutFeedback} from 'react-native'
import auth from '@react-native-firebase/auth'
import { Avatar } from 'react-native-paper';
import Modal from 'react-native-modal'
import  {connect} from 'react-redux'
import firestore from '@react-native-firebase/firestore'
import { firebase } from '@react-native-firebase/functions';
import Moment from 'moment'

const DEVICE_WIDTH=Dimensions.get("window").width
const DEVICE_HEIGHT=Dimensions.get("window").height

class WorkList extends Component{

    constructor(props){
        super(props)
        this.state={
            visible:false,
        }

        this.props.navigation.addListener('tabPress',()=>{
            this.componentDidMount()
        })
        this.props.navigation.addListener('focus',()=>{
            this.componentDidMount()
        })
       

    }
    
    componentDidMount(){
        
        this.setState({
            visible:false
        })
    }

    LeaveSpace=async(MainRole,item,user)=>{

        this.hideModal()
        this.setState({
            visible:false
        })
        this.props.leaveTrue()
        if(MainRole=='organizer'||user.members[item.key].role=='invited'){
            await firestore().collection('Events').doc(user.key).set({
                members:{
                    [item.key]:firestore.FieldValue.delete()
                }
            },{
                merge:true
            })
        }
        if(MainRole=='administrator'){
            await firestore().collection('Events').doc(user.key).set({
                members:{
                    [item.key]:firestore.FieldValue.delete()
                }
            },{
                merge:true
            })
            

            await firestore().collection('Users').doc(item.key).collection("Notifications").doc().set({
                item:{name:user.name,key:user.key},
                owner:{tokens:item.tokens,},
                type:"leave",
                time:Moment().format('LT'),
                date:Moment().format('L'),
                timestamp: firestore.FieldValue.serverTimestamp(),

            })

            await firebase.functions().httpsCallable('LeaveCall')({
                item:{name:user.name,key:user.key},
                owner:{tokens:item.tokens,},
                type:"leave"
            })
            
           

          
           
        }

        setTimeout(()=>this.props.leaveFalse(),4000)
        
    }

    updateRole=async(Role,item,user)=>{
        this.hideModal()
        this.props.roleTrue()
        await firestore().collection('Events').doc(user.key).set({
            members:{
                [item.key]:{
                    role:Role
                }
            }
        },{
            merge:true
        })
        

        await firestore().collection('Users').doc(item.key).collection("Notifications").doc().set({
            Role:Role,
            item:{name:user.name,key:user.key},
            owner:{tokens:item.tokens,},
            type:"roleChange",
            time:Moment().format('LT'),
            date:Moment().format('L'),
            timestamp: firestore.FieldValue.serverTimestamp()
        })

        await firebase.functions().httpsCallable('RoleCall')({
            item:{name:user.name,key:user.key},
            owner:{tokens:item.tokens,},
            Role:Role,
            type:"roleChange"
        })
        
        setTimeout(()=>this.props.roleFalse(),4000)
       

       
    }

    showModal=(MainRole,userId,key)=>{
      
        if(MainRole=='administrator'||userId==key){
            this.setState({
                visible:true
            })
        }
       
       
    }
    hideModal=()=>{
        this.setState({
            visible:false
        })
    }


    render(){
        const {visible}=this.state
        const {item,user}=this.props
        const userId = auth().currentUser.uid;
        const MainRole=user.members[userId].role
        
        return(
        <View style={{flex:1}}>
        <Modal   
        isVisible={visible}
        deviceWidth={DEVICE_WIDTH}
        deviceHeight={DEVICE_HEIGHT}
        onBackdropPress={()=>this.hideModal()}
        swipeDirection="up"
        onSwipeComplete={() =>this.hideModal()}
        >
            <View style={{flex:1,marginLeft:25,marginRight:25,marginTop:80,marginBottom:60,borderRadius:10,backgroundColor:"#fff"}}>
                <View style={{ flex: 1,justifyContent:"center",alignItems:"center" }}>
                    <Avatar.Text style={{backgroundColor:'#002b80'}}  size={220} label={item.name[0]} />
                    <Text style={{fontSize:20,marginTop:10,fontFamily:"Montserrat-Bold"}}>{item.name}</Text>
                
                </View>
                <View>
                    {MainRole=='administrator'?
                        <View>
                            {item.key==userId||user.members[item.key].role=='invited'||item.key==user.uid?
                                <View/>
                                :
                                <View>
                                    {user.members[item.key].role=='administrator'?
                                        <TouchableOpacity onPress={()=>this.updateRole('organizer',item,user)}><Text style={{alignSelf:"flex-end",bottom:10,padding:10,borderRadius:15,backgroundColor:"#ffba00",color:"#fff",marginRight:10}}>Make as organizer</Text></TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={()=>this.updateRole('administrator',item,user)}><Text style={{alignSelf:"flex-end",bottom:10,padding:10,borderRadius:15,backgroundColor:"#4c9900",color:"#fff",marginRight:10}}>Make as administrator</Text></TouchableOpacity>
                                    }
                                </View>
                            }
                        </View>
                        :
                        <View/>
                    

                    }
                </View>
                {item.key==user.uid?
                <TouchableOpacity onPress={()=>{}}><Text style={{alignSelf:"flex-end",bottom:10,padding:10,borderRadius:15,backgroundColor:"#FF0000",color:"#fff",marginRight:10,marginTop:10}}>Event Creator</Text></TouchableOpacity>
                :
                <TouchableOpacity onPress={()=>this.LeaveSpace(MainRole,item,user)}><Text style={{alignSelf:"flex-end",bottom:10,padding:10,borderRadius:15,backgroundColor:"#FF0000",color:"#fff",marginRight:10,marginTop:10}}>Leave Workspace</Text></TouchableOpacity>

                }
                
            </View>
          
           
        </Modal>

       
        <TouchableWithoutFeedback onPress={()=>this.showModal(MainRole,userId,item.key)} >
    
            
        <View style={styles.action}>
            <View style={{flexDirection:'row'}}>
                    <Avatar.Text style={{backgroundColor:'#002b80'}}  size={45} label={item.name[0]} />
                <View style={styles.box}>
                    <Text style={{fontSize:20}}>{item.name}</Text>
                    <Text style={{fontSize:16,color:'#646c64'}}>{item.email}</Text>
                </View>
            </View>
            {item.role=='administrator'?
            <Text style={{backgroundColor:"#0AC92B",padding:2,fontSize:12,marginRight:5,color:"#fff",borderRadius:10,alignSelf:"center"}}>{item.role}</Text>
            :
            <>
               {item.role=='invited'?
               <Text style={{backgroundColor:"#002b80",padding:4,fontSize:12,marginRight:5,color:"#fff",borderRadius:10,alignSelf:"center"}}>{item.role}</Text> 
               :
               <Text style={{backgroundColor:"#ffba00",padding:2,fontSize:12,marginRight:5,color:"#fff",borderRadius:10,alignSelf:"center"}}>{item.role}</Text> 

               } 
            </> 

            }
        </View>
        </TouchableWithoutFeedback>
    
        
    </View>

        )
    }
}

const styles={
    inviteStyle:{
        padding:10,
        backgroundColor:'#65187A',
        borderRadius:30,
        flexDirection:'row',
        position:'absolute',
        alignSelf:'flex-end',
        bottom:10,
        right:10,
        alignItems:"center",
        justifyContent:"center"
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
    
    
}

function mapStateToProps(state){
   
    return{

        leaveRights:state.leaveRights,
        roleUpdate:state.roleUpdate
    }
}

function mapDispatchToProps(dispatch){
    return{
        roleTrue:()=>dispatch({type:'ROLE_TRUE'}),
        roleFalse:()=>dispatch({type:'ROLE_FALSE'}),
        leaveTrue:()=>dispatch({type:'LEAVE_TRUE'}),
        leaveFalse:()=>dispatch({type:'LEAVE_FALSE'}),
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(WorkList)


// export default WorkList