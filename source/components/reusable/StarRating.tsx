import { randomString } from "@/source/helpers";
import { useMemo, useRef, useState } from "react";
import { FaRegStar, FaRegStarHalfStroke, FaStar } from "react-icons/fa6";

const StarRating = ({
  value: _value = 0,
  onInput,
  max = 5,
  className,
}: {
  value: number;
  onInput?: (value: number) => void;
  max?: number;
  className?: string;
}) => {
  const value = useMemo(() => Math.round(_value * 2) / 2, [_value]);
  const { current: stars } = useRef(
    Array.from({ length: max }, (_, i) => ({
      star: i + 1,
      id: randomString(10),
    }))
  );
  const [hovered, setHovered] = useState<{
    id: string;
    star: number;
  } | null>(null);

  const handleClick = (star: { star: number }) => {
    if (onInput) onInput(star.star);
  };

  return (
    <div className="flex items-center">
      {stars.map((star) => {
        const status: "full" | "half" | "empty" =
          (hovered?.star || -1) >= star.star
            ? "full"
            : (hovered?.star || 6) <= star.star
            ? "empty"
            : value >= star.star
            ? "full"
            : value + 0.5 >= star.star
            ? "half"
            : "empty";

        return (
          <div
            key={star.id}
            className={
              "relative " +
              (onInput ? " cursor-pointer  " : "") +
              (className || "w-6.5 text-xl")
            }
            onClick={() => handleClick(star)}
            onMouseEnter={() => onInput && setHovered(star)}
            onMouseLeave={() => onInput && setHovered(null)}
          >
            {status === "full" ? (
              <FaStar className="text-[#ffd700]" />
            ) : status === "half" ? (
              <FaRegStarHalfStroke className="text-[#ffd700]" />
            ) : (
              <FaRegStar className="text-gray-300" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export const StarRatingSkeleton = ({
  className,
  max = 5,
}: {
  max?: number;
  className?: string;
}) => {
  const { current: stars } = useRef(
    Array.from({ length: max }, (_, i) => ({
      star: i + 1,
      id: randomString(10),
    }))
  );

  return (
    <div className="flex items-center">
      {stars.map((star) => {
        return (
          <div
            key={star.id}
            className={"relative " + (className || "w-6.5 text-xl")}
          >
            <FaStar className="skeleton-text" />
          </div>
        );
      })}
    </div>
  );
};

export default StarRating;
