import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import * as React from 'react';
import PhotoCards from './photoCards';
const photoCards = [
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/Photos/239994570_223530636387339_7992330868232208968_n.jpg',
    },
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/Photos/240116911_558499645347898_7573229262476275754_n.jpg',
    },
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/Photos/240154480_1030662317684463_6475118825775081072_n.jpg',
    },
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/Photos/240167961_263220945444620_6284537836525951161_n.jpg',
    },
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/Photos/240397574_402644114620599_8673127993409577436_n.jpg',
    }, {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/Photos/240722336_547827033127466_1400846831287034319_n.jpg',
    },
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/Photos/240746711_1205175176614865_5187716855503079728_n.jpg',
    },
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/Photos/240752449_276436607292376_6145837712626396230_n.jpg',
    }
];
export default function Photos() {
    return (React.createElement(Box, null,
        React.createElement(Grid, { container: true, spacing: 2 }, photoCards.map((photoCards, i) => {
            return (React.createElement(Grid, { key: i, item: true, spacing: 3, zeroMinWidth: true },
                React.createElement(PhotoCards, Object.assign({}, photoCards))));
        }))));
}
//# sourceMappingURL=photos.js.map