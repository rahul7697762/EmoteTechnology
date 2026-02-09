const questionSchema = new mongoose.Schema({
    assessmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assessment",
        required: true
    },

    type: {
        type: String,
        enum: ["MCQ", "TRUE_FALSE", "SHORT", "CODING"],
        required: true
    },

    questionText: {
        type: String,
        required: true
    },

    options: [String], // MCQ / TRUE_FALSE

    //todo
    correctAnswer: mongoose.Schema.Types.Mixed,

    explanation: String,

    marks: {
        type: Number,
        required: true
    },

    order: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

// INDEX 
// Load questions for an assessment in order
questionSchema.index(
    { assessmentId: 1, order: 1 },
    { unique: true }
);

export const Question = mongoose.model("Question", questionSchema);