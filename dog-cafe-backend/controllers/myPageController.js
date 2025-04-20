const asyncHandler = require('express-async-handler');
const { Reservation } = require('../models/Reservation');
const Adoption = require('../models/Adoption');
const RehomingApplication = require('../models/RehomingApplication');
const validators = require('../utils/validator');

const myPageController = {
    getUserApplications: asyncHandler(async (req, res) => {
        const { email } = req.query;

        if (!email || !validators.isValidEmail(email)) {
            return res.status(400).json({
                message: 'Valid email is required'
            });
        }

        // Fetch all applications in parallel
        const [reservations, adoptions, rehoming] = await Promise.all([
            // Get reservations
            Reservation.find({ 'customerInfo.email': email })
                .select('date timeSlot selectedServices customerInfo.specialRequest status')
                .sort({ date: -1 }),

            // Get adoption applications
            Adoption.find({ 'personalInfo.email': email })
                .select('submittedAt status dog')
                .populate('dog', 'name')
                .sort({ submittedAt: -1 }),

            // Get rehoming applications
            RehomingApplication.find({ 'ownerInfo.email': email })
                .select('createdAt petInfo status')
                .sort({ createdAt: -1 })
        ]);

        // Transform the data into a unified format
        const formattedReservations = reservations.map(r => ({
            type: 'reservation',
            date: r.date,
            time: r.timeSlot,
            reservedFacility: r.selectedServices.join(', '),
            specialRequest: r.customerInfo.specialRequest || 'n/a',
            status: r.status
        }));

        const formattedAdoptions = adoptions.map(a => ({
            type: 'adoption',
            date: a.submittedAt,
            interestedCompanion: a.dog?.name || 'Unknown Dog',
            status: a.status
        }));

        const formattedRehoming = rehoming.map(r => ({
            type: 'rehoming',
            date: r.createdAt,
            petName: r.petInfo.name,
            status: r.status
        }));

        res.json({
            reservations: formattedReservations,
            adoptions: formattedAdoptions,
            rehoming: formattedRehoming
        });
    })
};

module.exports = myPageController;
