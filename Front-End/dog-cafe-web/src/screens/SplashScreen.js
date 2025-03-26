import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

const SplashScreenComponent = ({ navigation }) => {
    useEffect(() => {
        const prepare = async () => {
            try {
                await SplashScreen.preventAutoHideAsync(); // 스플래시 화면 유지
                setTimeout(() => {
                    SplashScreen.hideAsync(); // 일정 시간 후 숨기기
                    navigation.replace("Main"); // 홈 화면으로 이동
                }, 2000);
            } catch (e) {
                console.warn(e);
            }
        };
        prepare();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>🐶 OnDogDog Cafe 🐶</Text>
            <ActivityIndicator size="large" color="#007BFF" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f8f8f8" },
    text: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
});

export default SplashScreenComponent;
