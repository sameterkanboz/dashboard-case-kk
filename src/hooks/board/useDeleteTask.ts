import axios from "axios";
import { getAuthorizationHeader } from "../../utils/getAuthorizationHeader";
export const useDeleteTask = () => {
  const deleteTask = async (taskCode: number | undefined) => {
    try {
      const response = await axios.delete(
        process.env.NEXT_PUBLIC_API_URL + `/tasks/${taskCode}`,
        {
          headers: {
            "Content-Type": "application/json",
            ...getAuthorizationHeader(),
          },
        }
      );
      return response.status;
    } catch (error) {
      console.error("Task silme işlemi başarısız oldu:", error);
      alert("Task silme işlemi başarısız oldu");
      throw error;
    }
  };
  return { deleteTask };
};
