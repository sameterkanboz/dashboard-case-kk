import axios, { AxiosInstance } from "axios";
import { getAuthorizationHeader } from "../utils/getAuthorizationHeader";

export class AuthService {
  protected readonly instance: AxiosInstance;
  public constructor(url: string) {
    this.instance = axios.create({
      baseURL: url,
      timeout: 30000,
      timeoutErrorMessage: "Time out!",
    });
  }

  login = (email: string, password: string) => {
    return this.instance
      .post("/login", {
        email,
        password,
      })
      .then((res) => {
        return {
          status: res.data.status,
          data: {
            id: res.data.data.id,
            fullName: res.data.data.fullName,
            email: res.data.data.email,
            token: res.data.data.token,
          },
        };
      });
  };

  register = (email: string, password: string, fullName: string) => {
    return this.instance
      .post("/register", {
        email,
        password,
        fullName,
      })
      .then((res) => {
        return {
          status: res.data.status,
          data: {
            id: res.data.data.id,
            fullName: res.data.data.fullName,
            email: res.data.data.email,
            token: res.data.data.token,
          },
        };
      });
  };

  getBoards = () => {
    return this.instance
      .get("/boards", {
        headers: getAuthorizationHeader(),
      })
      .then((res) => {
        return res.data;
      });
  };
}
