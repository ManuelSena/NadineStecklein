import { Box } from "@material-ui/core";
import { motion } from "framer-motion";
import * as React from "react"
import { IEndorsements } from "../interfaces/Endorsements/IEndorsements";

interface IEndorsementstIndexSingle {
    endorsements: IEndorsements[];
}

export const EndorsementsForm: React.StatelessComponent<IEndorsementstIndexSingle> = (props: IEndorsementstIndexSingle) => {
    return (
        <div>
            <motion.div animate={{ scale: 1}}>
                <div className="container">
                    <h1> Endorsements </h1>
                </div>
            </motion.div>
      {/*<Box display="flex" flexDirection="row" p={1} m={1} bgcolor="background.paper">*/}
      {/*  <Box p={1} bgcolor="grey.300">*/}
      {/*              Item 1*/}
      {/*  </Box>*/}
      {/*  <Box p={1} bgcolor="grey.300">*/}
      {/*              Item 2*/}
      {/*  </Box>*/}
      {/*  <Box p={1} bgcolor="grey.300">*/}
      {/*              Item 3*/}
      {/*  </Box>*/}
      {/*</Box>*/}
      {/*<Box display="flex" flexDirection="row-reverse" p={1} m={1} bgcolor="background.paper">*/}
      {/*  <Box p={1} bgcolor="grey.300">*/}
      {/*              Item 1*/}
      {/*  </Box>*/}
      {/*  <Box p={1} bgcolor="grey.300">*/}
      {/*              Item 2*/}
      {/*  </Box>*/}
      {/*  <Box p={1} bgcolor="grey.300">*/}
      {/*              Item 3*/}
      {/*  </Box>*/}
      {/*</Box>*/}
    </div>
      
    )
}