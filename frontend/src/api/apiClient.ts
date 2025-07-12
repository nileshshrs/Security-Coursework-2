import axios from "axios";
import { queryClient } from "../main";
import { navigate } from "@/utils/navigate";

const options = {
    baseURL: "https://localhost:6278/api/v1",
    withCredentials: true,
};

const API = axios.create(options);

const TokenRefreshClient = axios.create(options);
TokenRefreshClient.interceptors.response.use(
    (response) => {
        // console.log(response);
        return response.data; // Return only the response data
    },
)
// Interceptor for responses
API.interceptors.response.use(
    (response) => {
        // console.log(response)
        // console.log(response.data);
        return response.data; // Return only the response data
    },
    async (error) => {
        const { config, response } = error
        const { status, data } = response || {};

        console.error("Interceptor caught error:", status, data);

        if (status === 401 && data?.errorCode === "InvalidAccessToken") {
            try {
                await TokenRefreshClient.post("/auth/refresh")
                return TokenRefreshClient(config)
            } catch (err) {
                localStorage.removeItem("user")
                window.location.reload();
                navigate("/sign-in", { replace: true })
                queryClient.clear();
                throw new Error("Token refresh failed")
            }
        }

        // Propagate error to calling function
        return Promise.reject({ status, ...data });
    }
);

export default API;