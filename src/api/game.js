import respawnAPI from "./axiosInstance";

export const searchGames = async ({ page_size, search }) => {
  const { data } = await respawnAPI.get("/game/search", {
    params: { page_size, search },
  });
  return data;
};

export const discoverGames = async ({ type }) => {
  const { data } = await respawnAPI.get("/game/discover", { params: { type } });
  return data;
};
