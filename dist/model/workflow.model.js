"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workflow = void 0;
const mongoose = require('mongoose');
const executionHistorySchema = new mongoose.Schema({
    executedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['Success', 'Failed', 'In Progress'],
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    duration: {
        type: Number, // Execution duration in milliseconds
    },
    errorMessage: {
        type: String, // Stores error details if execution fails
    }
});
const typeSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['apiCall', 'email', 'textBox'],
        required: true,
    },
    data: {
        type: mongoose.Schema.Types.Mixed, // Allows flexible data structures
    },
    status: {
        type: Boolean,
        default: false,
        required: true,
    }
}, {
    timestamps: true,
});
const workflowSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    steps: {
        type: [
            typeSchema
        ],
        default: [],
    },
    status: {
        type: String,
        enum: ['Draft', 'Active', 'Completed', 'Failed'],
        default: 'Draft',
    },
    lastUpdatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    executionHistory: {
        type: [executionHistorySchema],
        default: [],
    }
}, {
    timestamps: true,
});
exports.Workflow = mongoose.model('Workflow', workflowSchema);
