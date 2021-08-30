import { IContact } from "../../components/interfaces/Contact/IContact";
import { apiExecute } from "../ApiExecute";

export const sendEmailContactUs = (data: IContact): Promise<any> => {
    const sendEmailContactUsURL = `/api/sendquestions`;
    return apiExecute(sendEmailContactUsURL, "POST", data)
}

export const ContactApi = {
    sendEmailContactUs
}