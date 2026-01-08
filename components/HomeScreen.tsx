import React, { useState, useCallback, useEffect } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { Container } from './Container';
import { StatusBar } from 'expo-status-bar';
import { theme } from './theme'
import { CalendarDaysIcon, MagnifyingGlassIcon } from 'react-native-heroicons/outline'
import { MapPinIcon } from 'react-native-heroicons/solid'
import { ScrollView } from 'react-native';
import { fetchLocations, fetchWeatherForecast } from 'api/weather';
import { debounce } from 'lodash';
import { Location, Weather } from 'interfaces/api';
import { defaultLocation } from 'constants/defaults';
import { getWeatherImage } from 'components/WeatherIcon';

type ScreenContentProps = {
  title: string;
  path: string;
  children?: React.ReactNode;
};

export const HomeScreen = ({ title, path, children }: ScreenContentProps) => {
  const [showSearch, toggleShowSearch] = useState<boolean>(false);
  const [location, setLocation] = useState<Location>(defaultLocation);
  const [locationsSuggestions, setLocationsSuggestions] = useState<Location[]>([]);
  const [weather, setWeather] = useState<Weather>();

  const loadWeather = async (city: string) => {
    fetchWeatherForecast({ city: city, days: 5 }).then(d => setWeather(d as Weather));
  };

  useEffect(() => {
    loadWeather(location.name)
  }, []);

  const handleLocationSelection = (location: Location) => {
    console.log(location);
    setLocationsSuggestions([]);
    setLocation(location);
    loadWeather(location?.name);
    toggleShowSearch(false);
  }
  const onSearch = (query: string) => {
    if (query.length !== 0) {
      fetchLocations({ query }).then(data => {
        setLocationsSuggestions(data as Location[])
      });
    }
  }
  const onSearchDebounced = useCallback(debounce(onSearch, 300), []);

  return (
    <View className="flex-1 relative" >
      <StatusBar style="light" />
      <Image source={require("../assets/images/home-bg.jpg")}
        className="absolute h-full w-full" blurRadius={60} />
      <Container>
        { /* search section */}
        <View className='mx-6 pt-4 relative z-50'>
          <View className={'flex-row justify-end items-center rounded-lg'}
            style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}>
            {
              showSearch ?
                <TextInput
                  placeholder="What's your city?"
                  placeholderTextColor={'lightgray'}
                  onChangeText={onSearchDebounced}
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
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="mx-4 flex justify-around flex-1 mb-2">
            { /*Location*/}
            <Text className='text-white text-center text-2xl font-bold'>
              {location?.name},
              <Text className='text-lg font-semibold text-gray-300'>
                {" " + location?.country}
              </Text>
            </Text>
            { /* weather image */}
            <View className='flex-row justify-center'>
              <Image
                source={getWeatherImage(weather?.current?.condition.text)}
                className='h-52 w-52'
              />
            </View>
            { /* degree celcius */}
            <View className='space-y-2'>
              <Text className="text-center font-bold text-white text-6xl ml-5">
                {weather?.current.temp_c} ºC
              </Text>

              <Text className="text-center text-white text-xl tracking-widest">
                {weather?.current.condition.text}
              </Text>
            </View>
            { /*other stats*/}
            <View className='flex-row justify-between mx-4'>
              <View className='flex-row space-x-2 items-center'>
                <Image source={require('../assets/icons/wind.png')} className='h-6 w-6' />
                <Text className="text-white font-semibold text-base pl-2">
                  {weather?.current.wind_kph} kph</Text>
              </View>
              <View className='flex-row space-x-2 items-center'>
                <Image source={require('../assets/icons/drop.png')} className='h-6 w-6' />
                <Text className="text-white font-semibold text-base pl-2">
                  {weather?.current.humidity}%</Text>
              </View>
              <View className='flex-row space-x-2 items-center'>
                <Image source={require('../assets/icons/sun.png')} className='h-6 w-6' />
                <Text className="text-white font-semibold text-base pl-2">
                  {weather?.forecast.forecastday[0].astro.sunrise}</Text>
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
                weather?.forecast?.forecastday.map((val, index) => (
                  <View
                    key={index}
                    className='justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4'
                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                  >
                    <Image
                      source={getWeatherImage(val?.day.condition.text)}
                      className='h-8 w-8'
                    />
                    <Text className='text-white'>{val?.date}</Text>
                    <Text className='text-white text-xl font-semibold'>{val?.day?.avgtemp_c}</Text>
                  </View>
                ))
              }

            </ScrollView>
          </View>
        </ScrollView>
      </Container >
    </View >
  );
};
