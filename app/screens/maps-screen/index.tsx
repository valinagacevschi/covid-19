import React, { useRef, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { createSelector } from 'reselect';
import Immutable from 'seamless-immutable';
import { State, Geo, GeoRecord, Profile } from '../../types';
import { SafeView } from '../../components/shared';
import { Metrics, Fonts } from '../../themes';
import { GeoActions } from '../../redux/geoRedux';
import { Button } from '../../components/button';
import { UK } from '../../config';
import { ProfileActions } from '../../redux/profileRedux';
import { SeriesActions } from '../../redux/seriesRedux';
import { GlobalActions } from '../../redux/globalRedux';
import { NavigationStackScreenProps } from 'react-navigation-stack';

const selectGeo = createSelector<State, Geo, any>(
  state => state.geo,
  ({ payload, fetching }) => ({
    markers: payload ? Immutable.asMutable(payload).map(d => ({ ...d})) : [],
    fetching
  })
);

const selectLocation = createSelector<State, Profile, any>(
  state => state.profile,
  ({ country, location: { lat, lng } }) => ({ 
    lat: lat || 51.48, 
    lng: lng || 0.00,
    delta: getDelta(country)
  })
);

const getDelta = (country) => {
  switch (country) {
    case UK:
      return 0.15;  
    case 'US':
      return 0.25;  
    default:
      return 15;
  }
}

const getSize = (input: number) => {
  switch (true) {
    case (input < 10):
      return 10;
    case (input < 100):
      return 20;
    case (input < 500):
      return 30;
    case (input < 1000):
      return 40;
    case (input < 5000):
      return 50;
    case (input < 10000):
      return 60;
    case (input < 50000):
      return 70;
    case (input < 100000):
      return 100;
    default:
      return 200;
  }
}

const getTitle = (marker: GeoRecord) => {
  const { province, country, area } = marker;
  return (
    area ? area : province ? province : country
  );
}

const getDescription = (marker: GeoRecord) => {
  const { confirmed, recovered, deaths } = marker;
  return (
    `Confirmed: ${confirmed.toLocaleString()}` +
    (recovered ? `\nRecovered: ${recovered.toLocaleString()}` : '') + 
    (deaths ? `\nDeath: ${deaths.toLocaleString()}` : '')
  )
};

export const MapsScreen = (props: NavigationStackScreenProps) => {
  const { markers } = useSelector(selectGeo);
  const { delta, lat: latitude, lng: longitude } = useSelector(selectLocation);
  const markerRefs = useRef([]);
  const dispatch = useDispatch();

  useEffect(() => {
    markerRefs.current = markerRefs.current.slice(0, markers.length);
  }, [markers]);

  const replaceLocation = (params) => {
    dispatch(ProfileActions.update(params));
    dispatch(GlobalActions.currentGet());
    dispatch(SeriesActions.seriesGet());
    props.navigation.navigate('main');
  }

  const pressDefault = (marker, index) => {
    const { country: land, province, area, coords: { latitude: lat, longitude: lng } } = marker;
    const params = { province, area, lat, lng, country: (area ? UK : land) }
    markerRefs.current[index].hideCallout();
    Alert.alert(
      'Location Change',
      `\nYou are about to change your home location to ${getTitle(marker)}. Are you sure ?`,
      [{ 
        text: 'Yes',  
        onPress: () => replaceLocation(params)
      }, { 
        text: 'No' 
      }],  
    );
  }
  
  const handleMapRegionChange = (coords) => { 
    const { longitudeDelta, latitude, longitude, latitudeDelta } = coords;
    const factor = 1.2;
    const southWestPoint = [latitude -  factor * latitudeDelta, longitude - factor * longitudeDelta];
    const northEastPoint = [latitude + factor * latitudeDelta, longitude + factor * longitudeDelta];
    const origin =[latitude, longitude];
    dispatch(GeoActions.geoGet({ southWestPoint, northEastPoint, origin }));
  }

  console.log('rendering GraphScreen');
  return (
    <SafeView wide>
      <MapView 
        provider={PROVIDER_GOOGLE}
        zoomControlEnabled
        zoomEnabled
        zoomTapEnabled
        showsScale
        showsTraffic={false}
        showsUserLocation
        showsMyLocationButton
        loadingEnabled
        followsUserLocation
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: delta,
          longitudeDelta: delta,
        }}
        onRegionChangeComplete={handleMapRegionChange}
        style={styles.mapStyle}
      >
         {(markers || []).map((marker, index) => (
            <Marker 
              ref={el => markerRefs.current[index] = el} 
              key={`${index}`} 
              coordinate={marker.coords}
            >
              <BulletMarker size={getSize(marker.confirmed)} />
              <Callout
                style={{ width: 160 }}
                onPress={() => pressDefault(marker, index) }
              >
                <Title>{getTitle(marker)}</Title>
                <InfoText>{getDescription(marker)}</InfoText>
                <Button 
                  text='Set Location' 
                  onPress={() => pressDefault(marker, index)}
                  textStyle={styles.buttonText} 
                  style={styles.button} 
                />
              </Callout>
            </Marker>
          ))}
      </MapView>
    </SafeView>
  );
}

const BulletMarker = styled.View`
  width: ${props => props.size};
  height: ${props => props.size};
  border: 1px solid #cc0000;
  backgroundColor: #cc000055;
  borderRadius: ${props => props.size};
`;

const Title = styled.Text`
  fontSize: ${Fonts.size.h6};
  textAlign: center;
`;

const InfoText = styled.Text`
  fontSize: ${Fonts.size.small};
  textAlign: center;
`;

const styles = StyleSheet.create({
  mapStyle: {
    top: 0, left: 0, 
    bottom: 0, right: 0,
    width: Metrics.screenWidth,
    height: Metrics.mapHeight,
  },
  callout: {
    flex: 1,
    minWidth: '100%',
    padding: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 10,
    zIndex: 9999999,
  },
  button: { 
    paddingHorizontal: 25, 
    paddingVertical: 5 
  }
});

export default MapsScreen;