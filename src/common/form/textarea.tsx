import * as React from "react";
import { ITextareaProps } from "../../interfaces/ITextAreaProps";

export const Textarea: React.StatelessComponent<ITextareaProps> = (props) => {
    return (
        <div className={formatWrapperClass(props)}>
            <label htmlFor={props.name}>{props.label}</label>
            <div className="field">
                <textarea required={props.required}
                    name={props.name}
                    className={props.className ? (props.className + "form-control") : "form-control"}
                    placeholder={props.placeholder}
                    value={props.value}
                    onChange={onChangeInput(props)}
                    rows={props.rows}
                    style={props.style}
                />
            </div>
            <div className="help-block">{props.error}</div>
        </div>
    );
}

const formatWrapperClass = (props: ITextareaProps) => {
    const wrapperClass = 'form-group';
    return props.error ? `${wrapperClass} has-error` : wrapperClass;
}

const onChangeInput = (props: ITextareaProps) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange(e.target.name, e.target.value);
}

const onBlur = (props: ITextareaProps) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (props.onBlur) {
        props.onBlur(e.target.name, e.target.value);
    }
}