import * as React from "react";
import { IDonateModal } from "../interfaces/Donate/IDonateModal";
import { DonateModal } from "./donateModal";

//"Blueprint" or interface for our Modal State
interface IDonateModalWindowState {
    donateModelDisplayItems: IDonateModal[];
    showModal: boolean;
}

export class Donate extends React.Component<{}, IDonateModalWindowState> {
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

    private modalToggle() {
        this.setState({ showModal: !this.state.showModal })
    }

    private onClose() {
        this.setState({ showModal: !this.state.showModal })
    }
    //private loadDataList() {
    //    PrivatePolicyApi.getPrivatePolicyList()
    //        .then((response) => {
    //            this.setState({ privatePoliciesDisplayItems: response.items });
    //            console.log(response)
    //        })
    //        .catch((err) => { console.log("error!", err); })
    //}




    public render() {
        return (
            <div >
                <button onClick={this.modalToggle} className="donate">DONATE</button>
                <DonateModal
                    showModal={this.state.showModal}
                    onClose={this.onClose}>
                </DonateModal>
            </div>
        )
    }
}