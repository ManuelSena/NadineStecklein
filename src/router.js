import * as React from "react";
import { Router, Route, browserHistory, IndexRoute } from "react-router";
import { About, Endorsements, ContactItem, Home, Donate } from "./components/index";
import { App } from "./app";
//import { DonateModal } from "./components/donate/donateModal";
export const AppRouter = () => {
    return (React.createElement(Router, { history: browserHistory },
        React.createElement(Route, { path: "/", component: App },
            React.createElement(IndexRoute, { component: Home }),
            React.createElement(Route, { path: "/home", component: Home }),
            React.createElement(Route, { path: "/about", component: About }),
            React.createElement(Route, { path: "/endorsements", component: Endorsements }),
            React.createElement(Route, { path: "/contact", component: ContactItem }),
            React.createElement(Route, { path: "/donate", component: Donate }))));
};
//# sourceMappingURL=router.js.map