import respawnAPI from "./axiosInstance";

export const searchGames = async ({ page_size, search }) => {
	const { data } = await respawnAPI.get("/game/search", { params: { page_size, search } })
	return data
}