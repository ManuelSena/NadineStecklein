import * as React from "react";

export class FooterContainer extends React.Component<{}> {
    public render() {
        return (
            <div className="fixed-bottom">
                <footer>
                    <div className="ep-footerbar">
                        <span className="ep-copyright" style={{ color: "white" }}>Elicit ©2020  |  All Reserved</span>
                        <nav className="footer-nav pull-right">
                            <ul>
                                <p>Home</p>
                                <p>About</p>
                                <p>Contact</p>
                            </ul>
                        </nav>
                    </div>
                </footer>
            </div>
        )
    }
}