import * as React from "react";
import { FooterContainer } from "./components/footer/footer";
import { Header } from "./components/header";
import { HeadBanner } from "./components/header/headbanner";

export const App: React.StatelessComponent<{}> = (props) => {

    return (
       
          <div>
            <Header />
            {props.children}
            </div>
           
    );
}