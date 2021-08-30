import * as React from "react";
import { Donate } from "..";

export class FooterContainer extends React.Component<{}> {
    public render() {
        return (
            <div className="fixed-bottom">
                <footer>
                    <div className="ep-footerbar">
                        <span className="ep-copyright" style={{ color: "white" }}>Elicit ©2020  |  All Reserved</span>
                        <nav className="footer-nav pull-right">
                            <ul>
                                <button><Donate/></button>
                            </ul>
                        </nav>
                    </div>
                </footer>
            </div>
        )
    }
}