import * as React from "react";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import {  About, Endorsements, ContactItem, Home, Donate } from "./components/index";
import { App } from "./app";
//import { DonateModal } from "./components/donate/donateModal";


export const AppRouter: React.StatelessComponent<{}> = () => {
    return (
        <Router history={browserHistory}>
            <Route path="/" component={App}>
                <IndexRoute component={Home} />
                <Route path="/home" component={Home} />
                <Route path="/about" component={About} />
                <Route path="/endorsements" component={Endorsements} />
                <Route path="/contact" component={ContactItem} />
                <Route path="/donate" component={Donate} />
            </Route>
       
               
           
        </Router>
        );
}