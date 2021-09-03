import * as React from "react";
import AboutCards from "../about/aboutCards/aboutCards";
import Cards from "../about/cards";
import { ContactItem } from "../contact/contactItem";
import { FooterContainer } from "../footer/footer";
import Photos from "../media/photos";
//import { Endorsements } from "../endorsements/endorsements";
export const Home = () => {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "container" },
            React.createElement("div", { className: "aboutcards" },
                React.createElement(AboutCards, null)),
            React.createElement("div", { className: "cards" },
                React.createElement(Cards, null)),
            React.createElement("div", { className: "photos" },
                React.createElement(Photos, null)),
            React.createElement("div", { className: "contactitem" },
                React.createElement(ContactItem, null)),
            React.createElement("div", { className: "footer" },
                React.createElement(FooterContainer, null)))));
};
//# sourceMappingURL=home.js.map