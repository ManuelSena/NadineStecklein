import * as React from "react";
import { ContactApi } from "../../api/contact/ContactApi";
import { Input, Textarea, Button } from "../../common/form/index";
import { motion } from "framer-motion";
export class Contact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            contactUs: {
                name: "",
                email: "",
                topic: "",
                message: ""
            }
        };
        //bind
        this.onFieldChange = this.onFieldChange.bind(this);
        this.sendEmailButtonClick = this.sendEmailButtonClick.bind(this);
    }
    onFieldChange(fieldName, fieldValue) {
        const nextState = Object.assign(Object.assign({}, this.state), { contactUs: Object.assign(Object.assign({}, this.state.contactUs), { [fieldName]: fieldValue }) });
        this.setState(nextState); //, () => { this.validateField(fieldName, fieldValue) });
    }
    sendEmailButtonClick() {
        ContactApi.sendEmailContactUs(this.state.contactUs)
            .then((response) => {
            this.setState(Object.assign(Object.assign({}, this.state), { contactUs: {
                    name: "",
                    email: "",
                    topic: "",
                    message: ""
                } }));
        })
            .catch((err) => {
            console.log(err);
        });
    }
    render() {
        return (React.createElement("div", { className: "col-md-6 col-sm-12 col-xs-12" },
            React.createElement("form", { action: "#", className: "tg-commentform help-form", id: "tg-commentform" },
                React.createElement("fieldset", null,
                    React.createElement("div", { className: "form-group container" },
                        React.createElement(motion.div, { animate: { x: 100 }, transition: { ease: "easeOut", duration: 1 } }, "Contact Nadine"),
                        React.createElement("div", { className: "form-group" },
                            React.createElement(Input, { type: "text", label: "Name", name: "name", value: this.state.contactUs.name, placeholder: "Name", onChange: this.onFieldChange }),
                            React.createElement("div", { className: "form-group" },
                                React.createElement(Input, { type: "text", label: "Topic", name: "topic", value: this.state.contactUs.topic, placeholder: "Subject", onChange: this.onFieldChange })),
                            React.createElement("div", { className: "form-group" },
                                React.createElement(Input, { label: "Email", name: "email", value: this.state.contactUs.email, placeholder: "Email", onChange: this.onFieldChange })),
                            React.createElement("div", { className: "form-group" },
                                React.createElement(Textarea, { label: "Message", name: "message", value: this.state.contactUs.message, placeholder: "Enter Your Message", onChange: this.onFieldChange },
                                    "rows=",
                                    8)),
                            React.createElement("div", { className: "form-group" },
                                React.createElement(Button, { label: "Subject", className: "subject", onClick: this.sendEmailButtonClick }, "Send"))))))));
    }
}
//# sourceMappingURL=contact.js.map