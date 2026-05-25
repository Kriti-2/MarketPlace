import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const createOrder = createAsyncThunk('orders/createOrder', async (orderData, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(orderData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to place order');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchOrderDetails = createAsyncThunk('orders/fetchOrderDetails', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch(`/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load order details');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const payOrder = createAsyncThunk('orders/payOrder', async ({ id, paymentResult }, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch(`/api/orders/${id}/pay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(paymentResult),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Payment processing failed');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const deliverOrder = createAsyncThunk('orders/deliverOrder', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch(`/api/orders/${id}/deliver`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Fulfillment marking failed');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchMyOrders = createAsyncThunk('orders/fetchMyOrders', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch('/api/orders/myorders', {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load order history');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchAllOrders = createAsyncThunk('orders/fetchAllOrders', async (_, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch('/api/orders', {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to load administrative orders list');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  orders: [],
  orderDetails: null,
  loading: false,
  detailLoading: false,
  payLoading: false,
  error: null,
  success: false,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    resetOrderStatus: (state) => {
      state.success = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderDetails = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Order Details
      .addCase(fetchOrderDetails.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.orderDetails = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Pay Order
      .addCase(payOrder.pending, (state) => {
        state.payLoading = true;
        state.error = null;
      })
      .addCase(payOrder.fulfilled, (state, action) => {
        state.payLoading = false;
        state.success = true;
        state.orderDetails = action.payload;
      })
      .addCase(payOrder.rejected, (state, action) => {
        state.payLoading = false;
        state.error = action.payload;
      })
      // Deliver Order
      .addCase(deliverOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deliverOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.orderDetails = action.payload;
      })
      .addCase(deliverOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Orders (Admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetOrderStatus } = orderSlice.actions;
export default orderSlice.reducer;
