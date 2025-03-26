import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { View, Text } from "react-native";
import BookingPage from "./BookingPage";
import AdoptionPage from "./AdoptionPage";

const HomeScreen = () => (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>🏡 Welcome to OnDogDog Cafe!</Text>
    </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainTabs = () => (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Booking" component={BookingPage} />
        <Tab.Screen name="Adoption" component={AdoptionPage} />
    </Tab.Navigator>
);

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
