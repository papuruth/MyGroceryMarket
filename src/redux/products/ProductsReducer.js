import { PRODUCTS_CONSTANTS } from './ProductConstants';

const initialState = {
  categories: [],
  categoriesError: {},
  products: [],
  productsError: {},
  productDetails: {},
  allProducts: [],
  allProductsError: {},
  mountSearch: false,
  allDistributors: [],
  allDistributorsError: {},
};

export default function productReducer(state = initialState, action) {
  switch (action.type) {
    case PRODUCTS_CONSTANTS.FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        categories: action.payload.data,
      };
    case PRODUCTS_CONSTANTS.FETCH_CATEGORIES_FAILURE:
      return {
        ...state,
        categories: [],
        categoriesError: action.error,
      };
    case PRODUCTS_CONSTANTS.FETCH_PRODUCTS_REQUEST:
      return {
        ...state,
        products: [],
      };
    case PRODUCTS_CONSTANTS.FETCH_PRODUCTS_SUCCESS:
      return {
        ...state,
        products: action.payload.data,
      };
    case PRODUCTS_CONSTANTS.FETCH_PRODUCTS_FAILURE:
      return {
        ...state,
        productsError: action.error,
      };
    case PRODUCTS_CONSTANTS.FETCH_PRODUCT_DETAILS_REQUEST:
      if (!action?.payload?.action) {
        return {
          ...state,
          productDetails: {},
        };
      }
      return {
        ...state,
      };
    case PRODUCTS_CONSTANTS.FETCH_PRODUCT_DETAILS_SUCCESS:
      return {
        ...state,
        productDetails: action.payload.data,
      };
    case PRODUCTS_CONSTANTS.FETCH_PRODUCT_DETAILS_FAILURE:
      return {
        ...state,
        productDetails: {},
      };
    case PRODUCTS_CONSTANTS.FETCH_ALL_PRODUCTS_SUCCESS:
      return {
        ...state,
        allProducts: action.payload.data,
      };
    case PRODUCTS_CONSTANTS.FETCH_ALL_PRODUCTS_FAILURE:
      return {
        ...state,
        allProductsError: action.error,
      };
    case PRODUCTS_CONSTANTS.MOUNT_SEARCH_SUCCESS:
      return {
        ...state,
        mountSearch: action.payload,
      };
    case PRODUCTS_CONSTANTS.FETCH_ALL_DISTRIBUTORS_SUCCESS:
      return {
        ...state,
        allDistributors: action.payload.data,
        allDistributorsError: {},
      };
    case PRODUCTS_CONSTANTS.FETCH_ALL_DISTRIBUTORS_FAILURE:
      return {
        ...state,
        allDistributors: [],
        allDistributorsError: action.error,
      };
    default:
      return { ...state };
  }
}
