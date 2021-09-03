import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import * as React from 'react';
import MediaCard from './mediaCards';
const mediaCards = [
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/whittier-box+(1).png',
        title: 'Education:',
        description: '   I graduated from Whittier College with a B.A.in Public Policy and earned a Master of Public Administration.',
    },
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/community-service-scholarships.jpg',
        title: 'Community Service:',
        description: 'Diversity and Inclusion Advisory Board Chair, President of the College Place Lions Club, served on WWPD Chief’s Advisory Board, Utilities and Transportation Advisory Commission, Children of Walla Walla mentor, Blue Zones Project Engagement Committee.',
    },
    {
        src: 'https://nadinestecklein.s3.us-west-2.amazonaws.com/7732bee1b22ab9e27826c642cc9ce465.andrew-neel-cckf4TsHAuw-unsplash-scaled.jpg',
        title: 'Other Professional Experience:',
        description: 'I am a higher education professional with nearly two decades in the public sector.I have worked for City, State, and Federal governments.',
    }
];
export default function Cards() {
    return (React.createElement(Box, { p: 1, pt: 25 },
        React.createElement(Grid, { container: true, spacing: 2 }, mediaCards.map((mediaCard, i) => {
            return (React.createElement(Grid, { key: i, item: true },
                React.createElement(MediaCard, Object.assign({}, mediaCard))));
        }))));
}
//# sourceMappingURL=cards.js.map