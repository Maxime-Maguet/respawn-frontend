import axios from "axios";


const authFetch = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' }
});

export default authFetch;