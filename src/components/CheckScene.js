import React, { Component } from 'react'
import {View,Text,TouchableOpacity,Linking,TextInput,ScrollView} from 'react-native'
import * as Animatable from 'react-native-animatable'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {IconButton} from 'react-native-paper'
import firestore from '@react-native-firebase/firestore'
import * as Progress from 'react-native-progress'




var a=true
var b=true

var pro=0
var count=0
class CheckScene extends Component{


    constructor(props){
        super(props);
        this.state={
            Id:'',
            isValidId:true,
            userIn:false,
            checkuser:'',
            progressnum: 0,
            indeterminate: true,
        }

        this.props.navigation.addListener('focus',()=>{
            this.usercheck()
        })

       this.props.navigation.addListener('tabPress',()=>{
            this.componentDidMount()
        })
    }

    usercheck(){
        const {checkinuser,item}=this.props

       
       
        if(checkinuser){
            if(!checkinuser.checkin){

                this.setState({
                    checkuser:checkinuser,
                    userIn:true
                })
                
            }
        }
    }

    
    componentDidMount(){

        const {item}=this.props

        

        this.setState({
           progressnum:0,
           indeterminate:true
        })
       
        this.animate()

        this.setState({
            Id:'',
            isValidId:true,
        })
        
    }

    animate=() =>{
        
        const {checkinuser,item}=this.props


        firestore().collection('Events').doc(item.key).collection('Participants')
        .get()
        .then(querySnapshot=>{
            count=querySnapshot.size



            firestore().collection('Events').doc(item.key).collection('Participants').where('checkin','==',true)
            .get()
            .then(querySnapshot=>{
                pro=querySnapshot.size
                var p=0
                if(count==0 && pro==0){
                    p=0
                }
                else{
                    p=pro/parseFloat(count)
                   
                }
               
        
                if(p==0){
                    this.setState({
                        progressnum:0,
                        indeterminate: false
                    })
                }
                else{
                    let progress = 0;
                    
                    this.setState({ progressnum:progress });
                    setTimeout(() => {
                    this.setState({ indeterminate: false });
                    setInterval(() => {
                        progress += 0.05;
                        
                        if (progress >p) {
                       
                        progress = p;
                        }
                    this.setState({ progressnum:progress });
                }, 500);
                }, 1500);
                }

            }) 
        })

       

      

             
        
      }
    

    

    textChange=(val)=>{
        if(val.trim().length==10){
            this.setState({
                Id:val,
                isValidId:true
            })
            a=true
        }
        else{
          this.setState({
            Id:val,
            isValidId:false
          })
          a=false
        }
    }

    scanTicket(){
        const {navigation,item}=this.props
        navigation.navigate('display',{
            item:item
        })
    }


    change=()=>{

        const {item}=this.props
        const {checkuser}=this.state

        firestore().collection('Events').doc(item.key).collection('Participants').doc(checkuser.key).update({
            checkin:true
        })
        .then(() => {
            this.setState({
                progressnum:0,
                indeterminate:true
             })
            
            this.animate()
            this.setState({
                Id:'',
                isValidId:true,
                userIn:false,
                check:false,
                indeterminate: true,
                progressnum:0
            })
          })
       
       
       
       
       


        
    }

    manual=()=>{
        const {navigation,item,checkinuser}=this.props
        var user=item.key
        const {Id}=this.state
        if(!Id){
            this.setState({
                isValidId:false
            })
            a=false
        }

        if(a){
            var check
            console.log('e')
             firestore().collection('Events').doc(user).collection('Participants')
             .onSnapshot(querySnapshot=>{
                 if(querySnapshot){
                querySnapshot.forEach(documentSnapshot=>{
                    
                    if(Id.toString()==documentSnapshot.data().qrnum){
                        check={
                            ...documentSnapshot.data(),
                            key:documentSnapshot.id
                        }        

                        
                    }
                    
                })
                if(check){
                    this.setState({
                        checkuser:check,
                        userIn:true
                    })
                   
                   
                    
                
                }
                else{
                    this.setState({
                        Id:'',
                        isValidId:false
                    })
                }
               
            }
                
               
            })         
        

        }


    }
    
    render(){
        const {navigation,checkinuser,item}=this.props
        const {userIn,checkuser}=this.state
       
        return(
           <View style={{flex:1,backgroundColor:"#fff"}}>
             
               <View style={styles.progressStyle}>
                   
               <ScrollView  showsVerticalScrollIndicator={false}
                   contentContainerStyle={{justifyContent:"center",alignItems:"center",flexGrow:2}}
                   >
               <Progress.Circle
                style={{marginTop:10,marginBottom:2}}
                    progress={this.state.progressnum}
                    indeterminate={this.state.indeterminate}
                    showsText={true}
                    size={150}
                    thickness={5}
                />
                <Text style={{fontFamily:"Montserrat-SemiBold",marginBottom:5,marginTop:5}}>Percentage of guests checked-In</Text>
                </ScrollView>
               </View>
              
               
               {userIn?
                <View style={styles.containerStyle}>
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    >
                    <View style={{flexDirection:'row',padding:10}}>
                        <IconButton size={26} style={{backgroundColor:"#000072"}} color="#fff" icon="account"/> 
                        <View style={{flexDirection:'column',marginLeft:10}}>
                            <Text style={{fontSize:20}}>{checkuser.name}</Text>
                            <Text style={{fontSize:16,color:'#646c64'}}>{checkuser.gender}</Text>
                        </View>
                    </View>


                    <View style={{flexDirection:'row',padding:10}}>
                        <IconButton size={26} style={{backgroundColor:"#000072"}} color="#fff" icon="school"/> 
                        <View style={{flexDirection:'column',marginLeft:10}}>
                            <Text style={{fontSize:20}}>{checkuser.organization}</Text>
                            <Text style={{fontSize:16,color:'#646c64'}}>Organization</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:'row',padding:10}}>
                        <IconButton size={26} style={{backgroundColor:"#000072"}} color="#fff" icon="phone"/> 
                        <View style={{flexDirection:'column',marginLeft:10}}>
                            <Text style={{fontSize:20}}>{checkuser.mobile}</Text>
                            <Text style={{fontSize:16,color:'#646c64'}}>Mobile No.</Text>
                        </View>
                    </View>

                    <View style={{flexDirection:'row',padding:10}}>
                        <IconButton size={26} style={{backgroundColor:"#000072"}} color="#fff" icon="email"/> 
                        <View style={{flexDirection:'column',marginLeft:10}}>
                            <Text style={{fontSize:20}}>{checkuser.email}</Text>
                            <Text style={{fontSize:16,color:'#646c64'}}>Email ID</Text>
                        </View>
                    </View>

                    <View style={{borderRadius:10,borderWidth:3,padding:5,alignSelf:"center"}}>
                        <Text style={{fontSize:25}}>PERMIT</Text>
                    </View>



                    <View style={{alignItems:"center",justifyContent:"center",marginTop:10,marginBottom:20}}>

                    <TouchableOpacity
                     onPress={()=>this.change()}
                     style={[styles.scanIn,{
                        backgroundColor:"#ffba00",
                         marginTop:10,
                         marginRight:10
                     }]}
                    >
                        <MaterialIcons
                        name="arrow-back"
                        color="#fff"
                        size={20}
                        />
                        <Text style={{color:"#fff",marginLeft:10,fontSize:16}}>Go Back</Text>

                    </TouchableOpacity>
                    </View>





                    </ScrollView>

                </View>




                :


                <View style={styles.containerStyle}>
                    <Text style={{textAlign:"center",fontSize:16}}>Scan Tickets/Manual Check-In</Text>
                    <View style={styles.action}>
                        <FontAwesome
                        name="user"
                        color="#dc143c"
                        size={20}
                        />
                         <TextInput
                            placeholder="Enter Participant ID(10 Characters)"
                            keyboardType='numeric'
                            style={styles.textInput}
                            value={this.state.Id}  
                            onChangeText={(val)=>this.textChange(val)}                      
                        /> 
                    
                    </View>
                    {this.state.isValidId?null:
                        <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Enter Valid participant ID to check-In</Text>
                        </Animatable.View>             
                        }

                    <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                    <TouchableOpacity
                     onPress={()=>this.scanTicket()}
                     style={[styles.scanIn,{
                        backgroundColor:"#4c9900",
                         marginTop:10,
                         marginLeft:10
                     }]}
                    >
                        <MaterialCommunityIcons
                        name="camera-enhance"
                        color="#fff"
                        size={20}
                        />
                        <Text style={{color:"#fff",marginLeft:10,fontSize:16}}>Scan Ticket</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                     onPress={()=>this.manual()}
                     style={[styles.scanIn,{
                        backgroundColor:"#ffba00",
                         marginTop:10,
                         marginRight:10
                     }]}
                    >
                        <MaterialCommunityIcons
                        name="pen"
                        color="#fff"
                        size={20}
                        />
                        <Text style={{color:"#fff",marginLeft:10,fontSize:16}}>Manual</Text>

                    </TouchableOpacity>
                    </View>
                  
                   
               </View>


               }
             
           </View>
        )
    }

}

const styles={
    progressStyle:{
        flex:2
    },
    containerStyle:{
        flex:3,        
        marginLeft:12,
        marginRight:12,
        borderWidth:2,
        borderColor:"#000",
        backgroundColor:"#e5e5e5"
    },
    action: {
        flexDirection: 'row',
        margin: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        fontSize:17,
        paddingLeft: 10,
        color:'#000'
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        marginLeft:12
    },
    scanIn: {
        flexDirection:"row",
        width:130,
        padding:7,
        justifyContent:"center"
      
    },
}


export default CheckScene