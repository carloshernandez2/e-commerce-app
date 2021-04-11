import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  body: [],
  status: "idle",
  error: null,
  errorCreate: null,
  statusCreate: "idle",
  createdProduct: null,
  errorDelete: null,
  statusDelete: "idle",
  deletedProduct: null,
  categoriesStatus: "idle",
  categories: [],
  categoriesError: null,
  review: null,
  reviewStatus: 'idle',
  reviewError: null
};

export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (params) => {
    const { seller, name, category, order, min, max, rating } = params;
    const minQuery = min ? `min=${min}` : "min=0";
    const sellerQuery = seller ? `&seller=${seller}` : "";
    const nameQuery = name ? `&name=${name}` : "";
    const categoryQuery = category ? `&category=${category}` : "";
    const orderQuery = order ? `&order=${order}` : "";
    const maxQuery = max ? `&max=${max}` : "";
    const ratingQuery = rating ? `&rating=${rating}` : "";
    let url = `/api/products?${minQuery}${sellerQuery}${nameQuery}${categoryQuery}${orderQuery}${maxQuery}${ratingQuery}`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw data.error;
    return data;
  }
);

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (params, { getState }) => {
    const {
      user: { body },
    } = getState();

    const {
      _id,
      name,
      price,
      image,
      category,
      brand,
      countInStock,
      description,
    } = params;

    const url = _id ? `/api/products/${_id}` : "/api/products";
    const method = _id ? "PUT" : "POST";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${body.token}`,
    };
    const main = _id
      ? { name, price, image, category, brand, countInStock, description }
      : {};

    const requestOptions = {
      method,
      headers,
      body: JSON.stringify(main),
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message);
      error.name = response.status + "";
      throw error;
    }
    return data;
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (params, { getState }) => {
    const {
      user: { body },
    } = getState();

    const { _id } = params;

    const url = `/api/products/${_id}`;
    const method = "DELETE";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${body.token}`,
    };

    const requestOptions = {
      method,
      headers,
      body: JSON.stringify({}),
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message);
      error.name = response.status + "";
      throw error;
    }
    return data;
  }
);

export const listCategories = createAsyncThunk(
  "product/listCategories",
  async (params) => {
    let url = `/api/products/categories`;
    const response = await fetch(url);
    const data = await response.json();
    if (!response.ok) throw data.error;
    return data;
  }
);

export const createReviewProduct = createAsyncThunk(
  "product/createReviewProduct",
  async (params, { getState }) => {
    const {
      user: { body }
    } = getState();

    const { productId, review } = params;

    const url = `/api/products/${productId}/reviews`;
    const method = "POST";
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${body.token}`,
    };

    const requestOptions = {
      method,
      headers,
      body: JSON.stringify(review),
    };

    const response = await fetch(url, requestOptions);
    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message);
      error.name = response.status + "";
      throw error;
    }
    return data;
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    resetCreatedProduct(state, action) {
      state.statusCreate = "idle";
      state.errorCreate = null;
      state.createdProduct = {};
    },
    resetDeletedProduct(state, action) {
      state.statusDelete = "idle";
      state.errorDelete = null;
      state.deletedProduct = {};
    },
    resetProductState(state, action) {
      state.status = "idle";
      state.error = null;
      state.body = [];
    },
    resetCategories(state, action) {
      state.categoriesStatus = "idle";
      state.categories = [];
      state.categoriesError = null;
    },
    productReviewReset(state, action) {
      state.reviewStatus = "idle";
      state.review = null;
      state.reviewError = null;
    }
  },
  extraReducers: {
    [fetchProducts.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchProducts.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the array
      state.body = action.payload;
    },
    [fetchProducts.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error;
    },
    [createProduct.pending]: (state, action) => {
      state.statusCreate = "loading";
    },
    [createProduct.fulfilled]: (state, action) => {
      state.statusCreate = "succeeded";
      // Add any fetched posts to the array
      state.createdProduct = action.payload;
    },
    [createProduct.rejected]: (state, action) => {
      state.statusCreate = "failed";
      state.errorCreate = action.error;
    },
    [deleteProduct.pending]: (state, action) => {
      state.statusDelete = "loading";
    },
    [deleteProduct.fulfilled]: (state, action) => {
      state.statusDelete = "succeeded";
      // Add any fetched posts to the array
      state.deletedProduct = action.payload;
    },
    [deleteProduct.rejected]: (state, action) => {
      state.statusDelete = "failed";
      state.errorDelete = action.error;
    },
    [listCategories.pending]: (state, action) => {
      state.categoriesStatus = "loading";
    },
    [listCategories.fulfilled]: (state, action) => {
      state.categoriesStatus = "succeeded";
      // Add any fetched posts to the array
      state.categories = action.payload;
    },
    [listCategories.rejected]: (state, action) => {
      state.categoriesStatus = "failed";
      state.categoriesError = action.error;
    },
    [createReviewProduct.pending]: (state, action) => {
      state.reviewStatus = "loading";
    },
    [createReviewProduct.fulfilled]: (state, action) => {
      state.reviewStatus = "succeeded";
      // Add any fetched posts to the array
      state.review = action.payload;
    },
    [createReviewProduct.rejected]: (state, action) => {
      state.reviewStatus = "failed";
      state.reviewError = action.error;
    },
  },
});

export const productState = (state) => state.product.body;

export const productStatus = (state) => state.product.status;

export const productError = (state) => state.product.error;

export const createdProductState = (state) => state.product.createdProduct;

export const productStatusCreate = (state) => state.product.statusCreate;

export const productErrorCreate = (state) => state.product.errorCreate;

export const deletedProductState = (state) => state.product.deletedProduct;

export const productStatusDelete = (state) => state.product.statusDelete;

export const productErrorDelete = (state) => state.product.errorDelete;

export const singleProductState = (state, id) =>
  state.product.body.find((product) => product._id === id);

export const categoriesState = (state) => state.product.categories;

export const categoriesStatus = (state) => state.product.categoriesStatus;

export const categoriesError = (state) => state.product.categoriesError;

export const productReview = (state) => state.product.review;

export const productReviewStatus = (state) => state.product.reviewStatus;

export const productReviewError = (state) => state.product.reviewError;

export const {
  resetCreatedProduct,
  resetProductState,
  resetDeletedProduct,
  resetCategories,
  productReviewReset
} = productSlice.actions;

export default productSlice.reducer;
