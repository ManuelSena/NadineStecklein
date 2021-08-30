import * as React from "react";
import { EndorsementsForm } from "./endorsementsForm";
export class Endorsements extends React.Component {
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
        };
        this.loadData = this.loadData.bind(this);
    }
    componentDidMount() {
        this.loadData();
    }
    loadData() {
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
    render() {
        return (React.createElement(EndorsementsForm, { endorsements: this.state.endorsementsListItems }));
    }
}
//# sourceMappingURL=endorsements.js.map