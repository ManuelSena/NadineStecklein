import * as React from "react";
import { FooterContainer } from "./components/footer/footer";
import { Header } from "./components/header";
export const App = (props) => {
    return (React.createElement("div", { className: "container" },
        React.createElement(Header, null),
        props.children,
        React.createElement(FooterContainer, null)));
};
//# sourceMappingURL=app.js.map