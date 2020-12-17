import React, { Component, useReducer } from 'react'
import {View,Text,StatusBar,FlatList,TouchableOpacity} from 'react-native'
import {IconButton} from 'react-native-paper'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import DisplayGuests from './DisplayGuests'
import {Spinner} from './Spinner'


class GuestScene extends Component{

    constructor(props){
        super(props);
        this.state={
            participants:[],
            loading:true
        }

        this.props.navigation.addListener('tabPress',()=>{
            this.componentDidMount()
        })

        this.props.navigation.addListener('focus',()=>{
           this.componentDidMount()
        })

    }
    


    componentDidMount(){ 
           const {navigation}=this.props
            const {user}=this.props
            var eventId=user.key
            firestore().collection('Events').doc(eventId).collection('Participants')
            .onSnapshot(querySnapshot=>{
                if(querySnapshot){
                const participant=[]
               
                querySnapshot.forEach(documentSnapshot=>{
                   
                    participant.push({
                        ...documentSnapshot.data(),
                        key:documentSnapshot.id
                    })
                   
                })
            
            
            this.setState({
                participants:participant,
                loading:false
            })
        }
      
        })
        

      
       
    }





    moveContent(){
        const {navigation,user}=this.props
        navigation.navigate('guests',{
            item:user
        })
    }





    render(){
        const {user}=this.props
        const {participants}=this.state
        return(
            <View style={{flex:1,backgroundColor:"#f2f2f2"}}>
                <StatusBar backgroundColor="#65187A" barStyle="light-content" />
                   {this.state.loading?
                        <Spinner/>
                   :
                   <View style={{flex:1,backgroundColor:'#f2f2f2',borderTopLeftRadius: 30,borderTopRightRadius: 30,marginBottom:15}}>
                        {participants[0]?
                                <FlatList
                                data={participants}
                                extraData={this.state}
                                renderItem={({item})=>(
                                    <DisplayGuests navigation={this.props.navigation} item={item} detail={user} />

                                )}                       
                                />
                        :
                                <View style={{flex:1,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={{fontSize:17}}>There are no reservations for this event.</Text>
                                </View>

                        }
                        <IconButton onPress={()=>this.moveContent()}  size={35} style={{backgroundColor:"#000072",alignSelf:"center",bottom:10,position:"absolute"}} color="#fff" icon="account-plus"/> 
                  
                   
                    </View>           

                   }
            </View>
            
        )
    }
}


export default GuestScene