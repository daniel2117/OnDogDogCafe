module.exports = {
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '7d'
    },
    email: {
        from: '"Dog Café" <no-reply@dogcafe.com>',
        templates: {
            reservation: {
                confirmation: 'reservation-confirmation',
                reminder: 'reservation-reminder',
                cancellation: 'reservation-cancellation'
            },
            adoption: {
                interest: 'adoption-interest',
                meetGreet: 'meet-greet-scheduled',
                homeVisit: 'home-visit-scheduled',
                approved: 'adoption-approved',
                rejected: 'adoption-rejected',
                trialStart: 'trial-period-start',
                trialEnd: 'trial-period-end'
            }
        }
    },
    uploads: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png'],
        path: 'uploads/'
    },
    services: {
        timeSlots: ["10:00", "12:00", "14:00", "16:00", "18:00", "20:00"],
        types: ["Tourist Area", "Dog Play Area", "Pet Grooming", "Indoor Dog Pool", "Dog Hotel"],
        maxBookingDays: 30,
        maxVisitors: 10,
        maxDogs: 5
    }
};