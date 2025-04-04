const AdoptionApplication = require('../models/AdoptionApplication');
const MeetGreet = require('../models/MeetGreet');
const HomeVisit = require('../models/HomeVisit');
const TrialPeriod = require('../models/TrialPeriod');
const FinalAdoption = require('../models/FinalAdoption');
const DogAdoptionListing = require('../models/DogAdoptionListing');
const asyncHandler = require('express-async-handler');

// Submit Initial Interest
exports.submitInitialInterest = asyncHandler(async (req, res) => {
    const application = await AdoptionApplication.create({
        userId: req.user.id,
        dogId: req.body.dogId,
        initialQuestionnaire: req.body.questionnaire
    });

    await DogAdoptionListing.findByIdAndUpdate(req.body.dogId, {
        adoptionStatus: 'Meet&Greet',
        currentApplication: application._id
    });

    res.status(201).json({
        success: true,
        data: application
    });
});

// Schedule Meet & Greet
exports.scheduleMeetGreet = asyncHandler(async (req, res) => {
    const meetGreet = await MeetGreet.create({
        applicationId: req.body.applicationId,
        appointmentDate: req.body.appointmentDate,
        attendees: req.body.attendees,
        includingCurrentPets: req.body.includingCurrentPets
    });

    await AdoptionApplication.findByIdAndUpdate(req.body.applicationId, {
        status: 'MeetGreet'
    });

    res.status(201).json({
        success: true,
        data: meetGreet
    });
});

// Update Meet & Greet
exports.updateMeetGreet = asyncHandler(async (req, res) => {
    const meetGreet = await MeetGreet.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (req.body.outcome) {
        const application = await AdoptionApplication.findById(meetGreet.applicationId);
        if (req.body.outcome === 'Positive') {
            await AdoptionApplication.findByIdAndUpdate(meetGreet.applicationId, {
                status: 'HomeVisit'
            });
        } else if (req.body.outcome === 'Negative') {
            await AdoptionApplication.findByIdAndUpdate(meetGreet.applicationId, {
                status: 'Rejected'
            });
            await DogAdoptionListing.findByIdAndUpdate(application.dogId, {
                adoptionStatus: 'Available',
                currentApplication: null
            });
        }
    }

    res.status(200).json({
        success: true,
        data: meetGreet
    });
});

// Schedule Home Visit
exports.scheduleHomeVisit = asyncHandler(async (req, res) => {
    const homeVisit = await HomeVisit.create({
        applicationId: req.body.applicationId,
        scheduledDate: req.body.scheduledDate,
        inspector: {
            staffId: req.user.id,
            name: req.user.name
        }
    });

    res.status(201).json({
        success: true,
        data: homeVisit
    });
});

// Update Home Visit
exports.updateHomeVisit = asyncHandler(async (req, res) => {
    const homeVisit = await HomeVisit.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (req.body.recommendation) {
        const application = await AdoptionApplication.findById(homeVisit.applicationId);
        if (req.body.recommendation === 'Approved') {
            await AdoptionApplication.findByIdAndUpdate(homeVisit.applicationId, {
                status: 'Trial'
            });
        } else if (req.body.recommendation === 'Rejected') {
            await AdoptionApplication.findByIdAndUpdate(homeVisit.applicationId, {
                status: 'Rejected'
            });
            await DogAdoptionListing.findByIdAndUpdate(application.dogId, {
                adoptionStatus: 'Available',
                currentApplication: null
            });
        }
    }

    res.status(200).json({
        success: true,
        data: homeVisit
    });
});

// Start Trial Period
exports.startTrialPeriod = asyncHandler(async (req, res) => {
    const trialPeriod = await TrialPeriod.create({
        applicationId: req.body.applicationId,
        startDate: req.body.startDate,
        endDate: req.body.endDate
    });

    const application = await AdoptionApplication.findById(req.body.applicationId);
    await DogAdoptionListing.findByIdAndUpdate(application.dogId, {
        adoptionStatus: 'Trial'
    });

    res.status(201).json({
        success: true,
        data: trialPeriod
    });
});

// Add Trial Log
exports.addTrialLog = asyncHandler(async (req, res) => {
    const trialPeriod = await TrialPeriod.findByIdAndUpdate(
        req.params.id,
        {
            $push: { dailyLogs: req.body }
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: trialPeriod
    });
});

// Request Trial Support
exports.requestSupport = asyncHandler(async (req, res) => {
    const trialPeriod = await TrialPeriod.findByIdAndUpdate(
        req.params.id,
        {
            $push: { 
                supportRequests: {
                    date: new Date(),
                    issue: req.body.issue,
                    resolved: false
                }
            }
        },
        { new: true }
    );

    res.status(200).json({
        success: true,
        data: trialPeriod
    });
});

// Complete Final Adoption
exports.completeFinalAdoption = asyncHandler(async (req, res) => {
    const finalAdoption = await FinalAdoption.create({
        applicationId: req.body.applicationId,
        completionDate: new Date(),
        contract: req.body.contract,
        payment: req.body.payment,
        medicalRecords: req.body.medicalRecords,
        supplies: req.body.supplies,
        instructions: req.body.instructions
    });

    const application = await AdoptionApplication.findByIdAndUpdate(
        req.body.applicationId,
        { status: 'Completed' }
    );

    await DogAdoptionListing.findByIdAndUpdate(application.dogId, {
        adoptionStatus: 'Adopted',
        status: 'Adopted'
    });

    res.status(201).json({
        success: true,
        data: finalAdoption
    });
});