import * as React from "react";
import AboutCards from "../about/aboutCards/aboutCards";
import Cards from "../about/cards";
import { ContactItem } from "../contact/contactItem";
//import { Endorsements } from "../endorsements/endorsements";
export const Home = () => {
    return (React.createElement(React.Fragment, null,
        React.createElement("div", null,
            React.createElement(AboutCards, null)),
        React.createElement("div", null,
            React.createElement(Cards, null)),
        React.createElement("div", null,
            React.createElement(ContactItem, null))));
};
//# sourceMappingURL=home.js.map