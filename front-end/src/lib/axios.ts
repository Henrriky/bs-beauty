import axios from 'axios'
import { API_VARIABLES } from '../api/config'

const axiosInstance = axios.create({
  baseURL: API_VARIABLES.BASE_URL,
})

export { axiosInstance }
