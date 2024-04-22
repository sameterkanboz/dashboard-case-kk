import Cookies from "js-cookie";
import { authService } from "../../services";
import { User } from "../../types/user";

export const useRegister = () => {
  const register = async (
    email: string,
    password: string,
    fullName: string
  ) => {
    const user = await authService.register(email, password, fullName);

    if (user) {
      Cookies.set("currentUser", JSON.stringify(user));
    }
    return user as User;
  };

  return { register };
};
