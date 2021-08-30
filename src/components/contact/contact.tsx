import * as React from "react";
import { ContactApi } from "../../api/contact/ContactApi";
import { Input, Textarea, Button } from "../../common/form/index";
import { IContact } from "../interfaces/Contact/IContact";
import { motion } from "framer-motion";

export interface IContactUsState {
    contactUs: IContact;
}

export class Contact extends React.Component<{}, IContactUsState> {
    constructor(props) {
        super(props);
        this.state = {
            contactUs: {
                name: "",
                email: "",
                topic: "",
                message: ""
            }
        }

        //bind
        this.onFieldChange = this.onFieldChange.bind(this);
        this.sendEmailButtonClick = this.sendEmailButtonClick.bind(this);
    }

    private onFieldChange(fieldName: string, fieldValue: string) {

        const nextState = {
            ...this.state,
            contactUs: {
                ...this.state.contactUs,
                [fieldName]: fieldValue
            }
        }
        this.setState(nextState); //, () => { this.validateField(fieldName, fieldValue) });
    }

    private sendEmailButtonClick() {

        ContactApi.sendEmailContactUs(this.state.contactUs)

            .then((response) => {

                this.setState({

                    ...this.state,
                    contactUs: {
                        name: "",
                        email: "",
                        topic: "",
                        message: ""
                    }

                })
            })

            .catch((err) => {
                console.log(err);
            })

    }


    public render() {
        return (
            <div className="col-md-6 col-sm-12 col-xs-12">

                <form action="#" className="tg-commentform help-form" id="tg-commentform">
                    <fieldset>
                        <div className="form-group container">
                            <motion.div
                                animate={{ x: 100 }}
                                transition={{ ease: "easeOut", duration: 1 }}
                            >Contact Nadine</motion.div>

                            {/*<p><strong style={{ color: "red" }} className="contactus">NOTE:</strong> Please use this <a className="contactus" href="mailto:Manny@elicit.us">Contact Us HERE</a>. We'd be stoked to hear from you!</p>*/}

                            <div className="form-group">
                               
                                <Input
                                    type="text"
                                    label="Name"
                                    name="name"
                                    value={this.state.contactUs.name}
                                    placeholder="Name"
                                    onChange={this.onFieldChange}></Input>


                                <div className="form-group">
                                    <Input
                                        type="text"
                                        label="Topic"
                                        name="topic"
                                        value={this.state.contactUs.topic}
                                        placeholder="Subject"
                                        onChange={this.onFieldChange}></Input>
                                </div>
                                <div className="form-group">
                                    <Input
                                        label="Email"
                                        name="email"
                                        value={this.state.contactUs.email}
                                        placeholder="Email"
                                        onChange={this.onFieldChange}></Input>
                                </div>
                                <div className="form-group">
                                    <Textarea
                                        label="Message"
                                        name="message"
                                        value={this.state.contactUs.message}
                                        placeholder="Enter Your Message"
                                        onChange={this.onFieldChange}>
                                        rows={8}</Textarea>
                                </div>
                                <div className="form-group">
                                    <Button
                                        label="Subject"
                                        className="subject"
                                        onClick={this.sendEmailButtonClick}
                                    >Send</Button>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </form>
            </div>
        )
    }

}