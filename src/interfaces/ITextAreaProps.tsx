export interface ITextareaProps {
    name: string;
    label?: string;
    placeholder?: string;
    value: string;
    onChange: (fieldName: string, value: any) => void;
    error?: string;
    required?: boolean;
    onBlur?: (fieldName: string, value: string) => void;
    rows?: number;
    className?: string;
    style?: React.CSSProperties;
}