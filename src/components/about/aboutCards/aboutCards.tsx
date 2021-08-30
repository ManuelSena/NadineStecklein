import * as React from "react";
import { motion } from "framer-motion";
import { useTheme } from '@material-ui/core/styles';
import { Avatar, Box, Card, CardActionArea, CardContent, CardHeader, CardMedia, Grid, makeStyles, Typography } from "@material-ui/core";
import Cards from "./../cards";
import MediaCard from "../mediaCards";
import AboutCardsFun from "./aboutCardsFun";

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
    colors: {
        maxWidth: 345,
        background: 'linear-gradient(45deg, #FE6B8B 30%, #ff7400 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
}));




const aboutCards = [
    {
        title: 'Position 4',
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/NadineHomeSplash.jpg',
        description:
            'Vote 4 Nadine POSITION 4',

    },
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/NadineHomeSplash.jpg',
        title: 'My name is Nadine Stecklein...',
        description:
            'Since my first job in City Hall at age 17, I have worked in and had a passion for public service.For nearly two decades, I have dedicated my personal and professional life to serving others and would love to continue that as your newest City Council Member. My husband and I decided to purchase our first home in College Place.The greatest strength of our City is the sense of community.Neighbors genuinely care about each other.Providing more opportunities for neighbors to interact and get to know each other.This can be accomplished through an additional focus on outdoor recreation opportunities and active community engagement for all.We can engage our youth by partnering with nonprofits to offer after - school recreational activities that would keep them occupied and out of trouble.                        I will help our community grow by providing opportunities for small businesses to thrive through support programs and  further development of the College Avenue corridor.Working on the Utilities and Transportation Advisory Commission gave me specific insight into the looming traffic and storm water issues.If elected, I  will serve with integrity and as a voice for under - served and underrepresented communities in College Place.',
    },
];

export default function AboutCards() {
    return (
        <Box p={5}>
            <Grid container spacing={2}>
                {aboutCards.map((aboutCards, i) => {
                    return (
                        <Grid key={i} item>
                            <AboutCardsFun {...aboutCards} />
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
}