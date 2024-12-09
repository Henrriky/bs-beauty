import { axiosInstance } from "../lib/axios"
import { Employee } from "../store/auth/types"
import { API_VARIABLES } from "./config"

const fetchEmployees = async (token: string): Promise<{ employees: Employee[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const response = await axiosInstance.get<{ employees: Employee[] }>(
    API_VARIABLES.EMPLOYEE_ENDPOINTS,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return response.data
}

const deleteEmployee = async (id: string, token: string): Promise<any> => {
  const response = await axiosInstance.delete(`${API_VARIABLES.EMPLOYEE_ENDPOINTS}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const insertEmployee = async (email: string, token: string): Promise<Employee> => {
  const response = await axiosInstance.post<Employee>(
    API_VARIABLES.EMPLOYEE_ENDPOINTS,
    { email },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export {
  fetchEmployees,
  deleteEmployee,
  insertEmployee
}