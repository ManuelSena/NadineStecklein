import { apiExecute } from "../ApiExecute";
export const sendEmailContactUs = (data) => {
    const sendEmailContactUsURL = `/api/sendquestions`;
    return apiExecute(sendEmailContactUsURL, "POST", data);
};
export const ContactApi = {
    sendEmailContactUs
};
//# sourceMappingURL=ContactApi.js.map