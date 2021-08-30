import axios from "axios";

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export const apiExecute = (url: string, action: string, data: any): Promise<any> => {

    switch (action) {
        case "GET":
            return axios.get(url, { withCredentials: true })
                .then((response) => (response.data), (err) => {
                    return Promise.reject(err);
                })
                .catch((err) => {
                    console.log("catch err", err);
                    return Promise.reject(err);
                });
        case "POST":
            return axios.post(url, data, { withCredentials: true })
                .then((response) => (response.data), (err) => {
                    return Promise.reject(err);
                })
                .catch((err) => {
                    console.log("catch err", err);
                    return Promise.reject(err);
                });
        case "PUT":
            return axios.put(url, data, { withCredentials: true })
                .then((response) => (response.data), (err) => {
                    return Promise.reject(err);
                })
                .catch((err) => {
                    console.log("catch err", err);
                    return Promise.reject(err);
                });
        case "DELETE":
            return axios.delete(url, { withCredentials: true })
                .then((response) => (response.data), (err) => {
                    return Promise.reject(err);
                })
                .catch((err) => {
                    console.log("catch err", err);
                    return Promise.reject(err);
                });
    }
}