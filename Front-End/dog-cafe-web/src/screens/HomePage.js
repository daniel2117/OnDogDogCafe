import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { useWindowDimensions } from "react-native";
import Carousel from "react-native-snap-carousel";

const HomePage = () => {
    const { width } = useWindowDimensions();

    const carouselItems = [
        { id: 1, title: "Swimming Pool", image: "https://via.placeholder.com/300" },
        { id: 2, title: "Cafe", image: "https://via.placeholder.com/300" },
    ];

    const renderItem = ({ item }) => (
        <View style={{ alignItems: "center", padding: 10 }}>
            <Image source={{ uri: item.image }} style={{ width: 300, height: 150, borderRadius: 10 }} />
            <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>{item.title}</Text>
        </View>
    );

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* Header */}
            <View style={{ padding: 20, alignItems: "center" }}>
                <Text style={{ fontSize: 24, fontWeight: "bold" }}>🏊 Booking | Promotions | Functions</Text>
            </View>

            {/* Carousel */}
            <Carousel
                data={carouselItems}
                renderItem={renderItem}
                sliderWidth={width}
                itemWidth={320}
            />

            {/* Latest Updates */}
            <View style={{ padding: 20 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>Latest Updates</Text>
                <View style={{ marginTop: 10, padding: 15, backgroundColor: "#f1f1f1", borderRadius: 10 }}>
                    <Text>🔔 New promotions available!</Text>
                </View>
            </View>
        </ScrollView>
    );
};

export default HomePage;
