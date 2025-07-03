import { StyleSheet, View, TouchableOpacity, Text, Dimensions } from 'react-native'
import React from 'react'
import useColors from '../Utils/Colors'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { Entypo, FontAwesome5 } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

type ColorsType = ReturnType<typeof useColors>

type RootStackParamList = {
  [key: string]: any;
};

const NavBar = () => {

    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const Colors = useColors()
    const styles = DynamicStyles(Colors)

    return (
      <View style={{width, height, position:"absolute", top:0, left:0, right:0, bottom:0, justifyContent:"flex-end"}}>
        <View style={styles.navBarContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('MapScreen')}>
            <FontAwesome5 name="map-marked-alt" size={35} color={Colors.ligthText} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('ChatScreen')}> 
            <Entypo name="chat" size={35} color={Colors.ligthText} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  

  export default NavBar

const DynamicStyles = (Colors: ColorsType) => StyleSheet.create({

  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 10,
    borderTopLeftRadius: 25,
    paddingBottom:20,
    borderTopRightRadius: 25,
    height: 110,
    width: "100%",
  },
})