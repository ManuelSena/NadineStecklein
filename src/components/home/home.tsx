import * as React from "react";
import { About } from "../about/about";
import AboutCards from "../about/aboutCards/aboutCards";
import Cards from "../about/cards";
import { ContactItem } from "../contact/contactItem";
import { FooterContainer } from "../footer/footer";
import { HeadBanner } from "../header/headbanner";
import Photos from "../media/photos";
//import { Endorsements } from "../endorsements/endorsements";

export const Home: React.StatelessComponent<{}> = () => {
    return (
        <React.Fragment>
            <div className="container">
                <div className="aboutcards">
                    <AboutCards />
                </div>
                <div className="cards">
                    <Cards />
                </div>
                <div className="photos">
                    <Photos />
                </div>
                {/*<div>*/}
                {/*    <Endorsements />*/}
                {/*</div>*/}
                <div className="contactitem">
                    <ContactItem />
                </div>
                <div className="footer">
                    <FooterContainer />
                </div>
            </div>
        </React.Fragment>

    );
}