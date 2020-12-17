import React,{Component} from 'react'
import {View,Text,TouchableOpacity,ScrollView} from 'react-native'
import * as Animatable from 'react-native-animatable'
import firestore from '@react-native-firebase/firestore'

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import  {connect} from 'react-redux'
import {Avatar,Caption,TextInput,Title} from 'react-native-paper'






var c=true

class MyProfileScene extends Component{

   constructor(props){
       super(props);
        this.state={
            name:'',
            isname:true
        }
        this.props.navigation.addListener('focus',()=>{
            this.componentDidMount()
        })

   }

   updateName(){
        const {name}=this.state
        const {item,navigation}=this.props
        if(c){
            firestore().collection('Users').doc(item.key).update({
                name:name
            })
            .then(()=>{
                this.props.authTrue()
                navigation.goBack()
            })
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


    componentDidMount(){
        c=true
        const {navigation,item}=this.props
        navigation.setOptions({
            title:"My Profile",
            headerTitleStyle:{
                alignSelf:"center",
                fontSize:23
            },
            headerTintColor:"#fff",
            headerStyle:{
                backgroundColor:'#800080'
            },
            headerLeft: ()=>(
                <TouchableOpacity
                onPress={()=>this.props.navigation.goBack()}
               style={{marginLeft:13}}>
               <MaterialIcons
                   name="arrow-back"
                   color="#fff"
                   size={30}
               />
               </TouchableOpacity>
             ),
             headerRight: ()=>(
                <View>
                </View>
             )
        })
        this.setState({
            name:item.name,
            isname:true
        })
    }

    render(){
        const {item}=this.props
        return(
            <View style={{flex:1,backgroundColor:"#fff"}}>
                <ScrollView showsVerticalScrollIndicator={false}>
                {item?
                    <View style={{flex:1,marginTop:30}}> 
                        <Avatar.Text style={{backgroundColor:'#002b80',alignSelf:"center"}}  size={130} label={item.name[0]} />
                        <View style={{marginTop:10,justifyContent:"center",alignItems:"center"}}>
                            <Title style={styles.title}>{item.name}</Title>
                            <Caption style={styles.caption}>{item.email}</Caption>
                        </View>
                
                        <View style={styles.action}>
                            <View>
                            <Text style={{fontSize:16,color:"#002b80",fontFamily:"Montserrat-Bold",marginTop:12}}>Update Display Name</Text>
                            </View>
                            
                            <View>
                                <TextInput
                                        
                                        placeholder="Your Name  "
                                        style={styles.textInput}
                                        autoCapitalize="none"
                                        value={this.state.name}
                                        onChangeText={(val)=>this.handlename(val)}
                                />
                                {this.state.isname?null:
                                <Animatable.View animation="fadeInLeft" duration={500}>
                                    <Text style={styles.errorMsg}>Name is short..</Text>
                                </Animatable.View>

                                }
                            </View>
                            
                        </View>


                        <TouchableOpacity
                            onPress={()=>this.updateName()}
                            style={[styles.scanIn,{
                                backgroundColor:"#ffba00",
                                marginTop:10,
                                marginRight:10
                            }]}
                            >
                                <MaterialCommunityIcons
                                name="update"
                                color="#fff"
                                size={28}
                                />
                                <Text style={{color:"#fff",marginLeft:10,fontSize:16,marginTop:3}}>Update</Text>

                        </TouchableOpacity>

                       
                    </View>
                :
                    null
                }
                </ScrollView>
               
            </View>
        )
    }
}

const styles={
    action: {
        padding:10,
        flexDirection: 'row',
        marginTop: 20,
        justifyContent:"space-around",
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
      },
      caption: {
        fontSize: 14,
        lineHeight: 14,
      },
      textInput: {
        flex: 1,
        backgroundColor:"#fff",
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        fontSize:17,
        paddingLeft: 10,
        color: '#05375a',
       width:150
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
    },
    scanIn: {
        flexDirection:"row",
        width:130,
        padding:8,
        alignSelf:"center",
        borderRadius:10
      
    }
}


function mapStateToProps(state){
   
    return{
        isAuth:state.isAuth
    }
}

function mapDispatchToProps(dispatch){
    return{
        authTrue:()=>dispatch({type:'AUTH_TRUE'}),
        authFalse:()=>dispatch({type:'AUTH_FALSE'}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(MyProfileScene)