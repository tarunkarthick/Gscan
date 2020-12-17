import React, { Component } from 'react'
import {View,Text,TouchableOpacity,TextInput,ScrollView} from 'react-native'
import * as Animatable from 'react-native-animatable'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
import Octicons from 'react-native-vector-icons/Octicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import SwitchSelector from 'react-native-switch-selector'

var a=true
var b=true
var c=true
var d=true


class AddGuestScene extends Component{

    state={
        name:'',
        email:'',
        organization:'',
        mobile:'',
        gender:'male',
        isValidName:true,
        isValidEmail:true,
        isValidOrganization:true,
        isValidNo:true
    }



    componentDidMount(){
        const {navigation}=this.props
       
      
        navigation.setOptions({
           title:"New Reservation",
           headerTitleStyle:{
               alignSelf:'center',
               fontSize:23
           },
           headerTintColor:'#fff',
           headerStyle:{
               backgroundColor:'#65187A'
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

      organizationChange=(val)=>{
        if(val.trim().length>=4){
            this.setState({
                organization:val,
                isValidOrganization:true
            })
            c=true
        }
        else{
          this.setState({
            organization:val,
            isValidOrganization:false
          })
          c=false
        }
    }

    check=()=>{
        const {navigation,route}=this.props
        const {item}=route.params
        const {name,email,organization,mobile,gender}=this.state
        if(!name){
            this.setState({
                isValidName:false
            })
            a=false
        }
        else if(!email){
            this.setState({
                isValidEmail:false
            })
            b=false
        }
        else if(!organization){
            this.setState({
                isValidOrganization:false
            })
            c=false
        }
        else if(!mobile){
            this.setState({
                isValidNo:false
            })
            d=false
        }

        if(a && b && c && d){
            var qrnum=Math.floor(1000000000 + Math.random() * 9000000000).toString()
            var userId=auth().currentUser.uid
            var eventId=item.key
            var checkin=false
            firestore().collection("Events").doc(eventId).collection('Participants').doc().set({
                name:name,
                email:email,
                organization:organization,
                mobile:mobile,
                gender:gender,
                qrnum:qrnum,
                checkin:checkin
            })

            var detail={name,email,organization,mobile,gender,qrnum,checkin}
            navigation.navigate('view',{
                item:detail,
                detail:item
            })
           
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

    phoneChange=(val)=>{
        const reg=/^[6-9]\d{9}$/
        if(reg.test(val)){
            this.setState({
                mobile:val,
                isValidNo:true
            })
            d=true
        }
        else{
            this.setState({
                mobile:val,
                isValidNo:false
            })  
            d=false         
        }
        
    }

    render(){

        return(
            <View style={styles.container}>
            <View style={styles.footer}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            >
               <Text style={styles.text_footer}>Full Name</Text>
               <View style={styles.action}>
                   <FontAwesome
                    name="user"
                    color="#dc143c"
                    size={20}
                   />
                   <TextInput
                        placeholder="Name"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={this.state.name}
                        onChangeText={(val)=>this.textInputChange(val)}
                   />

               </View>
               {this.state.isValidName?null:
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Name is short! (Min 6 chars)</Text>
                    </Animatable.View>             
               }


               <Text style={[styles.text_footer,{
                   marginTop:35
               }]}>Email ID</Text>
               <View style={styles.action}>
                   <MaterialCommunityIcons
                    name="email"
                    color="#dc143c"
                    size={20}
                   />

                   
                   <TextInput
                        placeholder="Email"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={this.state.email}
                        onChangeText={(val)=>this.textChange(val)}
                        
                   /> 
                

               </View>
               {this.state.isValidEmail?null:
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Valid email should be entered!!</Text>
                    </Animatable.View>             
               }





               <Text style={[styles.text_footer,{
                   marginTop:35
               }]}>Organization</Text>
               <View style={styles.action}>
                   <MaterialCommunityIcons
                    name="office-building"
                    color="#dc143c"
                    size={20}
                   />
                   <TextInput
                        placeholder="Classification"
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={this.state.organization}
                        onChangeText={(val)=>this.organizationChange(val)}                        
                   />

               </View>
               {this.state.isValidOrganization?null:
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}>Organization is short! (Min 4 chars)</Text>
                    </Animatable.View>             
               }


                <Text style={[styles.text_footer,{
                   marginTop:35
               }]}>Mobile Number</Text>
               <View style={styles.action}>
                   <MaterialIcons
                    name="call"
                    color="#dc143c"
                    size={20}
                   />
                   <TextInput
                        placeholder="Phone no"
                        keyboardType='numeric'
                        style={styles.textInput}
                        autoCapitalize="none"
                        value={this.state.mobile}
                        onChangeText={(val)=>this.phoneChange(val)}                        
                   />

               </View>
               {this.state.isValidNo?null:
                    <Animatable.View animation="fadeInLeft" duration={500}>
                    <Text style={styles.errorMsg}> Valid Mobile no. required</Text>
                    </Animatable.View>             
               }

                <SwitchSelector
                    initial={1}
                    onPress={value => this.setState({ gender: value })}
                    textColor="#800080"
                    selectedColor="#fff"
                    buttonColor="#800080"
                    borderColor="#800080"
                    hasPadding
                    height={40}
                    style={{width:200,alignSelf:"center",marginTop:20}}
                    options={[
                        { label: "Female", value: "female"},
                        { label: "Male", value: "male" } 
                    ]}
                />

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

export default AddGuestScene