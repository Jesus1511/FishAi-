import { AntDesign } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import React, { useState } from 'react'
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import useColors from '../Utils/Colors'

const { width } = Dimensions.get('window')

type ColorsType = ReturnType<typeof useColors>;

type SpotType = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  image: string;
  description: string;
};

const PlaceDetails = ({ route }: any) => {
  const { spot } = route.params as { spot: SpotType }
  const navigation = useNavigation()
  const Colors = useColors()
  const styles = DynamicStyles(Colors)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <AntDesign name="arrowleft" size={28} color={Colors.text} />
        </TouchableOpacity>

      </View>
      <Image source={{ uri: spot.image }} style={styles.image} />
      <Text style={styles.title}>{spot.name}</Text>
      <Text style={styles.description}>{spot.description}</Text>
      <View style={styles.locationRow}>
        <AntDesign name="enviromento" size={20} color={Colors.mainGreen} style={{ marginRight: 6 }} />
        <Text style={styles.locationText}>Lat: {spot.latitude.toFixed(5)} | Lng: {spot.longitude.toFixed(5)}</Text>
      </View>
    </View>
  )
}

export default PlaceDetails

const DynamicStyles = (Colors: ColorsType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: Colors.ligthBackground,
  },
  favoriteButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: Colors.ligthBackground,
  },
  image: {
    width: width * 0.85,
    height: 180,
    borderRadius: 16,
    marginBottom: 18,
    marginTop: 8,
    backgroundColor: Colors.background2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.ligthText,
    marginBottom: 18,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.ligthBackground,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  locationText: {
    color: Colors.text,
    fontSize: 15,
  },
})