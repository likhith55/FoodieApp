
import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './AppContext';
import HomeScreen from './screens/HomeScreen';
import AddRecipeScreen from './screens/AddRecipeScreen';
import DetailScreen from './screens/DetailScreen';

const Stack = createNativeStackNavigator();

function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=1200',
        }}
        resizeMode="cover"
        style={styles.hero}
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>f.</Text>
          </View>

          <Text style={styles.brand}>the good{'\n'}food club.</Text>
          <Text style={styles.tagline}>A little inspiration for your table.</Text>

          <Text style={styles.heading}>
            Find your next{'\nfavourite bite.'}
          </Text>
          <Text style={styles.description}>
            Everyday recipes, worth-the-effort flavours, and a place to keep
            all the dishes you love.
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.85}
            onPress={() => navigation.replace('Home')}
          >
            <Text style={styles.buttonText}>Come on in</Text>
            <Text style={styles.arrow}>↗</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>GOOD THINGS ARE COOKING</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

export default function App() {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="AddRecipe" component={AddRecipeScreen} />
          <Stack.Screen name="Detail" component={DetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#26352B' },
  hero: { flex: 1, justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(24, 31, 24, 0.55)',
  },
  content: { paddingHorizontal: 28, paddingBottom: 48 },
  logo: {
    width: 58,
    height: 58,
    borderRadius: 20,
    backgroundColor: '#F3E4D8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logoText: { fontSize: 32, fontWeight: '800', color: '#E66E46' },
  brand: { fontSize: 35, lineHeight: 37, fontWeight: '800', color: '#FFFFFF' },
  tagline: { fontSize: 13, color: '#F0E9DF', marginTop: 8 },
  heading: {
    fontSize: 32,
    lineHeight: 39,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 36,
  },
  description: {
    fontSize: 14,
    lineHeight: 23,
    color: '#F0E9DF',
    marginTop: 13,
    marginBottom: 26,
  },
  button: {
    height: 58,
    borderRadius: 19,
    backgroundColor: '#F2A57C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontSize: 15, fontWeight: '800', color: '#382D25' },
  arrow: { fontSize: 21, color: '#382D25', marginLeft: 12 },
  footer: {
    color: '#F0E9DF',
    fontSize: 10,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 30,
  },
});
