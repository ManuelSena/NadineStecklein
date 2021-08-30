import * as React from "react";

export interface IDonateModal {
    showModal: boolean;
    onClose: () => void;
}

export class DonateModal extends React.Component<IDonateModal, {}>{
    constructor(props: IDonateModal) {
        super(props);
    }

    public render() {
        if (!this.props.showModal)
            return null;
        const backdropStyle: React.CSSProperties = {
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
        const modalStyle: React.CSSProperties = {
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
        const headingBackground: React.CSSProperties = {
            backgroundColor: '#fff',
            borderRadius: 50,
        };
        const modalBody: React.CSSProperties = {
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


        return (
            <div className="backdrop" style={backdropStyle}>
                <div style={modalStyle}>
                    <h1 style={headingBackground}><strong>DONATE NOW</strong></h1>
                    <hr />
                    <br />
                    <div style={modalBody}>
                        <iframe src="https://secure.anedot.com/friends-of-nadine-stecklein/donate?embed=true" width="110%" height="500" frameBorder="0"></iframe>
                    </div>
                    <div className="footer">
                        <br />
                        <hr />
                        <button className="btn btn-danger" onClick={this.props.onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}