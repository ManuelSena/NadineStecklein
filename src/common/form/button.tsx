import * as React from "react";
import { IButtonProps } from "../../interfaces/IButtonProps";


export const Button: React.StatelessComponent<IButtonProps> = (props) => {
    return (
        <Button
            label="Send"
            className={props.className}
            onClick={props.onClick}
        >
            {props.label}
        </Button>
    );
};