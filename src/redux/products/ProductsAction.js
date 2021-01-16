import { PRODUCTS_CONSTANTS } from './ProductConstants';

export const fetchAllCategoriesAction = () => ({
  type: PRODUCTS_CONSTANTS.FETCH_CATEGORIES_REQUEST,
});

export const fetchProductsAction = (category) => ({
  type: PRODUCTS_CONSTANTS.FETCH_PRODUCTS_REQUEST,
  payload: { category },
});

export const fetchProductDetailsAction = (productId, action) => ({
  type: PRODUCTS_CONSTANTS.FETCH_PRODUCT_DETAILS_REQUEST,
  payload: { productId, action },
});

export const fetchAllProductsAction = () => ({
  type: PRODUCTS_CONSTANTS.FETCH_ALL_PRODUCTS_REQUEST,
});

export const mountSearchAction = (flag) => ({
  type: PRODUCTS_CONSTANTS.MOUNT_SEARCH_REQUEST,
  payload: flag,
});

export const fetchAllDistributorsAction = () => ({
  type: PRODUCTS_CONSTANTS.FETCH_ALL_DISTRIBUTORS_REQUEST,
});
