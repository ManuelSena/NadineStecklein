import * as React from "react";
export class DonateModal extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (!this.props.showModal)
            return null;
        const backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 20,
            zIndex: 999,
            overflow: 'auto'
        };
        const modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 1000,
            maxHeight: 750,
            width: '100%',
            textAlign: 'center',
            alignSelf: 'stretch',
            overflow: "hidden",
            margin: '0 auto',
            padding: 10,
            zIndex: 1001
        };
        const headingBackground = {
            backgroundColor: '#fff',
            borderRadius: 50,
        };
        const modalBody = {
            backgroundColor: '#fff',
            borderRadius: 5,
            maxWidth: 1000,
            maxHeight: 1000,
            margin: '0 auto',
            width: '100%',
            textAlign: 'center',
            alignSelf: 'stretch',
            overflow: "hidden",
            zIndex: 1001,
        };
        return (React.createElement("div", { className: "backdrop", style: backdropStyle },
            React.createElement("div", { style: modalStyle },
                React.createElement("h1", { style: headingBackground },
                    React.createElement("strong", null, "DONATE NOW")),
                React.createElement("hr", null),
                React.createElement("br", null),
                React.createElement("div", { style: modalBody },
                    React.createElement("iframe", { src: "https://secure.anedot.com/friends-of-nadine-stecklein/donate?embed=true", width: "110%", height: "500", frameBorder: "0" })),
                React.createElement("div", { className: "footer" },
                    React.createElement("br", null),
                    React.createElement("hr", null),
                    React.createElement("button", { className: "btn btn-danger", onClick: this.props.onClose }, "Close")))));
    }
}
//# sourceMappingURL=donateModal.js.map