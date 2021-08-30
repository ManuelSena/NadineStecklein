import * as React from "react";
import { IInputProps } from "../../interfaces/IInputProps";


export const Input: React.StatelessComponent<IInputProps> = (props) => {

    return (
        <div className={formatWrapperClass(props)}>
            <label htmlFor={props.name}>{props.label}</label>
            <div className="field">
                <input
                    name={props.name}
                    type={props.type}
                    className="form-control"
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={onChangeInput(props)}
                />
            </div>
            <div className="help-block">{props.error}</div>
        </div>
    );

}

const formatWrapperClass = (props: IInputProps) => {
    const wrapperClass = 'form-group';
    return props.error ? `${wrapperClass} has-error` : wrapperClass;
}

const onChangeInput = (props: IInputProps) => (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.name, e.target.value);
}

const onKeyPress = (props: IInputProps) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (props.onEnter) {
        if (e.key === 'Enter') {
            props.onEnter();
        }
    }
};