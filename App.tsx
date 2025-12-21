import { HomeScreen } from 'components/HomeScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import './global.css';

export default function App() {
  return (
    <SafeAreaProvider>
      <HomeScreen title="Home" path="App.tsx"></HomeScreen>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}
