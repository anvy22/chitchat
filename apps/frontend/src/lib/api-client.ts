import axios from "axios";

// Create an Axios instance
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1",
  withCredentials: true, // Important for sending/receiving the HTTP-only refresh token cookie
});

// A variable to store the in-memory access token
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

// Request Interceptor: Attach the access token to headers
apiClient.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Unauthorized and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't retried this request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token using the HTTP-only cookie
        const response = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newAccessToken = response.data.data.accessToken;
        
        // Update in-memory token
        setAccessToken(newAccessToken);

        // Update the original request's authorization header and retry
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails (e.g., cookie expired or invalid), clear the token
        setAccessToken(null);
        
        // You might want to trigger a global event here to force the user to the login screen
        // window.dispatchEvent(new Event('auth:unauthorized'));
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
