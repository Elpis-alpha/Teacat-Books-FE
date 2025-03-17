"use client";

import { FaCheck } from "react-icons/fa";

type BooleanInputProps = {
  label: string;
  value: boolean;
  onToggle: () => void;
  readonly: boolean;
};

const BooleanInput = (props: BooleanInputProps) => {
  const { label, value, onToggle, readonly } = props;
  return (
    <div
      className={
        "w-full flex items-center gap-4 " + (readonly ? "readonly-input" : "")
      }
    >
      <button
        type="button"
        onClick={() => {
          if (!readonly) onToggle();
        }}
        className="w-10 h-10 rounded-xl p-1 flex items-center justify-center bg-white/20 hover:bg-white/40"
      >
        {value && <FaCheck />}
      </button>
      <label
        className="block flex-1 cursor-pointer"
        onClick={() => {
          if (!readonly) onToggle();
        }}
      >
        {label}
      </label>
    </div>
  );
};
export default BooleanInput;
