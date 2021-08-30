import { apiExecute } from "../../../src/api/apiExecute";
const baseURL = "/";
export const getAboutUs = () => {
    const getURL = `${baseURL}api/aboutus`;
    return apiExecute(getURL, "GET", null);
};
export const postAboutUs = (data) => {
    const postURL = `/api/aboutus`;
    return apiExecute(postURL, "POST", data);
};
export const updateAboutUs = (data) => {
    const putURL = `${baseURL}api/aboutus/${data.id}`;
    return apiExecute(putURL, "PUT", data);
};
export const deleteAboutUs = (data) => {
    const deleteURL = `${baseURL}api/aboutus/${data}`;
    return apiExecute(deleteURL, "DELETE", data);
};
//# sourceMappingURL=AboutApi.js.map