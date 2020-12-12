import api from './API';

/**
 * @author Papu Kumar
 * @param {string} url - API Endpoint
 * @async
 * @description function for GET type API
 */
export const getAPIData = async (url) => {
  try {
    const response = await api.get(url);
    return {
      type: 'response',
      status: true,
      payload: response.data,
    };
  } catch (err) {
    return {
      type: 'error',
      status: false,
      payload: err?.response || { message: err?.message },
    };
  }
};

/**
 * @author Papu Kumar
 * @description function for POST type API
 */
export const postAPIData = async (url, data) => {
  try {
    const response = await api.post(url, { ...data });
    return {
      type: 'response',
      status: true,
      payload: response.data,
    };
  } catch (err) {
    return {
      type: 'error',
      status: false,
      payload: err?.response || { message: err?.message },
    };
  }
};

/**
 * @author Papu Kumar
 * @description function for PUT type API
 */
export const putAPIData = async (url, data) => {
  try {
    const response = await api.put(url, { ...data });
    return {
      type: 'response',
      status: true,
      payload: response.data,
    };
  } catch (err) {
    return {
      type: 'error',
      status: false,
      payload: err?.response || { message: err?.message },
    };
  }
};
