import { apiExecute } from "../apiExecute";
const baseURL = "/";
export const getHomeApi = () => {
    const getURL = `${baseURL}api/home`;
    return apiExecute(getURL, "GET", null);
};
//# sourceMappingURL=HomeApi.js.map