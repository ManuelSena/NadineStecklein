import * as React from "react";
import { ContactApi } from "../../api/contact/ContactApi";
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

//init("user_MbPd9vm1ZxvL6l8E3OVlF");


interface IRegisterErrors {
    email: string;
}
export interface IContactUsEntity {
    name: string;
    email: string;
    topic: string;
    message: string;
}
export interface IContactUsState {
    contactUsEntity: IContactUsEntity;
    isEmailValid: boolean;
    formErrors: IRegisterErrors;
    isVisible: boolean;
}
export class ContactItem extends React.Component<{}, IContactUsState>{
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
        }
        this.onFieldChange = this.onFieldChange.bind(this);
        this.sendButtonClick = this.sendButtonClick.bind(this);
        this.validateField = this.validateField.bind(this);
    }

    private onFieldChange(fieldName: string, fieldValue: string) {
        const nextState = {
            ...this.state,
            contactUsEntity: {
                ...this.state.contactUsEntity,
                [fieldName]: fieldValue
            }
        }
        this.setState(nextState, () => { this.validateField(fieldName, fieldValue) });
    }

    private validateField(fieldName: any, fieldValue: any) {
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

    private sendButtonClick(e) {
        e.preventDefault();
        //Object.keys(this.state.contactUsEntity).forEach((itm) => {
        //    this.validateField(); // (itm, this.state.contactUsEntity[itm]);
        //})
        //console.log(this.state)
        //if (this.state.isEmailValid == true) {
        //ContactApi.sendEmailContactUs(this.state.contactUsEntity)
        emailjs.sendForm('service_d5e62yl', 'template_xxtj9en', e.target,'user_MbPd9vm1ZxvL6l8E3OVlF')
                .then((response) => {
                    toastr.success("email sent");
                    this.setState({
                        ...this.state,
                        contactUsEntity: {
                            name: "",
                            email: "",
                            topic: "",
                            message: ""
                        }
                    })
                })
                .catch((err) => {
                   console.log(err.response.data);
                });
        //} else (toastr.error("Please use Valid Email"))
    }
    public render() {
        const buttonStyle: React.CSSProperties = {
            color: "black",
        };


        return (
            <motion.div animate={{ }}>
                <form action="#" method="post" className="tg-commentform contact-form" id="tg-commentform" onSubmit={this.sendButtonClick }>
                        <div style={{ alignContent: "center"}}className="contact form-group">
                            <motion.div className="contactheader"
                                        animate={{ x:-10 }}
                                        transition={{ ease: "easeIn", duration: 1.5 }}
                                       >
                            <div className="tg-section-title"><h1>CONTACT NADINE</h1></div>
                            <div className="tg-section-heading"><h2>Queries, Suggestion &amp; Remarks? </h2></div>
                            </motion.div>
                            <AnimatePresence>
                            <Box className="contact">
                                <motion.div 
                                        animate={{ y: 10 }}
                                        transition={{ ease: "easeOut", duration: 1.5 }}
                                       ><h3>Campaign contact information</h3>
                                            <p>Phone: 509-731-4172  </p>
                                            <p> electnadine@gmail.com</p>
                                            <p>www.nadinestecklein.com</p>
                                            <p>  PO Box 334</p>
                                            <p>  College Place, WA 99324</p>
                                        </motion.div>
                                    </Box>
                            </AnimatePresence>
                                  <div className="contact">
                            <Input type="text" placeholder="Name*" className="form-control" name="name" value={this.state.contactUsEntity.name} onChange={this.onFieldChange}></Input>
                  
                                <Input type="email" placeholder="Email*" className="form-control" name="email" value={this.state.contactUsEntity.email} onChange={this.onFieldChange}></Input>
                                <Input type="text" placeholder="Topic*" className="form-control" name="topic" value={this.state.contactUsEntity.topic} onChange={this.onFieldChange}></Input>
                              
                                    <Textarea placeholder="Message*" name="message" value={this.state.contactUsEntity.message} onChange={this.onFieldChange} rows={8} ></Textarea>
                                    <button type="submit" style={buttonStyle} className="tg-btn submit-now">SEND</button>
                            </div>
                        </div>
                </form>
            </motion.div>
        )
    }
}
