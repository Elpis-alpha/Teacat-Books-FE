import Cookies from "universal-cookie";

export interface ThemeInterface {
  backgroundColor: string;
  textColor: string;
  fontFamily: "Miller" | "Proxima";
  textAlignment: "left" | "center" | "right";
  lineHeight: number;
  fontPercentage: number;
  paddingPercentage: number;
}

const defaultTheme: ThemeInterface = {
  backgroundColor: "white",
  textColor: "black",
  fontPercentage: 100,
  fontFamily: "Miller",
  textAlignment: "left",
  lineHeight: 1.5,
  paddingPercentage: 100,
};

export const getTheme = (__theme?: string) => {
  try {
    const _theme = __theme || _getTheme();
    let theme: ThemeInterface;
    if (_theme && typeof _theme === "object") theme = _theme;
    else {
      if (typeof _theme !== "string") return defaultTheme;
      theme = JSON.parse(_theme);
    }

    if (typeof theme !== "object" || !theme) {
      theme = defaultTheme;
    }
    if (typeof theme.backgroundColor !== "string") {
      theme.backgroundColor = defaultTheme.backgroundColor;
    }
    if (typeof theme.textColor !== "string") {
      theme.textColor = defaultTheme.textColor;
    }
    if (typeof theme.fontPercentage !== "number") {
      theme.fontPercentage = defaultTheme.fontPercentage;
    }
    if (
      typeof theme.fontFamily !== "string" ||
      (theme.fontFamily !== "Miller" && theme.fontFamily !== "Proxima")
    ) {
      theme.fontFamily = defaultTheme.fontFamily;
    }
    if (typeof theme.textAlignment !== "string") {
      theme.textAlignment = defaultTheme.textAlignment;
    }
    if (typeof theme.lineHeight !== "number") {
      theme.lineHeight = defaultTheme.lineHeight;
    }
    if (typeof theme.paddingPercentage !== "number") {
      theme.paddingPercentage = defaultTheme.paddingPercentage;
    }

    return theme;
  } catch (error) {
    console.error(error);
    return defaultTheme;
  }
};

export const setTheme = (theme: ThemeInterface) => {
  try {
    if (typeof window === "undefined") return;
    const cookie = new Cookies();

    cookie.set("read-theme", JSON.stringify(theme), {
      path: "/read",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365), // 1 year
    });
  } catch (error) {
    console.error(error);
  }
};

const _getTheme = () => {
  if (typeof window !== "undefined") {
    const cookie = new Cookies();
    return cookie.get("read-theme");
  }
  return null;
};

export const parseFontFamily = (family: "Miller" | "Proxima") => {
  if (family === "Miller") return "var(--font-miller)";
  return "var(--font-proxima)";
};

export const setLastPosition = (chapterNumber: number) => {
  if (chapterNumber <= 0 || typeof window === "undefined") return;

  try {
    const MAX_POSITIONS = 3;

    const storedPositions =
      window.localStorage.getItem("read-positions") || "[]";
    const allPositions: { chapter: number; position: number }[] =
      JSON.parse(storedPositions) ?? [];

    const position = window.scrollY;

    const updatedPositions = [
      { chapter: chapterNumber, position },
      ...allPositions.filter((p) => p.chapter !== chapterNumber),
    ].slice(0, MAX_POSITIONS);

    window.localStorage.setItem(
      "read-positions",
      JSON.stringify(updatedPositions)
    );
  } catch (error) {
    console.error("Error saving reading position:", error);
  }
};

export const getLastPosition = (chapterNumber: number): number => {
  if (chapterNumber <= 0 || typeof window === "undefined") return 0;

  try {
    const storedPositions = window.localStorage.getItem("read-positions");
    const allPositions: { chapter: number; position: number }[] = JSON.parse(
      storedPositions || "[]"
    );

    return (
      allPositions.find((pos) => pos.chapter === chapterNumber)?.position || 0
    );
  } catch (error) {
    console.error("Error getting reading position:", error);
    return 0;
  }
};
