import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import * as React from 'react';
import { Grid } from '@material-ui/core';
const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        maxWidth: 800,
    },
    media: {
        height: 250,
    },
    colors: {
        textAlign: 'center',
        width: 350,
        background: 'linear-gradient(45deg, #FE6B8B 30%, #ff7400 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
    },
    typo: {
        flex: 1,
    }
});
export default function MediaCard({ src, title, description }) {
    const classes = useStyles();
    return (React.createElement(Grid, null,
        React.createElement(Card, { className: classes.colors },
            React.createElement(CardActionArea, null,
                React.createElement(CardMedia, { className: classes.media, image: src, title: title }),
                React.createElement(CardContent, null,
                    React.createElement(Typography, { className: classes.typo, gutterBottom: true, variant: "h5", component: "h2" }, title),
                    React.createElement(Typography, { className: classes.typo, variant: "body2", color: "textSecondary", component: "p" }, description))),
            React.createElement(CardActions, null))));
}
//# sourceMappingURL=mediaCards.js.map