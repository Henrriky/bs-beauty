import { WeekDays } from "../enums/enums"
import { axiosInstance } from "../lib/axios"
import { Shift } from "../store/auth/types"
import { API_VARIABLES } from "./config"

const createShift = async (shift: { weekDay: WeekDays, shiftStart: string, shiftEnd: string, isBusy: boolean }, accessToken: string): Promise<Shift> => {
  console.log(shift);
  const response = await axiosInstance.post<Shift>(API_VARIABLES.SHIFT_ENDPOINTS.FETCH_CREATE_AND_UPDATE, shift, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

const updateShift = async (shift: { shiftStart: string, shiftEnd: string, isBusy: boolean }, id: string, accessToken: string): Promise<Shift> => {
  const response = await axiosInstance.put<Shift>(`${API_VARIABLES.SHIFT_ENDPOINTS.FETCH_CREATE_AND_UPDATE}/${id}`, shift, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

const fetchEmployeeShifts = async (accessToken: string): Promise<{ shifts: Shift[] }> => {
  const response = await axiosInstance.get<{ shifts: Shift[] }>(API_VARIABLES.SHIFT_ENDPOINTS.FETCH_CREATE_AND_UPDATE, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}

export { createShift, updateShift, fetchEmployeeShifts }