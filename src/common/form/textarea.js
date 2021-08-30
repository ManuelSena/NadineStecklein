import * as React from "react";
export const Textarea = (props) => {
    return (React.createElement("div", { className: formatWrapperClass(props) },
        React.createElement("label", { htmlFor: props.name }, props.label),
        React.createElement("div", { className: "field" },
            React.createElement("textarea", { required: props.required, name: props.name, className: props.className ? (props.className + "form-control") : "form-control", placeholder: props.placeholder, value: props.value, onChange: onChangeInput(props), rows: props.rows, style: props.style })),
        React.createElement("div", { className: "help-block" }, props.error)));
};
const formatWrapperClass = (props) => {
    const wrapperClass = 'form-group';
    return props.error ? `${wrapperClass} has-error` : wrapperClass;
};
const onChangeInput = (props) => (e) => {
    props.onChange(e.target.name, e.target.value);
};
const onBlur = (props) => (e) => {
    if (props.onBlur) {
        props.onBlur(e.target.name, e.target.value);
    }
};
//# sourceMappingURL=textarea.js.map