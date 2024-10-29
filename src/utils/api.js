import axios from "axios";
import { AUTH_NOT_REQUIRED_APIS } from "./constants";
import { LOGIN } from "./routes";
import {
  localStorageKey,
  clearAuthOnLogout,
  getLocalStorageData,
  setLocalStorageData,
} from "./storage";

const isAuthRequired = (url) => !AUTH_NOT_REQUIRED_APIS.includes(url);

const getTokenFromStorage = (url) => {
  if (isAuthRequired(url)) {
    if (url === "/refreshtoken") {
      return {
        authorization: `Bearer ${getLocalStorageData(localStorageKey.token)}`,
        isRefreshToken: true,
        refreshToken: `${getLocalStorageData(localStorageKey.refreshToken)}`,
      };
    } else {
      return {
        authorization: `Bearer ${getLocalStorageData(localStorageKey.token)}`,
      };
    }
  }
};

const checkTokenExpiration = (err) =>
  err.response.status === 403 &&
  err.response.data.status === 403 &&
  err.response.data.msg === "Token Expired" &&
  !err.config._retry;

const handleRefreshToken = async () => {
  const newTokenResponse = await api.get("/refreshtoken");
  if (newTokenResponse) {
    setLocalStorageData(localStorageKey.token, newTokenResponse.token);
  }
};

const handleUnauthorizedAccess = (err) => {
  if (
    err.response.data &&
    (err.response.data.status === 500 || err.response.data.status === 501)
  ) {
    //show error
  } else {
    clearAuthOnLogout();
    window.location.href = LOGIN;
  }
};

const api = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use(async (config) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      ...getTokenFromStorage(config.url),
    },
  };
});

api.interceptors.response.use(
  (response) => {
    if (response.data.status === 200) {
      return response.data.data;
    } else {
      return null;
    }
  },
  async (err) => {
    const originalRequest = err.config;
    if (err.response) {
      if (checkTokenExpiration(err)) {
        originalRequest._retry = true;
        await handleRefreshToken();
        return api(originalRequest);
      } else if (err.response.status && err.response.status === 401) {
        handleUnauthorizedAccess(err);
      } else {
        //open notification
      }
    }
    return Promise.reject(err);
  }
);

export default api;
