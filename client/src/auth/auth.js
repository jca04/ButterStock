import axios from "axios";

export const getToken = () => {
  return localStorage.getItem("auth");
};

export const isAuthenticated = () => {
  const token = getToken();
  if (token) return true;
  return false;
};

export const setToken = (token) => {
  localStorage.setItem("auth", token);
};

export const removeToken = () => {
  localStorage.removeItem("auth");
};

export const AxioInterceptor = () => {
  axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        removeToken();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};
