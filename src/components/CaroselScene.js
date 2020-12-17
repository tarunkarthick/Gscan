import React, { Component, createRef } from 'react'
import {View,ScrollView,Dimensions,Text,TouchableOpacity} from 'react-native'
import Image from 'react-native-scalable-image'



const DEVICE_WIDTH=Dimensions.get("window").width
const DEVICE_HEIGHT=Dimensions.get("window").height
const images=[
    {
        type:1,
        carousel:require("../images/carousel1.jpg"),
        tag:"Organize events,concerts and workshops!",
        description:"Manage your workspace with ease by providing access controls to Event administrators & organizers."
    },
    {
        type:2,
        carousel:require("../images/carousel2.jpg"),
        tag:"Event Scheduling",
        description:"Manage all your events in one place.Schedule your calendar in advance and proceed with ease."
    },
    {
        type:3,
        carousel:require("../images/carousel3.jpg"),
        tag:"Check-In Guests",
        description:"Generate QR based tickets and share them right away to your guests.On the event day,check-in the guests either by scanning the tickets or manually entering their unique ID."
    },
    {
        type:4,
        carousel:require("../images/carousel4.jpg"),
        tag:"Collaborate & Conquer",
        description:"Invite your colleagues to join your workspace by sharing the invite link or send a request right away."
    }
]


class CarouselScene extends Component{
    scrollRef=createRef()
    state={
            selectedIndex:0
        }
   
    renderelements(image,i){
        return(
            <View key={image.type} width={Dimensions.get("window").width}>
                <Image
                width={Dimensions.get("window").width}
                source={image.carousel}
                />
                <Text style={styles.Topstyle}>{image.tag}</Text>
                <Text style={styles.middleStyle}>{image.description}</Text>                   
                
            </View>
        )
    }
    setSelectedIndex=event=>{
        const viewSize=event.nativeEvent.layoutMeasurement.width
        const contentOffset=event.nativeEvent.contentOffset.x

        const selectedIndex=Math.floor(contentOffset/viewSize)
        this.setState({selectedIndex})
    }
    render(){
        const {selectedIndex}=this.state
        const {navigation}=this.props
        return(
            <View style={styles.ContainerStyle}>
                <TouchableOpacity style={styles.highlightStyle} onPress={()=>navigation.navigate('signin')}>
                    <Text style={styles.signStyle}>Sign In</Text>
                </TouchableOpacity>  
                             
               <Text style={styles.textStyle}>Guesture Scan</Text>
               <ScrollView horizontal
               showsHorizontalScrollIndicator={false}
                pagingEnabled 
                onMomentumScrollEnd={this.setSelectedIndex}
                contentContainerStyle={{flexGrow:1}}>
                   {images.map((image,i)=>{
                        return this.renderelements(image,i)
                   })}
               </ScrollView>
               <View width={Dimensions.get("window").width} style={styles.outerStyle}>
                   {images.map((image,i)=>(
                       <View
                        key={i}
                        style={[styles.innerStyle,{opacity:i===selectedIndex?1:0.5}]}
                       />
                   ))
                   }
               </View>
            </View>
        )
    }
}

const styles={
    ContainerStyle:{
       flex:1,
       backgroundColor:'#FFFFFF'
    },
    highlightStyle:{
        marginLeft:Dimensions.get("window").width-120
    },
    signStyle:{
        marginRight:15,
        marginTop:5,
        fontSize:25,
        color:"#ff0000",
        fontFamily:"Montserrat-SemiBold",
        textAlign:"right"
    },
    textStyle:{
        marginTop:30,
        textAlign:"center",
        fontSize:50,
        fontFamily:"Pacifico-Regular",
        color:"#65187A"
    },
    Topstyle:{
        textAlign:"center",
        fontFamily:"Montserrat-ExtraBold",
        color:"red",
        fontSize:20
    },
    middleStyle:{
        marginTop:10,
        marginLeft:3,
        marginRight:3,
        textAlign:"center",
        fontFamily:"Montserrat-Bold",
        fontSize:15,
        color:"#0000ff"
    },
    outerStyle:{
        bottom:20,
        height:10,
        display:"flex",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center"
    },
    innerStyle:{
        width:20,
        height:6,
        borderRadius:5,
        margin:8,
        marginBottom:20,
        backgroundColor:"#65187A"
    }

}

export default CarouselScene