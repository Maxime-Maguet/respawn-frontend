import respawnAPI from "./axiosInstance";

export const signup = async ({ email, username, password }) => {
  const { data } = await respawnAPI.post("/auth/signup",
    {
      email,
      username,
      password,
    }
  );
  return data.data
}

export const signin = async ({ username, password }) => {
  const { data } = await respawnAPI.post('/auth/signin',
    {
      username,
      password,
    }
  );
  return data.data
} 