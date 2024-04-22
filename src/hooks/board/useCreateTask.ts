import axios from "axios";
import { getAuthorizationHeader } from "../../utils/getAuthorizationHeader";

export interface TaskData {
  name: string;
  description: string;
  boardId: number;
  flagId: number;
  startDate: string;
  endDate: string;
}

export interface ApiResponse {
  status: boolean;
  data: {
    id: number;
    createdUserId: number;
    name: string;
    description: string;
    code: number;
    boardId: number;
    flagId: number;
    order: number;
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    deletedUserId: number | null;
  };
}

export const useCreateTask = () => {
  const createTask = async (taskData: TaskData): Promise<ApiResponse> => {
    try {
      const response = await axios.post<ApiResponse>(
        process.env.NEXT_PUBLIC_API_URL + "/tasks",
        taskData,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthorizationHeader(),
          },
        }
      );

      return response.data;
    } catch (error) {
      // Hata durumunda burada işlemler yapılabilir, örneğin hata loglanabilir veya kullanıcıya bildirilebilir.
      console.error("Task oluşturma işlemi başarısız oldu:", error);
      throw error;
    }
  };

  return { createTask };
};
