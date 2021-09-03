import * as React from "react";
import { motion } from "framer-motion";
import { makeStyles } from "@material-ui/core";
import Cards from "./cards";
import AboutCards from "./aboutCards/aboutCards";
////import { IAbout } from "../interfaces/about/IAbout";
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: 'auto',
    },
    cover: {
        width: 'flex',
    },
    media: {
        display: 'flex',
    },
    card: {
        overflow: 'hidden',
        padding: '20 20 20 20',
        display: 'flex',
        flexDirection: 'column',
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary
    },
    bigAvatar: {
        marginLeft: 430,
        width: 260,
        height: 260,
    },
    photos: {
        float: "right",
        image: "https://nadinestecklein.s3.us-west-2.amazonaws.com/nadinerev.png"
    },
}));
export const About = () => {
    const classes = useStyles();
    return (React.createElement(motion.div, null,
        React.createElement("h1", { style: { textAlign: "center" } }, " ABOUT"),
        React.createElement(AboutCards, null),
        React.createElement(Cards, null)));
};
//# sourceMappingURL=about.js.map