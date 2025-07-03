import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import useColors from '../Utils/Colors';

const { width, height } = Dimensions.get('window');

export type RootStackParamList = {
  MapScreen: undefined;
  SpotDetail: { spot: FishingSpot };
};

type MapScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MapScreen'>;

// Interfaz para los spots de pesca
interface FishingSpot {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  image: string;
  description: string;
}

const fishingSpots: FishingSpot[] = [
  {
    id: 1,
    name: 'Lago Escondido',
    latitude: 37.78825,
    image: 'https://assets.simpleviewinc.com/simpleview/image/fetch/c_fill,q_75/https://res.cloudinary.com/simpleview/image/upload/v1458686382/clients/houston/6947714322_e92242200a_o_d_ce8c683e-89ec-4780-ab18-b32e638472eb.jpg',
    longitude: -122.4324,
    description: 'Un lago tranquilo rodeado de naturaleza.',
  },
  {
    id: 2,
    name: 'Río Cristalino',
    latitude: 37.79025,
    image: 'https://previews.123rf.com/images/haigala/haigala2006/haigala200600027/149661694-fishing-spot-with-wooden-gangway-on-the-river-on-a-summer-day.jpg',
    longitude: -122.4304,
    description: 'Perfecto para pescar truchas en aguas claras.',
  },
  {
    id: 3,
    name: 'Muelle del Sol',
    image: 'https://byjoandco.com/wp-content/uploads/2021/08/Best-Fishing-Spots-on-Lake-Conroe.jpg',
    latitude: 37.79225,
    longitude: -122.4284,
    description: 'Un muelle con hermosas vistas al atardecer.',
  },
];

type ColorsType = ReturnType<typeof useColors>;

interface MapScreenProps {
  navigation: MapScreenNavigationProp;
}

export default function MapScreen({ navigation }: MapScreenProps) {
  const Colors = useColors();
  const styles = DynamicStyles(Colors);
  const [selectedSpot, setSelectedSpot] = useState<FishingSpot | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [focusedSpotId, setFocusedSpotId] = useState<number | null>(null);
  const mapRef = useRef<MapView>(null);

  const handleCardPress = (spot: FishingSpot) => {
    setFocusedSpotId(spot.id);
    mapRef.current?.animateToRegion({
      latitude: spot.latitude,
      longitude: spot.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    }, 800);
  };

  const handleMarkerPress = (spot: FishingSpot) => {
    setSelectedSpot(spot);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {fishingSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            pinColor={focusedSpotId === spot.id ? Colors.errorRed : Colors.mainGreen}
            onPress={() => handleMarkerPress(spot)}
          >
            <View style={[styles.labelContainer, focusedSpotId === spot.id && styles.labelContainerFocused]}>
              <Text style={styles.labelText}>{spot.name}</Text>
            </View>
          </Marker>
        ))}
      </MapView>
      <View style={styles.cardsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle=
        {styles.cardsScrollContent}>
          <View style={{height:120, alignItems:"center", flexDirection:"row"}}>
            {fishingSpots.map((spot) => (
              <TouchableOpacity
                key={spot.id}
                style={[styles.spotCard, focusedSpotId === spot.id && styles.spotCardFocused]}
                onPress={() => handleCardPress(spot)}
                activeOpacity={0.8}
              >
                <Image source={{ uri: spot.image }} style={styles.spotImage} />
                <View style={styles.spotInfo}>
                  <Text style={styles.spotName}>{spot.name}</Text>
                  <Text style={styles.spotDesc} numberOfLines={2}>{spot.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image source={{ uri: selectedSpot?.image }} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{selectedSpot?.name}</Text>
            <Text style={styles.modalDesc}>{selectedSpot?.description}</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                if (selectedSpot) {
                  navigation.navigate('SpotDetail', { spot: selectedSpot });
                }
              }}
            >
              <Text style={styles.modalButtonText}>Ver más información</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={{ color: Colors.label, marginTop: 10 }}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const DynamicStyles = (Colors: ColorsType) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    width,
    height,
    
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  labelContainer: {
    backgroundColor: Colors.label,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 4,
    alignSelf: 'center',
  },
  labelContainerFocused: {
    backgroundColor: Colors.errorRed,
  },
  labelText: {
    color: Colors.antiText,
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardsContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.background2,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  cardsScrollContent: {
    paddingHorizontal: 12,
    marginBottom: height * 0.1,
  },
  spotCard: {
    width: width * 0.6,
    backgroundColor: Colors.ligthBackground,
    borderRadius: 12,
    marginHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    elevation: 2,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  spotCardFocused: {
    borderColor: Colors.background,
    borderWidth: 2,
  },
  spotImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  spotInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  spotName: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.text,
    marginBottom: 2,
  },
  spotDesc: {
    fontSize: 12,
    color: Colors.ligthText,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    width,
    height,
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalImage: {
    width: 220,
    height: 120,
    borderRadius: 10,
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.text,
  },
  modalDesc: {
    fontSize: 15,
    color: Colors.ligthText,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: Colors.sendButton,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalButtonText: {
    color: Colors.sendButtonText,
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 