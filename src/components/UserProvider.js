import React, { Component, createContext,useState ,useEffect} from "react";



import auth from '@react-native-firebase/auth'

export const UserContext = createContext({});

export const UserProvider=({children})=>{
    const user=false

    return (
      <UserContext.Provider value={{user}}>
        {children}
      </UserContext.Provider>
    );
}



