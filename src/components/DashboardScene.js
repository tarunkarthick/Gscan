import React, { Component } from 'react'
import {View,Text,ScrollView} from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Moment from 'moment'
import firestore from '@react-native-firebase/firestore'


var pro=0
var count=0
class DashboardScene extends Component{

   constructor(props){
       super(props)
       this. state={
        personCount:0,
        checkedStatus:0,
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
                        personCount:count,
                        checkedStatus:0
                    })
                }
                else{
                    this.setState({
                        personCount:count,
                        checkedStatus:p
                    })

                }
               
            })
        })
   
    }

    render(){
        const {item}=this.props
        var date=Moment()
        var end=Moment(item.date)
        var duration = Moment.duration(end.diff(date));
        var hours
        var Days
        if(Math.floor(duration.asHours())>=0)
        {
            hours=Math.floor(duration.asHours())
        }
        else{
            hours=0
        }
        return(
            <View style={{flex:1,backgroundColor:"#fff"}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.topstyle}>
                    {hours==0?
                        <Text style={styles.EventStyle}>This event has been completed</Text>
                        :
                        null
                    }
                    
                    <Text style={styles.textStyle}>Event OverView</Text>
                    <View style={{backgroundColor:"#eeeeee"}}>
                        <View style={styles.boxStyle}>
                        <Entypo
                            name="calendar"
                            color="#dc143c"
                            size={28}
                        />
                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontSize:17}}>Staring Date</Text>
                            <Text style={{fontSize:16,color:"#646c64",textAlign:"center"}}>{Moment(item.date).format('D MMM')}</Text>
                        </View>
                        <Text style={{fontSize:15}}>{Moment(item.date).startOf('day').fromNow()}</Text>
                        

                        </View>



                        <View style={styles.boxStyle}>
                            <MaterialCommunityIcons
                            name="update"
                            color="green"
                            size={28}
                            />
                            <View style={{flexDirection:"column"}}>
                                <Text style={{fontSize:17}}>Staring Time</Text>
                                <Text style={{fontSize:16,color:"#646c64",textAlign:"center"}}>{Moment(item.date).format('h:mm A')}</Text>
                            </View>
                            <View style={{flexDirection:"column"}}>
                                <Text style={{fontSize:15,alignSelf:"center"}}>{hours}</Text>
                                <Text style={{fontSize:15}}>Hours to go</Text>
                            </View>

                        </View>

                        <View style={styles.boxStyle}>
                        <Ionicons
                            name="location"
                            color="#800080"
                            size={28}
                         />
                        <View style={{flexDirection:"column"}}>
                            <Text style={{fontSize:17}}>Location</Text>
                            <Text style={{fontSize:16,color:"#646c64",textAlign:"center"}}>{item.location}</Text>
                        </View>
                        <View>
                            <Text style={{color:"#fff",fontSize:15}}>{item.location}</Text>
                        </View>

                        </View>
                    </View>

                    <View style={{margin:10,marginTop:30,borderRadius:10,borderWidth:10,borderColor:"#0000b3",padding:20}}>
                            <View style={{flexDirection:"row",justifyContent:"space-around"}}>
                                <MaterialIcons
                                    name="people"
                                    size={40}
                                />
                                <MaterialIcons
                                name="person-pin"
                                size={40}
                                />
                                
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-around"}}>
                                <Text style={{fontSize:30,fontFamily:"Montserrat-SemiBold"}}>{this.state.personCount}</Text>
                                <Text style={{fontSize:30,fontFamily:"Montserrat-SemiBold"}}>{this.state.checkedStatus}</Text>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-around"}}>
                                <Text style={{fontSize:15}}>No.of Guests</Text>
                                <Text style={{fontSize:15}}>Reservations</Text>
                            </View>
                    </View>

                    
                </View>
                
                </ScrollView>
                
            </View>
        )
    }
}

const styles={
    topstyle:{
        flex:1,
        backgroundColor:"#fff",
        marginLeft:10,
        marginRight:10,
        marginTop:10
    },
    textStyle:{
        textAlign:"center",
        borderRadius:5,
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:"#002b80",
        color:"#fff",
        fontSize:18

    },
    EventStyle:{
        textAlign:"center",
        borderRadius:5,       
        paddingTop:5,
        paddingBottom:5,
        backgroundColor:"#FF0000",
        color:"#fff",
        fontSize:17

    },
    boxStyle:{
        flexDirection:"row",
        justifyContent:"space-between",
        padding:10,
        borderRadius:5,
        backgroundColor:"#fff",
        margin:5

    }
}

export default DashboardScene