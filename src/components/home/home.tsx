import * as React from "react";
import { About } from "../about/about";
import AboutCards from "../about/aboutCards/aboutCards";
import Cards from "../about/cards";
import { ContactItem } from "../contact/contactItem";
//import { Endorsements } from "../endorsements/endorsements";

export const Home: React.StatelessComponent<{}> = () => {
    return (
        <React.Fragment>
            <div>
                <AboutCards />
            </div>
            <div>
                <Cards />
            </div>
            {/*<div>*/}
            {/*    <Endorsements />*/}
            {/*</div>*/}
            <div>
                <ContactItem />
            </div>
        </React.Fragment>

    );
}