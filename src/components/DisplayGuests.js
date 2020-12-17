import React, { Component } from 'react'
import {View,Text,TouchableOpacity,Alert,Linking} from 'react-native'
import {Avatar} from 'react-native-paper'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import firestore from '@react-native-firebase/firestore'
import { useNavigation } from '@react-navigation/native';


class DisplayGuests extends Component{
    
    constructor(props){
        super(props);
        this.state={
            extend:false,
            color:'#ff4500'
        }

        this.props.navigation.addListener('tabPress',()=>{
            this.componentDidMount()
        })
        this.props.navigation.addListener('focus',()=>{
            this.componentDidMount()
        })
    }

   
    componentDidMount(){
        const {item}=this.props
        if(item.checkin){
            this.setState({
                color:"#0AC92B"
            })
        }
        this.setState({
            extend:false
        })
    }
    
    deleteUsers(){
        const {item,detail}=this.props
        firestore().collection('Events').doc(detail.key).collection('Participants').doc(item.key).delete().then(() => {
            console.log('User deleted!');
          })
    }

    deleteUser(){      
        
        Alert.alert(
            "Confirm Delete Guest",
            'The guest and all dependant data will be deleted.',[
                {
                    text:"Confirm",
                    onPress:()=>{this.deleteUsers()}
                },
                {
                    text:"Go Back",
                    onPress:()=>{},

                }
            ],
            {cancelable:false}
            )

       
    }
   

    extendDetail=(extend)=>{
        if(extend){
            this.setState({
                extend:false
            })
        }
        else{
            this.setState({
                extend:true
            })
        }
        
    }
    makePhone(telphone){
        Linking.openURL(`tel:${telphone}`)
    }


    render(){
        const {item,detail}=this.props
        const {extend,color}=this.state
        
        return(
            <View style={styles.sequence} >
            <TouchableOpacity  onPress={()=>this.extendDetail(extend)} style={styles.action}>
                <Avatar.Text style={{backgroundColor:color}}  size={40} label={item.name[0]} />
                <View style={styles.box}>
                    <Text ellipsizeMode="tail" numberOfLines={1}  style={{fontSize:18,width:120}}>{item.name}</Text>
                    <Text style={{fontSize:16,color:'#646c64'}}>{item.organization}</Text>
                </View>
                <View style={{marginTop:5}}>
                
                <MaterialIcons 
                onPress={()=>this.makePhone(item.mobile)}
                name="call"
                color="#002b80"
                size={30}
                />
                
                </View>                       
            </TouchableOpacity>
            {this.state.extend?
                <View>
                    <View style={styles.action}>
                    <FontAwesome
                    name="user"
                    color="#8000ff"
                    size={20}
                    />
                    <Text style={{fontSize:18}}>{item.qrnum}</Text>
                    </View>
                    <View style={styles.action}>
                    <MaterialCommunityIcons
                    name="email"
                    color="#464dff"
                    size={20}
                    />
                    <Text style={{fontSize:18}}>{item.email}</Text>
                    </View>
                    <View style={styles.action}>
                    <MaterialIcons
                        name="call"
                        color="#002b80"
                        size={30}
                    />
                    <Text style={{fontSize:18}}>{item.mobile}</Text>
                    </View>
                    <View style={styles.action}>
                    <FontAwesome
                        name={item.gender}
                        color="#dc143c"
                        size={30}
                    />
                    <Text style={{fontSize:18}}>{item.gender}</Text>
                    </View>

                    <TouchableOpacity
                    onPress={()=>this.props.navigation.navigate('view',{
                        item:item,
                        detail:detail
                    })}
                     style={[styles.ticketIn,{
                        backgroundColor:"#0198E1",
                         marginTop:10,
                         marginLeft:10,
                         marginRight:10
                     }]}
                    >
                        <FontAwesome
                        name="user"
                        color="#dc143c"
                        size={23}
                        />
                        <Text style={{color:"#fff",marginLeft:10,fontSize:16}}>View Ticket</Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                    onPress={()=>this.deleteUser()}
                     style={[styles.ticketIn,{
                        backgroundColor:"#ff4500",
                         marginTop:10,
                         marginLeft:10,
                         marginRight:10
                     }]}
                    >
                        <MaterialCommunityIcons
                        name="delete"
                        color="#fff"
                        size={23}
                        />
                        <Text style={{color:"#fff",marginLeft:10,fontSize:16}}>Remove Guest</Text>

                    </TouchableOpacity>

                </View>
                    
               
                : null
                }

            </View>
       
        )
    }


}

const styles={
    action: {
        flex:1,
        flexDirection: 'row',
        justifyContent : 'space-between',     
       
    },
    sequence:{
        marginTop:23,
        marginLeft:10,
        marginRight:10,
        padding: 5,
        borderRadius:8,
        borderWidth:2,
        borderColor:"#fff",
        backgroundColor:"#fff"
    },
    box:{
        flexDirection:"column",
    },
    dateStyle:{
        marginRight:18
    },
    ticketIn: {
        flexDirection:"row",
        padding:7,
        justifyContent:"center"
    },
}


export default DisplayGuests