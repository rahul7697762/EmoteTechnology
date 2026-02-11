import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { assessmentAPI } from "../../utils/api";
import { toast } from "react-hot-toast";

export const createAssessment = createAsyncThunk(
    "assessment/create",
    async (data, { rejectWithValue }) => {
        try {
            const response = await assessmentAPI.createAssessment(data);
            toast.success("Assessment created successfully");
            return { data: response.data }; // Maintain consistent payload structure
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to create assessment");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updateAssessment = createAsyncThunk(
    "assessment/update",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await assessmentAPI.updateAssessment(id, data);
            toast.success("Assessment updated successfully");
            return { data: response.data };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update assessment");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getAssessmentForFaculty = createAsyncThunk(
    "assessment/getForFaculty",
    async (moduleId, { rejectWithValue }) => {
        try {
            const response = await assessmentAPI.getAssessmentForFaculty(moduleId);
            return { data: response.data }; // Maintain consistent payload structure
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const getAssessmentById = createAsyncThunk(
    "assessment/getById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await assessmentAPI.getAssessmentById(id);
            return { data: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

export const addQuestion = createAsyncThunk(
    "assessment/addQuestion",
    async ({ assessmentId, data }, { rejectWithValue }) => {
        try {
            const response = await assessmentAPI.addQuestion(assessmentId, data);
            toast.success("Question added");
            return { data: response.data }; // Maintain consistent payload structure
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add question");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const deleteQuestion = createAsyncThunk(
    "assessment/deleteQuestion",
    async (id, { rejectWithValue }) => {
        try {
            await assessmentAPI.deleteQuestion(id);
            toast.success("Question deleted");
            return id;
        } catch (error) {
            toast.error("Failed to delete question");
            return rejectWithValue(error.response?.data);
        }
    }
);

export const deleteAssessment = createAsyncThunk(
    "assessment/delete",
    async ({ id, moduleId }, { rejectWithValue }) => {
        try {
            await assessmentAPI.deleteAssessment(id);
            toast.success("Assessment deleted successfully");
            return { id, moduleId };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to delete assessment");
            return rejectWithValue(error.response?.data);
        }
    }
);

// Toggle Publish Status
export const togglePublishAssessment = createAsyncThunk(
    "assessment/togglePublish",
    async (id, { rejectWithValue }) => {
        try {
            const response = await assessmentAPI.togglePublishAssessment(id);
            toast.success(response.message || "Assessment status updated");
            return { data: response.data };
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
            return rejectWithValue(error.response?.data);
        }
    }
);

// Student
export const getAssessmentForStudent = createAsyncThunk(
    "assessment/getForStudent",
    async (moduleId, { rejectWithValue }) => {
        try {
            const response = await assessmentAPI.getAssessmentForStudent(moduleId);
            return { data: response.data }; // Maintain consistent payload structure
        } catch (error) {
            return rejectWithValue(error.response?.data);
        }
    }
);

const assessmentSlice = createSlice({
    name: "assessment",
    initialState: {
        assessment: null, // Current assessment being viewed/edited

        // Granular Loading States
        isCreating: false,
        isLoadingAssessment: false,
        isAddingQuestion: false,
        isDeletingQuestion: false,
        isDeletingAssessment: false,

        error: null
    },
    reducers: {
        clearAssessment: (state) => {
            state.assessment = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create
            .addCase(createAssessment.pending, (state) => {
                state.isCreating = true;
                state.error = null;
            })
            .addCase(createAssessment.fulfilled, (state, action) => {
                state.isCreating = false;
                state.assessment = action.payload.data;
            })
            .addCase(createAssessment.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload;
            })
            // Get Faculty
            .addCase(getAssessmentForFaculty.pending, (state) => {
                state.isLoadingAssessment = true;
                state.error = null;
            })
            .addCase(getAssessmentForFaculty.fulfilled, (state, action) => {
                state.isLoadingAssessment = false;
                state.assessment = action.payload.data;
            })
            .addCase(getAssessmentForFaculty.rejected, (state) => {
                state.isLoadingAssessment = false;
                state.assessment = null;
            })
            // Get By ID
            .addCase(getAssessmentById.pending, (state) => {
                state.isLoadingAssessment = true;
                state.error = null;
            })
            .addCase(getAssessmentById.fulfilled, (state, action) => {
                state.isLoadingAssessment = false;
                state.assessment = action.payload.data;
            })
            .addCase(getAssessmentById.rejected, (state, action) => {
                state.isLoadingAssessment = false;
                state.error = action.payload;
            })
            // Update
            .addCase(updateAssessment.pending, (state) => {
                state.isCreating = true; // reusing existing loading state or add new isUpdating
                state.error = null;
            })
            .addCase(updateAssessment.fulfilled, (state, action) => {
                state.isCreating = false;
                // Merge the updated data with existing assessment to preserve questions array
                if (state.assessment) {
                    state.assessment = {
                        ...state.assessment,
                        ...action.payload.data,
                        // Preserve questions if not included in update response
                        questions: action.payload.data.questions || state.assessment.questions
                    };
                } else {
                    state.assessment = action.payload.data;
                }
            })
            .addCase(updateAssessment.rejected, (state, action) => {
                state.isCreating = false;
                state.error = action.payload;
            })
            // Delete Assessment
            .addCase(deleteAssessment.pending, (state) => {
                state.isDeletingAssessment = true;
                state.error = null;
            })
            .addCase(deleteAssessment.fulfilled, (state, action) => {
                state.isDeletingAssessment = false;
                state.assessment = null;
            })
            .addCase(deleteAssessment.rejected, (state, action) => {
                state.isDeletingAssessment = false;
                state.error = action.payload;
            })
            // Toggle Publish
            .addCase(togglePublishAssessment.fulfilled, (state, action) => {
                if (state.assessment && state.assessment._id === action.payload.data._id) {
                    state.assessment.status = action.payload.data.status;
                }
            })
            // Add Question
            .addCase(addQuestion.pending, (state) => {
                state.isAddingQuestion = true;
                state.error = null;
            })
            .addCase(addQuestion.fulfilled, (state, action) => {
                state.isAddingQuestion = false;
                if (state.assessment) {
                    if (!state.assessment.questions) state.assessment.questions = [];
                    state.assessment.questions.push(action.payload.data);
                }
            })
            .addCase(addQuestion.rejected, (state, action) => {
                state.isAddingQuestion = false;
                state.error = action.payload;
            })
            // Delete Question
            .addCase(deleteQuestion.pending, (state) => {
                state.isDeletingQuestion = true;
                state.error = null;
            })
            .addCase(deleteQuestion.fulfilled, (state, action) => {
                state.isDeletingQuestion = false;
                if (state.assessment && state.assessment.questions) {
                    state.assessment.questions = state.assessment.questions.filter(q => q._id !== action.payload);
                }
            })
            .addCase(deleteQuestion.rejected, (state, action) => {
                state.isDeletingQuestion = false;
                state.error = action.payload;
            })
            // Student
            .addCase(getAssessmentForStudent.pending, (state) => {
                state.isLoadingAssessment = true;
                state.error = null;
            })
            .addCase(getAssessmentForStudent.fulfilled, (state, action) => {
                state.isLoadingAssessment = false;
                state.assessment = action.payload.data;
            })
            .addCase(getAssessmentForStudent.rejected, (state, action) => {
                state.isLoadingAssessment = false;
                state.error = action.payload;
            });
    }
});

export const { clearAssessment } = assessmentSlice.actions;
export default assessmentSlice.reducer;
