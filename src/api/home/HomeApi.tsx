import { apiExecute } from "../apiExecute";
import { IHome } from "../../components/interfaces/home/IHome";

const baseURL = "/";

export const getHomeApi = (): Promise<any> => {
    const getURL = `${baseURL}api/home`;
    return apiExecute(getURL, "GET", null)
}