import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const BookingPage = () => {
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const timeSlots = ["10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff", padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>📅 Booking Page</Text>
      
      {/* Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ padding: 15, backgroundColor: "#f1f1f1", borderRadius: 10, marginBottom: 20 }}>
        <Text style={{ fontSize: 18 }}>📆 Select Date: {date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}
      
      {/* Time Slots */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>⏰ Select Time Slot:</Text>
      {timeSlots.map((slot, index) => (
        <TouchableOpacity 
          key={index} 
          onPress={() => setSelectedTimeSlot(slot)} 
          style={{ padding: 15, backgroundColor: selectedTimeSlot === slot ? "#007BFF" : "#f8f8f8", borderRadius: 10, marginBottom: 10 }}>
          <Text style={{ fontSize: 16, color: selectedTimeSlot === slot ? "#fff" : "#000" }}>{slot}</Text>
        </TouchableOpacity>
      ))}
      
      {/* Personal Information */}
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>👤 Your Information:</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={{ padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 }} />
      <TextInput placeholder="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={{ padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 20 }} />
      
      {/* Submit Button */}
      <TouchableOpacity style={{ backgroundColor: "#007BFF", padding: 15, borderRadius: 10, alignItems: "center" }}>
        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookingPage;
