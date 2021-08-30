import * as React from "react";
import { Donate } from "..";
export class FooterContainer extends React.Component {
    render() {
        return (React.createElement("div", { className: "fixed-bottom" },
            React.createElement("footer", null,
                React.createElement("div", { className: "ep-footerbar" },
                    React.createElement("span", { className: "ep-copyright", style: { color: "white" } }, "Elicit \u00A92020  |  All Reserved"),
                    React.createElement("nav", { className: "footer-nav pull-right" },
                        React.createElement("ul", null,
                            React.createElement("button", null,
                                React.createElement(Donate, null))))))));
    }
}
//# sourceMappingURL=footer.js.map