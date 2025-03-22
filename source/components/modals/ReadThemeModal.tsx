import {
  FormEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import ModalOverflow from "./ModalOverflow";
import { useAppDispatch, useAppSelector } from "@/source/store/hooks";
import { animateModal } from "@/source/helpers/gsap.config";
import { changeTheme, setModal } from "@/source/store/slice/UIslice";
import { FaTimes } from "react-icons/fa";
import gsap from "gsap";
import toast from "react-hot-toast";
import { getTheme, setTheme } from "@/source/helpers/read";

const ReadThemeModal = () => {
  const dispatch = useAppDispatch();
  const { modal } = useAppSelector((state) => state.ui);

  const mainRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  const [backgroundColor, setBackgroundColor] = useState("");
  const [textColor, setTextColor] = useState("");
  const [fontFamily, setFontFamily] = useState<"Miller" | "Proxima">("Miller");
  const [textAlignment, setTextAlignment] = useState<
    "left" | "center" | "right"
  >("left");
  const [lineHeight, setLineHeight] = useState(0);
  const [fontPercentage, setFontPercentage] = useState(0);
  const [paddingPercentage, setPaddingPercentage] = useState(0);

  useLayoutEffect(() => {
    if (!modal.active || modal.type !== "set-theme") {
      hasAnimated.current = false;
      return;
    }
    if (hasAnimated.current) return;
    if (!mainRef.current) return;

    hasAnimated.current = true;
    gsap.fromTo(mainRef.current, animateModal.in.from, animateModal.in.to);
  }, [modal]);

  const exitWithAnimation = () => {
    if (!mainRef.current) return;

    gsap.to(mainRef.current, {
      ...animateModal.out,
      onComplete: () => {
        hasFetchedBefore.current = false;
        dispatch(setModal({ active: false }));
      },
    });
  };

  const hasFetchedBefore = useRef(false);
  useEffect(() => {
    if (
      modal.active &&
      modal.type === "set-theme" &&
      !hasFetchedBefore.current
    ) {
      hasFetchedBefore.current = true;
      const theme = getTheme();

      if (theme) {
        setBackgroundColor(theme.backgroundColor);
        setTextColor(theme.textColor);
        setFontFamily(theme.fontFamily);
        setTextAlignment(theme.textAlignment);
        setLineHeight(theme.lineHeight);
        setFontPercentage(theme.fontPercentage);
        setPaddingPercentage(theme.paddingPercentage);
      }
    }
  }, [modal]);

  const saveTheme: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setTheme({
      backgroundColor,
      textColor,
      fontFamily,
      textAlignment,
      lineHeight,
      fontPercentage,
      paddingPercentage,
    });
    dispatch(changeTheme());
    toast.success("Theme Changed");
    exitWithAnimation();
  };

  if (!modal.active) return <></>;
  if (modal.type !== "set-theme") return <></>;

  return (
    <div className="fixed left-0 right-0 bottom-0 top-[0px] bg-[#DBDBDB]/[0.01] backdrop-blur-[10px] z-[90] flex justify-center p-5">
      <div
        ref={mainRef}
        className="gsap-init m-auto w-full max-w-[458px] rounded-[24px] bg-sub-bg shadow-lg py-8 px-6"
      >
        <div className="font-proxima">
          <h1 className="text-2xl font-bold text-sub-head">Configure Theme</h1>

          <form
            onSubmit={saveTheme}
            className="flex flex-col items-center justify-center gap-3 mt-4"
          >
            <div className="w-full">
              <label className="font-bold block">Background Color</label>
              <div
                className="w-full rounded-md h-7"
                style={{ background: backgroundColor }}
              >
                <input
                  type="color"
                  value={backgroundColor}
                  onInput={(e) => setBackgroundColor(e.currentTarget.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="font-bold block">Text Color</label>
              <div
                className="w-full rounded-md h-7"
                style={{ background: textColor }}
              >
                <input
                  type="color"
                  value={textColor}
                  onInput={(e) => setTextColor(e.currentTarget.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <div className="w-full">
              <label className="font-bold block">Font Family</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFontFamily("Miller")}
                  className={`${
                    fontFamily === "Miller"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  } p-1 rounded-md flex-1`}
                >
                  Miller
                </button>
                <button
                  type="button"
                  onClick={() => setFontFamily("Proxima")}
                  className={`${
                    fontFamily === "Proxima"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  } p-1 rounded-md flex-1`}
                >
                  Proxima
                </button>
              </div>
            </div>
            <div className="w-full">
              <label className="font-bold block">Text Alignment</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTextAlignment("left")}
                  className={`${
                    textAlignment === "left"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  } p-1 rounded-md flex-1`}
                >
                  Left
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlignment("center")}
                  className={`${
                    textAlignment === "center"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  } p-1 rounded-md flex-1`}
                >
                  Center
                </button>
                <button
                  type="button"
                  onClick={() => setTextAlignment("right")}
                  className={`${
                    textAlignment === "right"
                      ? "bg-white text-black"
                      : "bg-white/10 text-white"
                  } p-1 rounded-md flex-1`}
                >
                  Right
                </button>
              </div>
            </div>
            <div className="w-full flex items-center gap-3 pt-3">
              <label className="font-bold block flex-1">Line Height</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setLineHeight((p) =>
                      Number((p - 0.1).toFixed(1)) <= 0
                        ? 0.1
                        : Number((p - 0.1).toFixed(1))
                    )
                  }
                  className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center"
                >
                  -
                </button>
                <span className="flex-1 text-center">{lineHeight}</span>
                <button
                  type="button"
                  onClick={() =>
                    setLineHeight((p) =>
                      Number((p + 0.1).toFixed(1)) <= 0
                        ? 0.1
                        : Number((p + 0.1).toFixed(1))
                    )
                  }
                  className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <div className="w-full flex items-center gap-3 pt-2">
              <label className="font-bold block flex-1">Font Size</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setFontPercentage((p) =>
                      Number((p - 5).toFixed(1)) <= 0
                        ? 5
                        : Number((p - 5).toFixed(1))
                    )
                  }
                  className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center"
                >
                  -
                </button>
                <span className="flex-1 text-center">{fontPercentage}%</span>
                <button
                  type="button"
                  onClick={() =>
                    setFontPercentage((p) =>
                      Number((p + 5).toFixed(1)) <= 0
                        ? 5
                        : Number((p + 5).toFixed(1))
                    )
                  }
                  className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
            <div className="w-full flex items-center gap-3 pt-2">
              <label className="font-bold block flex-1">Padding</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setPaddingPercentage((p) =>
                      Number((p - 5).toFixed(1)) <= 0
                        ? 5
                        : Number((p - 5).toFixed(1))
                    )
                  }
                  className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center"
                >
                  -
                </button>
                <span className="flex-1 text-center">{paddingPercentage}%</span>
                <button
                  type="button"
                  onClick={() =>
                    setPaddingPercentage((p) =>
                      Number((p + 5).toFixed(1)) <= 0
                        ? 5
                        : Number((p + 5).toFixed(1))
                    )
                  }
                  className="bg-white/10 text-white w-6 h-6 rounded-full flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="bg-highlight hover:bg-highlight-dark text-white p-3 rounded-xl w-full flex items-center justify-center gap-2"
            >
              Save Theme
            </button>
          </form>
        </div>

        <button
          onClick={() => exitWithAnimation()}
          className="absolute shake top-4 right-4 text-2xl"
        >
          <FaTimes />
        </button>
      </div>
      <ModalOverflow />
    </div>
  );
};

export default ReadThemeModal;

// backgroundColor: string;
// textColor: string;
// fontFamily: "Miller" | "Proxima";
// textAlignment: "left" | "center" | "right";
// lineHeight: number;
// fontPercentage: number;
// paddingPercentage: number;
