import { StatusBar } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchLocation, setSearchLocation] = useState(null);

  useEffect(() => {
    getLocationAsync();
  }, []);

  const getLocationAsync = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('A permissão para acessar o local foi negada');
      return;
    }

    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  };

  const handleSearch = async () => {
    const geocode = await Location.geocodeAsync(searchText);
    if (geocode.length > 0) {
      setSearchLocation({
        latitude: geocode[0].latitude,
        longitude: geocode[0].longitude,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {location && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Minha Localização"
            />
          )}
          {searchLocation && (
            <Marker
              coordinate={{
                latitude: searchLocation.latitude,
                longitude: searchLocation.longitude,
              }}
              title="Local Pesquisado"
            />
          )}
        </MapView>
      ) : (
        <Text>Carregando...</Text>
      )}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Pesquisar local"
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Pesquisar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 40,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 20,
    paddingHorizontal: 10,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchButton: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    margin: 5,
    marginLeft: 10,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
