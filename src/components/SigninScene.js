import React, { Component } from 'react'
import {View,Text,Button,TouchableOpacity,Dimensions,TextInput,Platform,StatusBar,Alert,ScrollView} from 'react-native'
import  {connect} from 'react-redux'
import * as Animatable from 'react-native-animatable'
import auth from '@react-native-firebase/auth'
import LinearGradient  from 'react-native-linear-gradient'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import {Spinner} from './Spinner'





var a=true
var b=true
class SigninScene extends Component{
    constructor(props){
        super(props)
        this.state={
            email:'',
            Password:'',
            check_texInputChange:false,
            SecureTextEntry:true,
            isValidUser:true,
            isValidPassword:true,
            loading:false,
           
        }
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
            loading:false
        })
    }

    onButton(){  
        const {navigation}=this.props
        const {email,Password}=this.state
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
       if(a && b){
        this.setState({loading:true})
        auth().signInWithEmailAndPassword(email,Password)
        .then(()=>{
            this.setState({loading:false,finish:true})

        })
        .catch((error)=>{
            if (error.code === 'auth/invalid-email') {
                Alert.alert(
                    "Invalid Email",
                    'Email Address not Registered!',[
                        {
                            text:"Ok",
                            onPress:()=>{this.onState()}
                        }
                    ],
                    {cancelable:false}
                    )
                }
                if (error.code === 'auth/wrong-password') {
                    Alert.alert(
                        "Wrong Password",
                        'Password is not matching!',[
                            {
                                text:"Ok",
                                onPress:()=>{this.onState()}
                            }
                        ],
                        {cancelable:false}
                        )
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
                    <ScrollView showsVerticalScrollIndicator={false}>

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
                            style={styles.textInput}
                            value={this.state.Password}
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
                   
                    

                    <View style={styles.button}>
                    {this.state.loading?<Spinner size="small"/>:
                        <TouchableOpacity
                        style={styles.signIn}
                        onPress={()=>this.onButton()}
                    >
                        <LinearGradient
                        colors={['#940094','#bb00bb']}
                        style={styles.signIn}
                    >
                        <Text style={[styles.textSign,{
                            color:"#fff"
                        }]}>Sign In</Text>
                    </LinearGradient>
                </TouchableOpacity>

                    }

                        <TouchableOpacity
                            onPress={()=>navigation.navigate('signup')}
                            style={[styles.signIn,{
                                borderColor:'#65187A',
                                borderWidth:1,
                                marginTop:15
                            }]}
                        >
                            <Text style={[styles.textSign,{
                                color:'#006666'
                            }]}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    </ScrollView>
                </Animatable.View>
               
            </View>
        )
    }
}

export default SigninScene

const styles={
    container: {
        flex: 1, 
        backgroundColor: '#65187A'
      },
      header: {
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: 20,
          paddingBottom: 30
      },
      footer: {
          flex:3,
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
          textAlign:"center"
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
          marginTop: 50
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

// function mapStateToProps(state){
   
//     return{
//         isAuth:state.isAuth,
//         Loading:state.Loading,
//     }
// }

// function mapDispatchToProps(dispatch){
//     return{
//         LoadTrue:()=>dispatch({type:'LOAD_TRUE'}),
//         LoadFalse:()=>dispatch({type:'LOAD_FALSE'}),
//     }
// }

// export default connect(mapStateToProps,mapDispatchToProps)(SigninScene)

