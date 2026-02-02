import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import keycloak from '../keycloak';

console.log('Base URL:', import.meta.env.VITE_API_URL);
const apiConfig = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let isToken = false;

const handleTokenExpired = async (accessToken) => {
  const { exp } = jwtDecode(accessToken);
  let expiredTimer;

  window.clearTimeout(expiredTimer);
  const currentTime = Date.now();
  const timeLeft = exp * 1000 - currentTime;
  if (!isToken) {
    expiredTimer = window.setTimeout(() => {
      // localStorage.removeItem('userSession');
      // keycloak.logout();
    }, timeLeft);
    isToken = true;
  }
};

apiConfig.interceptors.request.use(
  async (config) => {
    // const userSession = localStorage.getItem('userSession');
    // if (userSession) {
    //   handleTokenExpired(JSON.parse(userSession).accessToken);
    //   config.headers.Authorization = `Bearer ${JSON.parse(userSession).accessToken}`;
    // }
    // return config;

    if (keycloak?.token) {
      try {
        await keycloak.updateToken(30);
      } catch (err) {
        console.log("Token refresh failed", err);
        // keycloak.logout();
      }

      handleTokenExpired(keycloak?.token);
      // config.headers.Authorization = `Bearer ${keycloak?.token}`;
      config.headers.Authorization = `Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIzaHEzS3NES19GVXYwMVNiSUpnNU1FODJTZmtzeHBrVExKb2NIMXZZOElJIn0.eyJleHAiOjE3NTk2NzUyMzgsImlhdCI6MTc1OTY3NDkzOCwianRpIjoidHJydGNjOmU1ZjA0ZjlmLTM5YTctNGE5YS1iNzQ5LWZjNWVlOGE0OTFiMiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODE4OC9yZWFsbXMvQkxPRyIsImF1ZCI6WyJyZWFsbS1tYW5hZ2VtZW50IiwiYWNjb3VudCJdLCJzdWIiOiI3Mzc1NTA1ZS01YzFhLTQ3MDctYTYzMC05MjEzNTUwZDkwMjgiLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJibG9nX2NsaWVudF9iZSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiLyoiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iLCJkZWZhdWx0LXJvbGVzLWJsb2ciXX0sInJlc291cmNlX2FjY2VzcyI6eyJyZWFsbS1tYW5hZ2VtZW50Ijp7InJvbGVzIjpbInZpZXctcmVhbG0iLCJ2aWV3LWlkZW50aXR5LXByb3ZpZGVycyIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwicmVhbG0tYWRtaW4iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sInNjb3BlIjoicHJvZmlsZSBlbWFpbCIsImNsaWVudEhvc3QiOiIxNzIuMTcuMC4xIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJzZXJ2aWNlLWFjY291bnQtYmxvZ19jbGllbnRfYmUiLCJjbGllbnRBZGRyZXNzIjoiMTcyLjE3LjAuMSIsImNsaWVudF9pZCI6ImJsb2dfY2xpZW50X2JlIn0.PuXLcq-8qIefCEzj4aMycpvGv4tTsU66tItayqlPuajc7nCgeTgGkI_L1ypfCy9e7NRqmZytE1Z0qwXkM4BtdFWCsYTIulttD8zH1Zd7NzR9KYxEnSJpPxhnobIsc1MSGKZCgn5PZnJcXtDjWapiDo6mELg8FzwpJwNbHnDplavASwT-QKysZnEslMD3r9UTi8WojtuwONikjrpz7e8H0VZkwlXXqVpbw1k78f93QWc1oVCCgYxQmm2wv92YFhmhXAYxwp6sLxZgQ3hxh2M38XFJHkHfl5B_ggJEFDoUNNXHh5sh0V8OmzpylydCk7ER_V9YHhKH-27K1dM6-4e-wQ`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const API = {
  get: async (url, params = {}) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (!url) {
        throw new Error('URL is required for GET request');
      }
      const response = await apiConfig.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data = {}) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (!url) {
        throw new Error('URL is required for POST request');
      }
      const response = await apiConfig.post(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  postForm: async (url, data = {}) => {
    if (!url) throw new Error("URL is required for POST request");
    const formData = new FormData();
    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });
    const response = await apiConfig.post(url, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },


  put: async (url, data = {}) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (!url) {
        throw new Error('URL is required for PUT request');
      }
      const response = await apiConfig.put(url, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url) => {
    // eslint-disable-next-line no-useless-catch
    try {
      if (!url) {
        throw new Error('URL is required for DELETE request');
      }

      const response = await apiConfig.delete(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

export default apiConfig;
