import React, { Component } from 'react'
import {View,Text,TouchableOpacity,StatusBar,TouchableWithoutFeedback,FlatList,Dimensions} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Avatar } from 'react-native-paper';
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Modal from 'react-native-modal'
import  {connect} from 'react-redux'
import * as Animatable from 'react-native-animatable'
import * as Progress from 'react-native-progress'



import WorkList from './WorkList'


const DEVICE_WIDTH=Dimensions.get("window").width
const DEVICE_HEIGHT=Dimensions.get("window").height


var item1

class Workspace extends Component{


    constructor(props){
        super(props)
        this.state={
            organizers:[],
            //visible:false,
            loading:true,
            item1:''
        }
        this.props.navigation.addListener('tabPress',()=>{
            this.componentDidMount()
        })
        this.props.navigation.addListener('focus',()=>{
            this.componentDidMount()
        })


    }


    invite(){
        const {navigation}=this.props
        const {item}=this.props
        navigation.navigate('invite',{
            item:item
        })
    }

  


    componentDidMount(){
        const {item}=this.props
      this.setState({
          loading:true
      })
       firestore().collection('Events').doc(item.key).onSnapshot(query=>{
           
           item1={
                ...query.data(),
                key:query.id
            }
            firestore().collection('Users').onSnapshot(querySnapshot=>{
                if(querySnapshot){
                const org=[]
                var authlog=Object.keys(query.data().members)
                querySnapshot.forEach(documentSnapshot=>{
                    if(authlog.includes(documentSnapshot.id)) {
                        org.push({
                            ...documentSnapshot.data(),
                            key:documentSnapshot.id,
                            role:query.data().members[documentSnapshot.id].role
                        })
                        
                        }
                    })
                    
                    this.setState({
                        item1:item1,
                        organizers:org,
                        loading:false
                    })
                }
            })
       })   

       
      
       
        
       
       
    }

    



    
    render(){
        const {organizers}=this.state
        const user=item1

        const userId = auth().currentUser.uid;
        return(
           


            <View style={{flex:1,backgroundColor:"#65187A"}}>
                <StatusBar backgroundColor="#65187A" barStyle="light-content" />
                   
                
                    <View style={{flex:1,backgroundColor:'#f2f2f2'}}>
                        {this.state.loading?
                            <Progress.Bar
                            style={{borderWidth:0}}
                            width={DEVICE_WIDTH}
                            height={3}
                            indeterminate={true}
                            />
                            :

                            <View style={{flex:1,backgroundColor:"#65187A"}}>
                                 <View style={{flex:1,backgroundColor:"#f2f2f2",borderTopLeftRadius:30,borderTopRightRadius:30}}>
                                    <FlatList
                                        data={organizers}
                                        renderItem={({item})=>(
                                                <WorkList navigation={this.props.navigation} item={item} user={user} imp={this.props}  />
                                               
                                    )}                 
                                    
                                    />
                                    
                                    {user.members[userId].role=='administrator'?
                                    <TouchableOpacity style={styles.inviteStyle} onPress={()=>this.invite()}>
                                    <MaterialCommunityIcons
                                        name="plus-circle-multiple"
                                        color="#fff"
                                        size={30}
                                    />
                                    <Text style={{marginLeft:5,fontSize:16,fontFamily:"Montserrat-Regular",color:"#fff"}}>Invite People</Text>
                                    </TouchableOpacity>
                                    :
                                    <View/>

                                    }

                                <View>
                                        {this.props.roleUpdate? 
                                        <Animatable.View animation="fadeInUpBig" style={styles.viewStyle} >
                                    
                                        <Text style={{textAlign:"center",color:"#fff",fontSize:14,fontFamily:"Montserrat-Medium",padding:7}}>Role Updated.. </Text>
                                    
                                        </Animatable.View>
                                        :
                                        null

                                        } 
                                        {this.props.leaveRights?
                                        <Animatable.View animation="fadeInUpBig" style={styles.viewStyle} >
                                    
                                        <Text style={{textAlign:"center",color:"#fff",fontSize:14,fontFamily:"Montserrat-Medium",padding:7}}>Removed from workspace.. </Text>
                                    
                                        </Animatable.View>
                                        :
                                        null

                                        }

                                </View>
                                    
                                </View>
                               
                                        
                            </View>

        
                        }


                    
                      
                        
                    </View>    

               

                                           
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
        alignSelf:'flex-end',
        bottom:20,
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
    viewStyle:{
        backgroundColor:"#003725",
        padding:13,
        justifyContent:"flex-end",
        bottom:0
    }
    
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


export default connect(mapStateToProps,mapDispatchToProps)(Workspace)