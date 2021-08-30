import * as React from "react";
import { DonateModal } from "./donateModal";
export class Donate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            donateModelDisplayItems: []
        };
        this.modalToggle = this.modalToggle.bind(this);
        this.onClose = this.onClose.bind(this);
    }
    //public componentDidMount() {
    //    this.loadDataList();
    //}
    modalToggle() {
        this.setState({ showModal: !this.state.showModal });
    }
    onClose() {
        this.setState({ showModal: !this.state.showModal });
    }
    //private loadDataList() {
    //    PrivatePolicyApi.getPrivatePolicyList()
    //        .then((response) => {
    //            this.setState({ privatePoliciesDisplayItems: response.items });
    //            console.log(response)
    //        })
    //        .catch((err) => { console.log("error!", err); })
    //}
    render() {
        return (React.createElement("div", null,
            React.createElement("button", { onClick: this.modalToggle, className: "donate" }, "DONATE"),
            React.createElement(DonateModal, { showModal: this.state.showModal, onClose: this.onClose })));
    }
}
//# sourceMappingURL=donate.js.map