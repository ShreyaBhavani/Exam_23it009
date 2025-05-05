const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    eventType: {
        type: String,
        required: true,
        enum: ['Academic', 'Cultural', 'Sports', 'Technical', 'Other']
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    venue: {
        type: String,
        required: true
    },
    maxParticipants: {
        type: Number,
        required: true,
        min: 1
    },
    currentParticipants: {
        type: Number,
        default: 0,
        min: 0
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['upcoming', 'ongoing', 'completed'],
        default: 'upcoming'
    }
}, {
    timestamps: true,
    collection: 'eventcollection'
});

// Add text index for search functionality
eventSchema.index({ title: 'text', description: 'text', venue: 'text' });

const Event = mongoose.model('Event', eventSchema);

module.exports = Event; 