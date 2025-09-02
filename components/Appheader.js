import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppIcon from '../assets/icon/Appicon'
import { s, vs } from 'react-native-size-matters'
import { is_android } from '../constants/allconstants'

// import 

const Appheader = () => {
  return (
    <View style={styles.container}>
      <AppIcon fill={'#000000ff'}  height={s(35)} width={s(35)}/>
    </View>
  )
}

export default Appheader

const styles = StyleSheet.create({
    container:{
        justifyContent:'center',
        alignItems:'center',
        // paddingVertical:vs(1),
        paddingTop: is_android ? undefined : vs(43),
        

    }
})