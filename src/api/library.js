import respawnAPI from "./axiosInstance";

export const createLibrary = async (rawgId) => {
    const { data } = await respawnAPI.post("/library/addGame", { rawgId })
    return data
}

export const getLibrary = async () => {
    const { data } = await respawnAPI.get('/library');
    return data
}

export const deleteLibrary = async (id) => {
    const { data } = await respawnAPI.delete(`/library/removeLibrary/${id}`);
    return data;
}
export const updateLibrary = async (id, { status, likes, dislikes, journal }) => {
    const { data } = await respawnAPI.put(`/library/updateLibrary/${id}`,
        {
            status,
            likes,
            dislikes,
            journal,
        });
    return data;
}