import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import * as React from 'react';
const useStyles = makeStyles({
    root: {
        maxWidth: 1200,
    },
    media: {
        width: 180,
        height: 180,
    },
    colors: {
        wrap: 'noWrap',
        maxWidth: 500,
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
export default function PhotoCards({ src }) {
    const classes = useStyles();
    return (React.createElement(Card, { className: classes.colors },
        React.createElement(CardActionArea, null,
            React.createElement(CardMedia, { className: classes.media, image: src }))));
}
//# sourceMappingURL=photoCards.js.map