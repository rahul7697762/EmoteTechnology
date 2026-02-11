import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { moduleAPI, subModuleAPI } from '../../utils/api';
import { createAssessment, deleteAssessment } from './assessmentSlice';
import toast from 'react-hot-toast';

// Async Thunks

export const getModulesByCourse = createAsyncThunk(
    'module/getModulesByCourse',
    async (courseId, { rejectWithValue }) => {
        try {
            const response = await moduleAPI.getModulesByCourse(courseId);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch modules');
        }
    }
);

export const createModule = createAsyncThunk(
    'module/createModule',
    async ({ courseId, title, order }, { rejectWithValue }) => {
        try {
            const response = await moduleAPI.createModule(courseId, { title, order });
            toast.success('Module created successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create module');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateModule = createAsyncThunk(
    'module/updateModule',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await moduleAPI.updateModule(id, data);
            toast.success('Module updated successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update module');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteModule = createAsyncThunk(
    'module/deleteModule',
    async (id, { rejectWithValue }) => {
        try {
            await moduleAPI.deleteModule(id);
            toast.success('Module deleted successfully');
            return id;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete module');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const reorderModules = createAsyncThunk(
    'module/reorderModules',
    async ({ courseId, modules }, { rejectWithValue }) => {
        try {
            await moduleAPI.reorderModules(courseId, modules);
            toast.success('Modules reordered successfully');
            return modules; // Valid for updating state order
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to reorder modules');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const publishModule = createAsyncThunk(
    'module/publishModule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await moduleAPI.publishModule(id);
            toast.success('Module published');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to publish module');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const unpublishModule = createAsyncThunk(
    'module/unpublishModule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await moduleAPI.unpublishModule(id);
            toast.success('Module unpublished');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to unpublish module');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// --- SubModule Thunks ---

export const getSubModules = createAsyncThunk(
    'module/getSubModules',
    async (moduleId, { rejectWithValue }) => {
        try {
            const response = await subModuleAPI.getSubModulesByModule(moduleId);
            return { moduleId, subModules: response.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch lessons');
        }
    }
);

export const createSubModule = createAsyncThunk(
    'module/createSubModule',
    async (data, { rejectWithValue }) => {
        try {
            const response = await subModuleAPI.createSubModule(data);
            toast.success('Lesson created successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create lesson');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const updateSubModule = createAsyncThunk(
    'module/updateSubModule',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await subModuleAPI.updateSubModule(id, data);
            toast.success('Lesson updated successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update lesson');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const deleteSubModule = createAsyncThunk(
    'module/deleteSubModule',
    async ({ subModuleId, moduleId }, { rejectWithValue }) => {
        try {
            await subModuleAPI.deleteSubModule(subModuleId);
            toast.success('Lesson deleted successfully');
            return { subModuleId, moduleId };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete lesson');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const reorderSubModules = createAsyncThunk(
    'module/reorderSubModules',
    async ({ moduleId, subModules }, { rejectWithValue }) => {
        try {
            await subModuleAPI.reorderSubModules(moduleId, subModules);
            // toast.success('Lessons reordered'); 
            return { moduleId, subModules };
        } catch (error) {
            toast.error('Failed to reorder lessons');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const publishSubModule = createAsyncThunk(
    'module/publishSubModule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await subModuleAPI.publishSubModule(id);
            toast.success('Lesson published');
            return response.data;
        } catch (error) {
            toast.error('Failed to publish lesson');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

export const unpublishSubModule = createAsyncThunk(
    'module/unpublishSubModule',
    async (id, { rejectWithValue }) => {
        try {
            const response = await subModuleAPI.unpublishSubModule(id);
            toast.success('Lesson unpublished');
            return response.data;
        } catch (error) {
            toast.error('Failed to unpublish lesson');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const initialState = {
    modules: [], // List of modules
    currentModule: null, // Selected module for editing details

    // Module Loading States
    isFetchingModules: false,
    isCreatingModule: false,
    isUpdatingModule: false,
    isDeletingModule: false,
    isReorderingModules: false,

    // SubModule Loading States
    isCreatingSubModule: false,
    isUpdatingSubModule: false,
    isDeletingSubModule: false,
    isPublishingSubModule: false,

    error: null,
};

const moduleSlice = createSlice({
    name: 'module',
    initialState,
    reducers: {
        // Optimistic update for reordering
        setModulesOrder: (state, action) => {
            state.modules = action.payload;
        },
        clearModuleError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Get All
            .addCase(getModulesByCourse.pending, (state) => {
                state.isFetchingModules = true;
                state.error = null;
            })
            .addCase(getModulesByCourse.fulfilled, (state, action) => {
                state.isFetchingModules = false;
                state.modules = action.payload;
            })
            .addCase(getModulesByCourse.rejected, (state, action) => {
                state.isFetchingModules = false;
                state.error = action.payload;
            })

            // Create
            .addCase(createModule.pending, (state) => {
                state.isCreatingModule = true;
                state.error = null;
            })
            .addCase(createModule.fulfilled, (state, action) => {
                state.isCreatingModule = false;
                state.modules.push(action.payload);
            })
            .addCase(createModule.rejected, (state, action) => {
                state.isCreatingModule = false;
                state.error = action.payload;
            })

            // Update & Publish/Unpublish (all return updated module without submodules)
            .addCase(updateModule.pending, (state) => {
                state.isUpdatingModule = true;
                state.error = null;
            })
            .addCase(updateModule.fulfilled, (state, action) => {
                state.isUpdatingModule = false;
                const index = state.modules.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    // Preserve subModules and other local state
                    state.modules[index] = {
                        ...action.payload,
                        subModules: state.modules[index].subModules,
                        subModulesCount: state.modules[index].subModulesCount
                    };
                }
            })
            .addCase(updateModule.rejected, (state, action) => {
                state.isUpdatingModule = false;
                state.error = action.payload;
            })

            .addCase(publishModule.fulfilled, (state, action) => {
                const index = state.modules.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.modules[index] = {
                        ...action.payload,
                        subModules: state.modules[index].subModules,
                        subModulesCount: state.modules[index].subModulesCount
                    };
                }
            })
            .addCase(unpublishModule.fulfilled, (state, action) => {
                const index = state.modules.findIndex(m => m._id === action.payload._id);
                if (index !== -1) {
                    state.modules[index] = {
                        ...action.payload,
                        subModules: state.modules[index].subModules,
                        subModulesCount: state.modules[index].subModulesCount
                    };
                }
            })

            // Delete
            .addCase(deleteModule.pending, (state) => {
                state.isDeletingModule = true;
                state.error = null;
            })
            .addCase(deleteModule.fulfilled, (state, action) => {
                state.isDeletingModule = false;
                state.modules = state.modules.filter(m => m._id !== action.payload);
            })
            .addCase(deleteModule.rejected, (state, action) => {
                state.isDeletingModule = false;
                state.error = action.payload;
            })

            // Reorder
            .addCase(reorderModules.pending, (state) => {
                state.isReorderingModules = true;
                state.error = null;
            })
            .addCase(reorderModules.fulfilled, (state, action) => {
                state.isReorderingModules = false;
            })
            .addCase(reorderModules.rejected, (state, action) => {
                state.isReorderingModules = false;
                state.error = action.payload;
            })

            // Reorder SubModules
            .addCase(reorderSubModules.fulfilled, (state, action) => {
                const { moduleId, subModules } = action.payload; // subModules is [{ subModuleId, order }]
                const module = state.modules.find(m => m._id === moduleId);
                if (module && module.subModules) {
                    // Update order of existing submodules
                    subModules.forEach(item => {
                        const sub = module.subModules.find(s => s._id === item.subModuleId || s._id === item.id);
                        if (sub) {
                            sub.order = item.order;
                        }
                    });
                    // Sort by order
                    module.subModules.sort((a, b) => a.order - b.order);
                }
            })

            // --- SubModule Reducers ---
            .addCase(getSubModules.fulfilled, (state, action) => {
                const { moduleId, subModules } = action.payload;
                const module = state.modules.find(m => m._id === moduleId);
                if (module) {
                    module.subModules = subModules;
                    module.subModulesLoaded = true; // Flag to prevent refetching if desired
                }
            })

            // Create SubModule
            .addCase(createSubModule.pending, (state) => {
                state.isCreatingSubModule = true;
                state.error = null;
            })
            .addCase(createSubModule.fulfilled, (state, action) => {
                state.isCreatingSubModule = false;
                const subModule = action.payload;
                const module = state.modules.find(m => m._id === subModule.moduleId);
                if (module) {
                    if (!module.subModules) module.subModules = [];
                    module.subModules.push(subModule);
                    module.subModulesCount = (module.subModulesCount || 0) + 1;
                }
            })
            .addCase(createSubModule.rejected, (state, action) => {
                state.isCreatingSubModule = false;
                state.error = action.payload;
            })

            // Update SubModule
            .addCase(updateSubModule.pending, (state) => {
                state.isUpdatingSubModule = true;
                state.error = null;
            })
            .addCase(updateSubModule.fulfilled, (state, action) => {
                state.isUpdatingSubModule = false;
                const updatedSub = action.payload;
                const module = state.modules.find(m => m._id === updatedSub.moduleId);
                if (module && module.subModules) {
                    const index = module.subModules.findIndex(sm => sm._id === updatedSub._id);
                    if (index !== -1) module.subModules[index] = updatedSub;
                }
            })
            .addCase(updateSubModule.rejected, (state, action) => {
                state.isUpdatingSubModule = false;
                state.error = action.payload;
            })

            // Delete SubModule
            .addCase(deleteSubModule.pending, (state) => {
                state.isDeletingSubModule = true;
                state.error = null;
            })
            .addCase(deleteSubModule.fulfilled, (state, action) => {
                state.isDeletingSubModule = false;
                const { subModuleId, moduleId } = action.payload;
                const module = state.modules.find(m => m._id === moduleId);
                if (module && module.subModules) {
                    module.subModules = module.subModules.filter(sm => sm._id !== subModuleId);
                    module.subModulesCount = Math.max(0, (module.subModulesCount || 0) - 1);
                }
            })
            .addCase(deleteSubModule.rejected, (state, action) => {
                state.isDeletingSubModule = false;
                state.error = action.payload;
            })

            // Publish SubModule
            .addCase(publishSubModule.pending, (state) => {
                state.isPublishingSubModule = true;
            })
            .addCase(publishSubModule.fulfilled, (state, action) => {
                state.isPublishingSubModule = false;
                const updatedSub = action.payload;
                const module = state.modules.find(m => m._id === updatedSub.moduleId);
                if (module && module.subModules) {
                    const index = module.subModules.findIndex(sm => sm._id === updatedSub._id);
                    if (index !== -1) module.subModules[index] = updatedSub;
                }
            })
            .addCase(publishSubModule.rejected, (state) => {
                state.isPublishingSubModule = false;
            })

            // Unpublish SubModule
            .addCase(unpublishSubModule.pending, (state) => {
                state.isPublishingSubModule = true;
            })
            .addCase(unpublishSubModule.fulfilled, (state, action) => {
                state.isPublishingSubModule = false;
                const updatedSub = action.payload;
                const module = state.modules.find(m => m._id === updatedSub.moduleId);
                if (module && module.subModules) {
                    const index = module.subModules.findIndex(sm => sm._id === updatedSub._id);
                    if (index !== -1) module.subModules[index] = updatedSub;
                }
            })
            .addCase(unpublishSubModule.rejected, (state) => {
                state.isPublishingSubModule = false;
            })

            // Listen for Assessment Creation to update Module status
            .addCase(createAssessment.fulfilled, (state, action) => {
                let moduleId;
                // Check if the argument is FormData (standard for file uploads)
                if (action.meta.arg instanceof FormData) {
                    moduleId = action.meta.arg.get('moduleId');
                } else {
                    // Fallback if it's a plain object
                    moduleId = action.meta.arg.moduleId;
                }

                const module = state.modules.find(m => m._id === moduleId);
                if (module) {
                    module.hasAssessment = true;
                }
            })
            // Listen for Assessment Deletion to update Module status
            .addCase(deleteAssessment.fulfilled, (state, action) => {
                const { moduleId } = action.payload; // Access the payload returned by thunk
                const module = state.modules.find(m => m._id === moduleId);
                if (module) {
                    module.hasAssessment = false;
                }
            });
    }
});

export const { setModulesOrder, clearModuleError } = moduleSlice.actions;
export default moduleSlice.reducer;
