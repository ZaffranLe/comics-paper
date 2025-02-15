import AxiosInstance from "../components/AxiosInstance";
import { hasToken } from "../utils/TokenManager";

export async function postRegister({
  username,
  password,
  email,
}: {
  username: string;
  password: string;
  email: string;
}) {
  return AxiosInstance.post(`/users/signup`, {
    username,
    password,
    email,
  });
}

export interface PostLoginParams {
  username: string;
  password: string;
}

async function postLogin({ username, password }: PostLoginParams) {
  return AxiosInstance.post("/users/signin", {
    username,
    password,
  });
}

async function postProfile() {
  if (!hasToken()) {
    throw new Error(`Token is required when request post into profile.`);
  }

  return AxiosInstance.get("/users/profile");
}

export default {
  postRegister,
  postLogin,
  postProfile,
};
