import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { paymentAPI } from '../../utils/api';

// Async Thunks
export const getKey = createAsyncThunk(
    'payment/getKey',
    async (_, { rejectWithValue }) => {
        try {
            const response = await paymentAPI.getKey();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch key');
        }
    }
);

export const createOrder = createAsyncThunk(
    'payment/createOrder',
    async ({ courseId }, { rejectWithValue }) => {
        try {
            const response = await paymentAPI.createOrder(courseId);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create order');
        }
    }
);

export const verifyPayment = createAsyncThunk(
    'payment/verifyPayment',
    async (paymentData, { rejectWithValue }) => {
        try {
            const response = await paymentAPI.verifyPayment(paymentData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Payment verification failed');
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        loading: false,
        error: null,
        key: null,
        order: null,
        paymentSuccess: false,
    },
    reducers: {
        resetPaymentState: (state) => {
            state.loading = false;
            state.error = null;
            state.order = null;
            state.paymentSuccess = false;
        }
    },
    extraReducers: (builder) => {
        // Get Key
        builder.addCase(getKey.fulfilled, (state, action) => {
            state.key = action.payload.key;
        });

        // Create Order
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.order = action.payload.order;
        });
        builder.addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });

        // Verify Payment
        builder.addCase(verifyPayment.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(verifyPayment.fulfilled, (state) => {
            state.loading = false;
            state.paymentSuccess = true;
        });
        builder.addCase(verifyPayment.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
            state.paymentSuccess = false;
        });
    }
});

export const { resetPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
