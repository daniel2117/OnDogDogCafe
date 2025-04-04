module.exports = {
    uploads: {
        maxSize: 5 * 1024 * 1024 // 5MB
    },
    reservation: {
        maxPeoplePerSlot: 10,
        timeSlots: [
            '10:00', '11:00', '12:00', '13:00', '14:00',
            '15:00', '16:00', '17:00', '18:00', '19:00'
        ]
    }
};