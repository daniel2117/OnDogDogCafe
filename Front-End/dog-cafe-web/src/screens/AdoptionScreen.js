import React, { useState } from "react";
import { View, Text, ScrollView, Image, TouchableOpacity, Modal, Button } from "react-native";

const AdoptionPage = () => {
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const pets = [
    { id: 1, name: "Bella", image: "https://via.placeholder.com/150", age: "2 years", breed: "Golden Retriever" },
    { id: 2, name: "Charlie", image: "https://via.placeholder.com/150", age: "3 years", breed: "Labrador" },
    { id: 3, name: "Max", image: "https://via.placeholder.com/150", age: "1 year", breed: "Beagle" },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>🐶 Adoption Page</Text>
      
      {pets.map((pet) => (
        <TouchableOpacity
          key={pet.id}
          onPress={() => {
            setSelectedPet(pet);
            setModalVisible(true);
          }}
          style={{ marginBottom: 20, alignItems: "center", padding: 10, backgroundColor: "#f1f1f1", borderRadius: 10 }}
        >
          <Image source={{ uri: pet.image }} style={{ width: 150, height: 150, borderRadius: 10 }} />
          <Text style={{ fontSize: 18, fontWeight: "bold", marginTop: 10 }}>{pet.name}</Text>
          <Text>{pet.breed} - {pet.age}</Text>
        </TouchableOpacity>
      ))}

      {/* Modal for Pet Details */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ width: 300, padding: 20, backgroundColor: "#fff", borderRadius: 10, alignItems: "center" }}>
            {selectedPet && (
              <>
                <Image source={{ uri: selectedPet.image }} style={{ width: 200, height: 200, borderRadius: 10 }} />
                <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 10 }}>{selectedPet.name}</Text>
                <Text style={{ fontSize: 16 }}>{selectedPet.breed} - {selectedPet.age}</Text>
                <Text style={{ marginVertical: 10 }}>This lovely pet is looking for a new home!</Text>
                <Button title="Close" onPress={() => setModalVisible(false)} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default AdoptionPage;
