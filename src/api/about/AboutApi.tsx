import { apiExecute } from "../../../src/api/apiExecute";
import { IAbout } from "../../components/interfaces/about/IAbout";

const baseURL = "/";

export const getAboutUs = (): Promise<any> => {
    const getURL = `${baseURL}api/aboutus`;
    return apiExecute(getURL, "GET", null)
}

export const postAboutUs = (data: IAbout): Promise<any> => {
    const postURL = `/api/aboutus`;
    return apiExecute(postURL, "POST", data)
}

export const updateAboutUs = (data: IAbout): Promise<any> => {
    const putURL = `${baseURL}api/aboutus/${data.id}`;
    return apiExecute(putURL, "PUT", data)
}

export const deleteAboutUs = (data: number): Promise<any> => {
    const deleteURL = `${baseURL}api/aboutus/${data}`;
    return apiExecute(deleteURL, "DELETE", data)
}
