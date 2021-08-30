import { Typography } from "@material-ui/core";
import { motion } from "framer-motion";
import * as React from "react";
import { Link } from "react-router";

export const Header: React.StatelessComponent<{}> = () => {
    return (
        <div style={{ textAlign: "center" }}>
           <motion.div
            animate={{ y:30 }}
            transition={{  ease: "easeOut", duration: 2 }}
>
                <h3 style={{ fontSize: 35, height:30}}>
                    NADINE STECKLEIN
                     
            </h3>
                <Typography className="positionfour" style={{ textAlign: "center" }} gutterBottom variant="subtitle1" component="h2">
                    FOR POSITION 4
          </Typography>
                </motion.div>
            <div>
            <Link to="/home" className="btn" >Home</Link>
                <Link to="/about" className="btn" >About</Link>
                {/*<Link to="/endorsements" className="btn" >Endorsements</Link>*/}
                <Link to="/contact" className="btn" >Contact</Link>
                {/*<Link to="/donate" className="btn" >DONATE</Link>*/}
            </div>
        </div>
    );
}