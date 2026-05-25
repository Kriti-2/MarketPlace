import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async Thunks for catalog
export const fetchProducts = createAsyncThunk('products/fetchProducts', async (queryParams = {}, { rejectWithValue }) => {
  try {
    const { keyword = '', category = '', rating = '', minPrice = '', maxPrice = '', sortBy = '' } = queryParams;
    const url = `/api/products?keyword=${keyword}&category=${category}&rating=${rating}&minPrice=${minPrice}&maxPrice=${maxPrice}&sortBy=${sortBy}`;
    
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch products');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const fetchProductDetails = createAsyncThunk('products/fetchProductDetails', async (id, { rejectWithValue }) => {
  try {
    const response = await fetch(`/api/products/${id}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to fetch product details');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createReview = createAsyncThunk('products/createReview', async ({ id, rating, comment }, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch(`/api/products/${id}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify({ rating, comment }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to add review');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Admin Thunks
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch(`/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete product');
    return id;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const createProduct = createAsyncThunk('products/createProduct', async (productData, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create product');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateProduct = createAsyncThunk('products/updateProduct', async ({ id, ...productData }, { getState, rejectWithValue }) => {
  try {
    const { auth: { userInfo } } = getState();
    const response = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to update product');
    return data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

const initialState = {
  products: [],
  product: { reviews: [] },
  loading: false,
  detailLoading: false,
  reviewLoading: false,
  error: null,
  reviewError: null,
  success: false, // flag for delete/create/update operations
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    resetProductStatus: (state) => {
      state.success = false;
      state.error = null;
      state.reviewError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Product Details
      .addCase(fetchProductDetails.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.reviewLoading = true;
        state.reviewError = null;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.reviewLoading = false;
        state.success = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.reviewLoading = false;
        state.reviewError = action.payload;
      })
      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.product = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.products = state.products.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetProductStatus } = productSlice.actions;
export default productSlice.reducer;
