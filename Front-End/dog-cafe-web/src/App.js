import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import BookingPage from "./screens/BookingScreen";
import AdoptionPage from "./screens/AdoptionScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Booking" component={BookingPage} />
        <Stack.Screen name="Adoption" component={AdoptionPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
