import React, { useState, useCallback } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { Container } from './Container';
import { StatusBar } from 'expo-status-bar';
import { theme } from './theme'
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { ScrollView } from 'react-native';
import { fetchLocations } from 'api/weather';
import { debounce } from 'lodash';
import { Location } from 'interfaces/api'

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const HomeScreen = ({ title, path, children }: ScreenContentProps) => {
  const [showSearch, toggleShowSearch] = useState(false);
  const [cityQuery, setCityQuery] = useState<string>("")
  const [location, setLocation] = useState<Location>();
  const [forecast, setForecast] = useState([1, 2, 3, 4, 5]);
  const [locationsSuggestions, setLocationsSuggestions] = useState<Location[]>([])

  const handleLocationSelection = (loc: Location) => {
    console.log("Chose locatipn:", loc)
    setLocationsSuggestions([])
    setLocation(loc)
  }
  const onSearch = (query: string) => {
    if (query.length === 0) {
      return null
    }
    fetchLocations({ query }).then(data => {
      console.log("locs from query", query, data);
      setLocationsSuggestions(data as Location[])
    });
  }
  const onSearchDebounce = useCallback(debounce(onSearch, 300), []);
  return (
    <View className="flex-1 relative" >
      <StatusBar style="light" />
      <Image source={require("../assets/images/home-bg.jpg")}
        className="absolute h-full w-full" blurRadius={60} />
      <Container>
        { /* search section */}
        <View style={{ height: "15%" }} className='mx-6 pt-4 relative z-50'>
          <View className={'flex-row justify-end items-center rounded-lg'}
            style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}>
            {
              showSearch ?
                <TextInput
                  placeholder="What's your city?"
                  placeholderTextColor={'lightgray'}
                  onChangeText={onSearchDebounce}
                  className='pl-6 h-12 flex-1 text-base text-white' />
                : null
            }
            <TouchableOpacity
              onPressOut={() => toggleShowSearch(!showSearch)}
              style={{ backgroundColor: theme.bgWhite(0.3) }}
              className='rounded-full p-3 m-1'
            >
              <MagnifyingGlassIcon size="25" color="white" />
            </TouchableOpacity>
          </View>
          {
            locationsSuggestions.length > 0 && showSearch ? (
              <View className="absolute w-full bg-gray-300 top-20 rounded-3xl">
                {
                  locationsSuggestions.map((location, index) => {
                    let showBorder = index + 1 != locationsSuggestions.length;
                    let borderClass = showBorder ? 'border-b-2 border-b-gray-400' : '';
                    return (
                      <TouchableOpacity
                        key={index}
                        className={"flex-row items-center border-0 p-3 px-4 mb-1 " + borderClass}
                        onPress={() => handleLocationSelection(location)}>
                        <MapPinIcon size="20" color="gray" />
                        <Text className='text-black text-lg ml-2'>{location.name}, </Text>
                        <Text className='text-gray-500 text-lg'>{location.country}</Text>
                      </TouchableOpacity>
                    )
                  }
                  )}
              </View>
            )
              : null}

        </View >
        { /* forecast section */}
        <View className="mx-4 flex justify-around flex-1 mb-2">
          { /*Location*/}
          <Text className='text-white text-center text-2xl font-bold'>
            London,
            <Text className='text-lg font-semibold text-gray-300'>
              {" United Kingdom"}
            </Text>
          </Text>
          { /* weather image */}
          <View className='flex-row justify-center'>
            <Image
              source={require('../assets/images/partlycloudy.png')}
              className='w-52 h-52'
            />
          </View>
          { /* degree celcius */}
          <View className='space-y-2'>
            <Text className="text-center font-bold text-white text-6xl ml-5">
              32
            </Text>

            <Text className="text-center text-white text-xl tracking-widest">
              Partly Cloudy
            </Text>
          </View>
          { /*other stats*/}
          <View className='flex-row justify-between mx-4'>
            <View className='flex-row space-x-2 items-center'>
              <Image source={require('../assets/icons/wind.png')} className='h-6 w-6' />
              <Text className="text-white font-semibold text-base pl-2"> 22km</Text>
            </View>
            <View className='flex-row space-x-2 items-center'>
              <Image source={require('../assets/icons/drop.png')} className='h-6 w-6' />
              <Text className="text-white font-semibold text-base pl-2">23%</Text>
            </View>
            <View className='flex-row space-x-2 items-center'>
              <Image source={require('../assets/icons/sun.png')} className='h-6 w-6' />
              <Text className="text-white font-semibold text-base pl-2">06:11</Text>
            </View>
          </View>
          { /* forecast */}

          <View className='mb-2 space-y-3'>
            <View className="flex-row items-center mx-5 space-x-2">
              <CalendarDaysIcon size="22" color="white" />
              <Text className='text-white text-base'>Daily forecast</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            contentContainerStyle={{ paddingHorizontal: 15 }}
            showsHorizontalScrollIndicator={false}
          >
            {
              forecast.map((val, index) => (
                <View
                  key={index}
                  className='justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'
                  style={{ backgroundColor: theme.bgWhite(0.15) }}
                >
                  <Image source={require('../assets/images/heavyrain.png')}
                    className='h-11 w-11' />
                  <Text className='text-white'>Monday</Text>
                  <Text className='text-white text-xl font-semibold'>23!</Text>
                </View>
              ))
            }

          </ScrollView>
        </View>
      </Container >
    </View >
  );
};
