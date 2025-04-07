"use client";

import { randomString } from "@/source/helpers";
import { useRef, useState } from "react";
import { FaTimesCircle } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

type ValueType = { id: string; text: string };
type statusType = "none" | "loading" | "ok" | "adding";
type MultiTextInputProps = {
  label?: string;
  value: ValueType[];
  onChange: (value: ValueType[]) => void;
  readonly: boolean;
  placeholder?: string;
  extraText?: string | React.ReactNode;
  empty?: string | React.ReactNode;
  smallerPaddings?: boolean;
  getValue: (text: string) => Promise<ValueType | null>;
  searchValue: (q: string) => Promise<ValueType[] | null>;
};

const MultiTextInput = (props: MultiTextInputProps) => {
  const {
    label,
    value,
    onChange,
    placeholder,
    readonly,
    extraText,
    smallerPaddings,
  } = props;

  const [currentText, setCurrentText] = useState("");

  const statusRef = useRef<statusType>("none");
  const debounceRef = useRef("");
  const [search, setSearch] = useState<{
    status: statusType;
    data: ValueType[];
    id: string;
  }>({
    status: "none",
    data: [],
    id: "",
  });

  const addValue = async (text: string | ValueType) => {
    if (typeof text === "object") {
      const newValue = [...props.value.filter((v) => v.id !== text.id), text];
      onChange(newValue);
    } else {
      if (!text || text.trim().length <= 0) return;
      setCurrentText(text.trim());
      setSearch({ status: "adding", data: [], id: "" });
      statusRef.current = "adding";

      const value = await props.getValue(text);
      if (value) {
        const newValue = [
          ...props.value.filter((v) => v.id !== value.id),
          value,
        ];
        onChange(newValue);
      }
    }

    setSearch({ status: "none", data: [], id: "" });
    statusRef.current = "none";
    setCurrentText("");
  };

  const removeValue = (id: string) => {
    const newValue = props.value.filter((v) => v.id !== id);
    onChange(newValue);
  };

  const searchValue = async (text: string) => {
    if (!text || text.trim().length <= 0) {
      setSearch({ status: "none", data: [], id: "" });
      statusRef.current = "none";
      return;
    }
    if (statusRef.current === "adding") {
      setSearch({ status: "none", data: [], id: "" });
      statusRef.current = "none";
      return;
    }
    if (search.status === "adding") {
      setSearch({ status: "none", data: [], id: "" });
      statusRef.current = "none";
      return;
    }

    const myID = randomString(10);

    setSearch({ status: "loading", data: [], id: myID });
    statusRef.current = "loading";
    debounceRef.current = myID;

    await new Promise((resolve) => setTimeout(resolve, 500));
    if (debounceRef.current !== myID) return;

    props.searchValue(text).then((data) => {
      if (statusRef.current === "loading") {
        setSearch((p) => {
          if (p.id !== myID) return p;

          return {
            status: data ? "ok" : "none",
            data: data || [],
            id: myID,
          };
        });
      }
    });
  };

  return (
    <div className="w-full">
      {label && <label className="font-bold block">{label}</label>}
      <div
        className={
          "w-full px-4 py-2.5 rounded-xl mt-1.5 bg-white/20 " +
          (smallerPaddings ? "" : "sm:px-5 sm:py-3.5")
        }
      >
        <div className="flex gap-2 flex-wrap mb-3">
          {value.map((item) => (
            <div
              key={item.id}
              className="flex items-center bg-white text-black rounded-xl px-4 py-2.5 shadow-2xl"
            >
              <span>{item.text}</span>
              <button
                type="button"
                onClick={() => removeValue(item.id)}
                disabled={readonly || search.status === "adding"}
                className="text-red-500 ml-2"
              >
                <FaTimesCircle />
              </button>
            </div>
          ))}
          {value.length <= 0 && (props.empty || <span>No Items</span>)}
        </div>
        <div className="mt-1.5">
          <input
            type="text"
            value={currentText}
            onChange={(e) => {
              setCurrentText(e.target.value);
              searchValue(e.target.value);
            }}
            onFocus={() => {
              if (currentText && currentText.trim().length > 0) {
                searchValue(currentText);
              }
            }}
            onBlur={() => {
              setTimeout(() => {
                setSearch({ status: "none", data: [], id: "" });
                statusRef.current = "none";
              }, 500);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addValue(currentText);
              }
            }}
            autoComplete="off"
            readOnly={readonly || search.status === "adding"}
            placeholder={placeholder}
            className={
              "w-full px-4 py-2.5 pr-28 rounded-xl bg-white/20 " +
              (smallerPaddings ? "" : "sm:px-5 sm:py-3.5 sm:pr-24")
            }
          />
          <div className="absolute top-0 bottom-0 right-0 flex items-center pr-4">
            <button
              type="button"
              disabled={readonly || search.status === "adding"}
              onClick={() => {
                addValue(currentText);
              }}
              className="bg-white text-black py-1 px-4 rounded-md shake flex"
            >
              {search.status === "adding" ? (
                <div className="py-1 px-1.5 flex">
                  <ClipLoader color="#000" size={16} />
                </div>
              ) : (
                <span>Add</span>
              )}
            </button>
          </div>
          <div className="absolute top-full left-0 right-0 flex items-center mt-2 z-30 w-full bg-white/20 backdrop-blur-lg rounded-xl overflow-auto">
            {search.status === "loading" ? (
              <div className="w-full flex justify-center items-center py-2">
                <ClipLoader color="#fff" size={16} />
                <span className="ml-2">Loading...</span>
              </div>
            ) : search.status === "ok" ? (
              search.data.length <= 0 ? (
                <div className="w-full flex justify-center items-center py-2">
                  <span>No results</span>
                </div>
              ) : (
                <div className="flex flex-col w-full">
                  {search.data.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      className="w-full px-4 py-2 hover:bg-white/20 text-left"
                      onClick={() => {
                        addValue(item);
                      }}
                    >
                      {item.text}
                    </button>
                  ))}
                </div>
              )
            ) : null}
          </div>
        </div>
      </div>

      {extraText && (
        <p
          className={
            "text-xs opacity-70 " + (smallerPaddings ? "mt-0.5" : "mt-1.5")
          }
        >
          {extraText}
        </p>
      )}
    </div>
  );
};
export default MultiTextInput;
