import * as React from "react";
import * as toastr from "toastr";
//import { Validation } from "../../../common/components/Validation";
//import { IError } from "../../../interfaces";
//import { ContactApi } from "../../api/contact/ContactApi";
import { Input, Textarea } from "../../common/form/index";
import emailjs from 'emailjs-com';
import { init } from 'emailjs-com';
import { AnimatePresence, motion } from "framer-motion";
import { Box } from "@material-ui/core";
init("user_MbPd9vm1ZxvL6l8E3OVlF");
export class ContactItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contactUsEntity: {
                name: "",
                email: "",
                topic: "",
                message: ""
            },
            formErrors: {
                email: ""
            },
            isEmailValid: false,
            isVisible: false
        };
        this.onFieldChange = this.onFieldChange.bind(this);
        this.sendButtonClick = this.sendButtonClick.bind(this);
        this.validateField = this.validateField.bind(this);
    }
    onFieldChange(fieldName, fieldValue) {
        const nextState = Object.assign(Object.assign({}, this.state), { contactUsEntity: Object.assign(Object.assign({}, this.state.contactUsEntity), { [fieldName]: fieldValue }) });
        this.setState(nextState, () => { this.validateField(fieldName, fieldValue); });
    }
    validateField(fieldName, fieldValue) {
        //let isEmailValid = this.state.isEmailValid;
        //let errorMessage = this.state.formErrors;
        //switch (fieldName) {
        //    case "email":
        //        let emailErrMsg: IError = Validation.validateEmail(fieldValue);
        //        isEmailValid = !emailErrMsg.isNotValid;
        //        errorMessage.email = emailErrMsg.errMsg;
        //        break;
        //}
        //this.setState({
        //    isEmailValid: isEmailValid
        //})
    }
    sendButtonClick(e) {
        e.preventDefault();
        //Object.keys(this.state.contactUsEntity).forEach((itm) => {
        //    this.validateField(); // (itm, this.state.contactUsEntity[itm]);
        //})
        //console.log(this.state)
        //if (this.state.isEmailValid == true) {
        //ContactApi.sendEmailContactUs(this.state.contactUsEntity)
        emailjs.sendForm('service_d5e62yl', 'template_xxtj9en', e.target, 'user_MbPd9vm1ZxvL6l8E3OVlF')
            .then((response) => {
            toastr.success("email sent");
            this.setState(Object.assign(Object.assign({}, this.state), { contactUsEntity: {
                    name: "",
                    email: "",
                    topic: "",
                    message: ""
                } }));
        })
            .catch((err) => {
            console.log(err.response.data);
        });
        //} else (toastr.error("Please use Valid Email"))
    }
    render() {
        const buttonStyle = {
            color: "black",
        };
        return (React.createElement(motion.div, { animate: {} },
            React.createElement("form", { action: "#", method: "post", className: "tg-commentform contact-form", id: "tg-commentform", onSubmit: this.sendButtonClick },
                React.createElement("div", { style: { alignContent: "center" }, className: "contact form-group" },
                    React.createElement(motion.div, { className: "contactheader", animate: { x: -10 }, transition: { ease: "easeIn", duration: 1.5 } },
                        React.createElement("div", { className: "tg-section-title" },
                            React.createElement("h1", null, "CONTACT NADINE")),
                        React.createElement("div", { className: "tg-section-heading" },
                            React.createElement("h2", null, "Queries, Suggestion & Remarks? "))),
                    React.createElement(AnimatePresence, null,
                        React.createElement(Box, { className: "contact" },
                            React.createElement(motion.div, { animate: { y: 10 }, transition: { ease: "easeOut", duration: 1.5 } },
                                React.createElement("h3", null, "Campaign contact information"),
                                React.createElement("p", null, "Phone: 509-731-4172  "),
                                React.createElement("p", null, " electnadine@gmail.com"),
                                React.createElement("p", null, "www.nadinestecklein.com"),
                                React.createElement("p", null, "  PO Box 334"),
                                React.createElement("p", null, "  College Place, WA 99324")))),
                    React.createElement("div", { className: "contact" },
                        React.createElement(Input, { type: "text", placeholder: "Name*", className: "form-control", name: "name", value: this.state.contactUsEntity.name, onChange: this.onFieldChange }),
                        React.createElement(Input, { type: "email", placeholder: "Email*", className: "form-control", name: "email", value: this.state.contactUsEntity.email, onChange: this.onFieldChange }),
                        React.createElement(Input, { type: "text", placeholder: "Topic*", className: "form-control", name: "topic", value: this.state.contactUsEntity.topic, onChange: this.onFieldChange }),
                        React.createElement(Textarea, { placeholder: "Message*", name: "message", value: this.state.contactUsEntity.message, onChange: this.onFieldChange, rows: 8 }),
                        React.createElement("button", { type: "submit", style: buttonStyle, className: "tg-btn submit-now" }, "SEND"))))));
    }
}
//# sourceMappingURL=contactItem.js.map