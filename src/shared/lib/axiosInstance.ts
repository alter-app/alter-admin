import axios from 'axios'
import { useAuthStore } from '../stores/useAuthStore'

const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(
  config => {
    const { token, authorizationId } = useAuthStore.getState()
    if (token) config.headers.Authorization = `Bearer ${token}`
    if (authorizationId) config.headers.authorizationId = authorizationId
    return config
  },
  error => Promise.reject(error)
)

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
