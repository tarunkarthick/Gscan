
import React, { Component } from 'react'
import {View,Text,Button,TouchableOpacity,Dimensions,TextInput,Platform,StatusBar, Alert,ScrollView} from 'react-native'
import * as Animatable from 'react-native-animatable'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore' 
import LinearGradient  from 'react-native-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import {Spinner} from './Spinner'



var a=true
var b=true
var c=true

class SignupScene extends Component{
        state={
            name:'',
            email:'',
            Password:'',
            check_texInputChange:false,
            SecureTextEntry:true,
            isValidUser:true,
            isValidPassword:true,
            isname:true,
            loading:false
        }
        

    onState=()=>{
        this.setState({
            name:'',
            email:'',
            Password:'',
            check_texInputChange:false,
            SecureTextEntry:true,
            isValidUser:true,
            isValidPassword:true,
            isname:true,
            loading:false
        })
    }

    onButtonPress(){  
        const {navigation}=this.props
        const {email,Password,name}=this.state
        if(!email){
            this.setState({
                isValidUser:false
            })
            a=false
        }
        else if(!Password){
            this.setState({
                isValidPassword:false
            })
            b=false
        }
        else if(!name){
            this.setState({
                isname:false
            })
            c=false
        }

       if(a && b && c){
        this.setState({loading:true})
        auth().createUserWithEmailAndPassword(email,Password)
        .then((data)=>{
            userId=data.user.uid
            firestore().collection("Users").doc(userId).set({
                name:name,
                email:email
            })
            
            this.setState({loading:false})

         })
        .catch((error)=>{
            if (error.code === 'auth/email-already-in-use') {
                Alert.alert(
                    "Email In Use",
                    'That email address is already in use!',[
                    {
                        text:"Ok",
                        onPress:()=>{this.onState()}
                    }
                ],
                {cancelable:false}
                )
          }
      
          if (error.code === 'auth/invalid-email') {
            console.log('That email address is invalid!');
          }
        })
        
    }
    
    
        
    }

    

    textInputChange=(val)=>{
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(val.trim().length>=6 && reg.test(val)){
            this.setState({
                email:val,
                check_texInputChange:true,
                isValidUser:true
            })
            a=true
        }
        else{
            this.setState({
                email:val,
                check_texInputChange:false,
                isValidUser:false
            })  
            a=false        
        }
        
    }

    handlename(val){
        if(val.trim().length>=6){
            this.setState({
                name:val,
                isname:true
            })
            c=true
        }
        else{
            this.setState({
                name:val,
                isname:false
            })
            c=false
        }

    }
    handlePasswordChange=(val)=>{
        if(val.trim().length>=6){
            this.setState({
                Password:val,
                isValidPassword:true
                
            })
            b=true
        }
        else{
            this.setState({
                Password:val,
                isValidPassword:false
                
            })
            b=false
        }
    }

    handleValidUser=(val)=>{
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if(val.trim().length>=6 && reg.test(val)){
            this.setState({
                isValidUser:true
            })
        }
        else{
            this.setState({
                isValidUser:false
            })
        }
    }

    updateSecureTextEntry=()=>{
        this.setState({
            SecureTextEntry:!this.state.SecureTextEntry
        })
    }

    render(){
        const {navigation}=this.props


        return(
            <View style={styles.container}>
                <StatusBar backgroundColor="#65187A" barStyle="light-content" />
                <View style={styles.header}>
                    <Text style={styles.text_header}>Guesture Scan</Text>
                </View>





                <Animatable.View 
                animation="fadeInUpBig"
                style={styles.footer}
                >
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    >
                    <Text style={styles.text_footer}>Email</Text>
                    <View style={styles.action}>
                        <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Email"
                            style={styles.textInput}
                            autoCapitalize="none"
                            value={this.state.email}
                            onChangeText={(val)=>this.textInputChange(val)}
                            onEndEditing={(e)=>this.handleValidUser(e.nativeEvent.text)}
                        />
                        {this.state.check_texInputChange?
                        <Animatable.View
                            animation="bounceIn"
                        >
                            <Feather
                            name="check-circle"
                            color="green"
                            size={20}
                        />
                        </Animatable.View>
                        
                        :null}
                    </View>
                    {this.state.isValidUser?null:
                        <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Valid Email required</Text>
                        </Animatable.View>
                    }



                    <Text style={[styles.text_footer,{
                        marginTop:35
                    }]}>Password</Text>
                    <View style={styles.action}>
                        <Feather
                            name="lock"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Your Password"
                            secureTextEntry={this.state.SecureTextEntry?true:false}
                            value={this.state.Password}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val)=>this.handlePasswordChange(val)}
                        />
                        <TouchableOpacity onPress={()=>this.updateSecureTextEntry()}>
                        {this.state.SecureTextEntry?
                        <Feather
                        name="eye-off"
                        color="grey"
                        size={20}
                         />
                         :
                         <Feather
                         name="eye"
                         color="grey"
                         size={20}
                          />
                        }
                        
                        </TouchableOpacity>
                        
                    </View>
                    {this.state.isValidPassword?null:
                     <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Password must be 6 characters long.</Text>
                     </Animatable.View>

                    }



                    
                    <Text style={[styles.text_footer,{
                        marginTop:35
                    }]}>Full Name</Text>
                    <View style={styles.action}>
                    <FontAwesome
                            name="user-o"
                            color="#05375a"
                            size={20}
                        />
                        <TextInput
                            placeholder="Full Name"
                            value={this.state.name}
                            style={styles.textInput}
                            autoCapitalize="none"
                            onChangeText={(val)=>this.handlename(val)}
                            
                        />
                        
                    </View>

                    {this.state.isname?null:
                     <Animatable.View animation="fadeInLeft" duration={500}>
                        <Text style={styles.errorMsg}>Full Name must be 6 characters long.</Text>
                     </Animatable.View>

                    }

                    <View style={styles.button}>
                       {this.state.loading?<Spinner size="small"/>:
                        <TouchableOpacity
                        style={styles.signIn}
                        onPress={()=>this.onButtonPress()}
                    >
                        <LinearGradient
                        colors={['#940094','#bb00bb']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign,{
                            color:"#fff"
                        }]}>Sign Up</Text>
                    </LinearGradient>

                    </TouchableOpacity>

                       }
                        

                       
                        <TouchableOpacity
                            onPress={()=>navigation.goBack()}
                            style={[styles.signIn,{
                                borderColor:'#65187A',
                                borderWidth:1,
                                marginTop:10
                            }]}
                        >
                            <Text style={[styles.textSign,{
                                color:'#006666'
                            }]}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </Animatable.View>
            </View>
        )
    }
}

export default SignupScene

const styles={
    container: {
        flex: 1, 
        backgroundColor: '#65187A'
      },
      header: {
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
          paddingBottom: 10
      },
      footer: {
          flex: 4.5,
          backgroundColor: '#fff',
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingHorizontal: 20,
          paddingVertical: 30
      },
      text_header: {
          color: '#fff',
          fontFamily:"Pacifico-Regular",
          fontSize: 40,
          textAlign:"center",
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
      actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
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
      button: {
          alignItems: 'center',
          marginTop: 30
      },
      signIn: {
          width: '100%',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10
      },
      textSign: {
          fontSize: 18,
          fontWeight: 'bold'
      }
}

