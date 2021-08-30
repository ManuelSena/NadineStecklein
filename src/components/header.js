import { Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import * as React from "react";
import { Link } from "react-router";
export const Header = () => {
    return (React.createElement("div", { style: { textAlign: "center" } },
        React.createElement(motion.div, { animate: { y: 30 }, transition: { ease: "easeOut", duration: 2 } },
            React.createElement("h3", { style: { fontSize: 35, height: 30 } }, "NADINE STECKLEIN"),
            React.createElement(Typography, { className: "positionfour", style: { textAlign: "center" }, gutterBottom: true, variant: "subtitle1", component: "h2" }, "FOR POSITION 4")),
        React.createElement("div", null,
            React.createElement(Link, { to: "/home", className: "btn" }, "Home"),
            React.createElement(Link, { to: "/about", className: "btn" }, "About"),
            React.createElement(Link, { to: "/contact", className: "btn" }, "Contact"))));
};
//# sourceMappingURL=header.js.map