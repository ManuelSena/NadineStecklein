﻿import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
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

interface Props {
    src: string;
    title: string;
    description: string;
}

export default function MediaCard({ src, title, description }: Props) {
    const classes = useStyles();
    return (
        <Grid>
            <Card className={classes.colors}>
            <CardActionArea>
                <CardMedia className={classes.media} image={src} title={title} />
                <CardContent>
                    <Typography className={classes.typo} gutterBottom variant="h5" component="h2">
                        {title}
                    </Typography>
                    <Typography className={classes.typo} variant="body2" color="textSecondary" component="p">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
        {/*        <Button size="small" color="primary">*/}
        {/*            Share*/}
        {/*</Button>*/}
        {/*        <Button size="small" color="primary">*/}
        {/*            Learn More*/}
        {/*</Button>*/}
            </CardActions>
            </Card>
            </Grid>
    );
}