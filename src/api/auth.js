import authFetch from "./axiosInstance";


export const signup = async (email, username, password) => {
    try {
        const { data } = await authFetch.post("/auth/signup",
            {
                email,
                username,
                password,
            }
        ); console.log(data);
        return data
    } catch (error) {
        console.error(error);
    }
}


export const signin = async (username, password) => {
    try {
        const { data } = await authFetch.post('/auth/signin',
            {
                username,
                password,
            }
        ); console.log(data);
        return data
    } catch (error) {
        console.error(error);
    }
} 