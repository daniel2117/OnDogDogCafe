import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const HomeScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>🐶 Welcome to OnDogDog Cafe 🐶</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Booking")}>
                <Text style={styles.buttonText}>📅 예약하기</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Adoption")}>
                <Text style={styles.buttonText}>🏡 입양하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f8f8" },
    title: { fontSize: 24, fontWeight: "bold", marginBottom: 40 },
    button: { backgroundColor: "#007BFF", padding: 15, borderRadius: 10, marginBottom: 20, width: "80%", alignItems: "center" },
    buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default HomeScreen;
