import * as React from "react";
import { IEndorsements } from "../interfaces/Endorsements/IEndorsements";
import { EndorsementsForm } from "./endorsementsForm";
import { motion } from "framer-motion";

export interface IEndorsementsState {
    //podcastHostPageState: IPodcastHostPage;
    endorsementsListItems: IEndorsements[];
}

export class Endorsements extends React.Component<{}, IEndorsementsState> {
    constructor(props) {
        super(props);
        this.state = {
            //podcastHostPageState: {
            //    id: 0,
            //    podcastHostPicture: "",
            //    podcastHostName: "",
            //    podcastHostTitle: "",
            //    podcastHostNickname: "",
            //    podcastHostFavoriteBands: "",
            //    podcastHostBio: "",
            //    podcastHostInstagram: "",
            //    podcastHostFacebook: "",
            //    podcastHostLinkedIn: "",
            //    podcastHostEmailContact: "",
            //    displayOrder: 0
            //},
            endorsementsListItems: [],

        }
        this.loadData = this.loadData.bind(this);
    }

    public componentDidMount() {
        this.loadData();
    }

    private loadData() {
        //getEndorsements()
        //    .then((response) => {
        //        this.setState({ endorsementsListItems: response.items });
        //        console.log(response)
        //    }, (err) => { })
        //    .catch((err) => {
        //        console.log(err);
        //    })
    }

    //export const MotionBox = motion<BoxProps>(Box);
    public render() {
        return (
           
           

                <EndorsementsForm
                    endorsements={this.state.endorsementsListItems}
                />

        )
    }
}