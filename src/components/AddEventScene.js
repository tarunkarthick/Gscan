import React, { Component } from 'react'
import {View,Text,Button,TextInput, Keyboard,TouchableOpacity} from 'react-native'
import * as Animatable from 'react-native-animatable'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Octicons from 'react-native-vector-icons/Octicons'
import Moment from 'moment'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { ScrollView } from 'react-native-gesture-handler'

var a=true
var b=true
var c=true
class addEventScene extends Component{

   constructor(props){
       super(props)
       this. state={
        name:this.props.route.params.name,
        date:this.props.route.params.date,
        location:this.props.route.params.location,
        key:this.props.route.params.key,
        isValidName:true,
        islocation:true,
        isValidDate:true,
        loading:true,
        setDatePickerVisibility:false
    }
   }
    showDatePicker = () => {
        Keyboard.dismiss()
        this.setState({
            setDatePickerVisibility:true
        })
      };
     
    hideDatePicker = () => {
        this.setState({
            setDatePickerVisibility:false
        })
      };
     
    handleConfirm = (date) => {
       
       this.setState({
           date:date.toUTCString(),
           isValidDate:true
       })
       b=true
        this.hideDatePicker();
      };

    componentDidMount(){
      const {navigation}=this.props
      navigation.setOptions({
         title:"Add a new event",
         headerTitleStyle:{
             alignSelf:'center',
             fontSize:23
         },
         headerTintColor:'#fff',
         headerStyle:{
             backgroundColor:'#800080'
         },
          headerRight: () => (
              <TouchableOpacity 
              onPress={()=>this.check()}
              style={{marginRight:13}}>
                <Octicons
                    name="check"
                    color="#fff"
                    size={35}
                />
              </TouchableOpacity>
           
          )
      })
    }

    check=()=>{
        const {navigation}=this.props
        const {name,date,location}=this.state
        if(!name){
            this.setState({
                isValidName:false
            })
            a=false
        }
        else if(!date){
            this.setState({
                isValidDate:false
            })
            b=false
        }
        else if(!location){
            this.setState({
                islocation:false
            })
            c=false
        }

        if(a && b && c){
            var userId=auth().currentUser.uid
            if(this.state.key){
                firestore().collection("Events").doc(this.state.key).set({
                    name:name,
                    date:date,
                    createdAt:Moment(Moment(date), 'YYYY-MM-DD HH:mm:ss').unix(),
                    location:location,
                    uid:userId,
                    members:{
                        [userId]:{
                            role:"administrator"
                        }
                    }
                },{
                    merge:true
                })
            }
            else{
                firestore().collection("Events").doc().set({
                    name:name,
                    date:date,
                    location:location,
                    createdAt:Moment(Moment(date), 'YYYY-MM-DD HH:mm:ss').unix(),
                    uid:userId,
                    timestamp: firestore.FieldValue.serverTimestamp(),
                    members:{
                        [userId]:{
                            role:"administrator"
                        }
                    }
                })
            }
            navigation.goBack()
        }
    }

    textInputChange=(val)=>{
        if(val.trim().length>=6){
            this.setState({
                name:val,
                isValidName:true
            })
            a=true
        }
        else{
          this.setState({
            name:val,
            isValidName:false
          })
          a=false
        }
    }


    locationChange=(val)=>{
        if(val.trim().length>=6){
            this.setState({
                location:val,
                islocation:true
            })
            c=true
        }
        else{
          this.setState({
            location:val,
            islocation:false
          })
          c=false
        }    
    }



    
    
    render(){     
        return(
            <View style={styles.container}>
            <View style={styles.footer}>
                <ScrollView
                showsVerticalScrollIndicator={false}
                >
               <Text style={styles.text_footer}>Name of the event</Text>
               <View style={styles.action}>
                   <MaterialCommunityIcons
                    name="pen"
                    color="#dc143c"
                    size={20}
                   />
                   <TextInput
                        placeholder="Event Name"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={this.state.name}
                        onChangeText={(val)=>this.textInputChange(val)}
                   />

               </View>
               {this.state.isValidName?null:
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Event name is short! (Min 6 chars)</Text>
                    </Animatable.View>             
               }


               <Text style={[styles.text_footer,{
                   marginTop:35
               }]}>Date and Time</Text>
               <View style={styles.action}>
                   <Entypo
                    name="calendar"
                    color="#dc143c"
                    size={20}
                   />

                   
                   <TextInput
                        onFocus={()=>this.showDatePicker()}
                        placeholder="Starting Date and Time"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={this.state.date}                        
                   /> 
                   {this.state.date?
                   <MaterialCommunityIcons
                   name="update"
                   color="grey"
                   size={25}
                   />
               
               :null}               
            
                  
                   <DateTimePickerModal
                    isVisible={this.state.setDatePickerVisibility}
                    mode={"datetime"}
                    onConfirm={(date)=>this.handleConfirm(date)}
                    onCancel={()=>this.hideDatePicker()}
                    />

               </View>
               {this.state.isValidDate?null:
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Date should be selected!!</Text>
                    </Animatable.View>             
               }





               <Text style={[styles.text_footer,{
                   marginTop:35
               }]}>Location</Text>
               <View style={styles.action}>
                   <Ionicons
                    name="location"
                    color="#dc143c"
                    size={20}
                   />
                   <TextInput
                        placeholder="Venue of the event"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={this.state.location}
                        onChangeText={(val)=>this.locationChange(val)}                        
                   />

               </View>
               {this.state.islocation?null:
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Location is short! (Min 6 chars)</Text>
                    </Animatable.View>             
               }

               </ScrollView>
           </View>
        </View>
           
        )
    }
}

const styles={
    container:{
        flex:1,
        backgroundColor:'#65187A'
    },
    footer:{
        flex:1,
        backgroundColor:'#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
       
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    text_footer: {
        color: '#05375a',
        fontSize: 18
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
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
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
}


export default addEventScene