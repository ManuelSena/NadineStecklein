export interface IInputProps {
    type?: string;
    name: string;
    label?: string;
    placeholder?: string;
    value: any;
    onChange: (fieldName: any, value: any) => void;
    error?: string;
    required?: boolean;
    onBlur?: (fieldName: string, value: any) => void;
    className?: string;
    onEnter?: () => void;
    id?: string;
    style?: React.CSSProperties;
    size?: number;
    //name: string;
    //type?: string;
    //label: string;
    //placeholder?: string;
    //value: string;
    //onChange: (fieldName: string, value: string) => void;
    //error?: string;
}