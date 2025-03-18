"use client";
type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  readonly: boolean;
  placeholder?: string;
  isTextArea?: boolean;
  rows?: number;
  extraText?: string | React.ReactNode;
};

const TextInput = (props: TextInputProps) => {
  const {
    label,
    value,
    onChange,
    placeholder,
    isTextArea,
    rows,
    readonly,
    extraText,
  } = props;

  return (
    <div className="w-full">
      <label className="font-bold block">{label}</label>
      {isTextArea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          readOnly={readonly}
          className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl mt-1.5 bg-white/20"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          readOnly={readonly}
          placeholder={placeholder}
          className="w-full px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl mt-1.5 bg-white/20"
        />
      )}
      {extraText && <p className="text-xs mt-1.5">{extraText}</p>}
    </div>
  );
};
export default TextInput;
