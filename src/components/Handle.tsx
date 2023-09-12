import { useState } from "react";
import { GetHandleProps } from "react-compound-slider";
import "./tooltip.scss";

export interface HandleProps {
  error: boolean;
  domain: [number, number];
  handle: {
    id: string;
    value: number;
    percent: number;
  };
  disabled?: boolean;
  showTimelineError?: boolean;
  formatTooltip: (ms: number) => string;
  getHandleProps: GetHandleProps;
  isActive: boolean;
  showTooltip: boolean;
  tooltipTag: string;
  onHandleClick?: (id: string, value: number) => void;
}

const Handle = ({
  error,
  domain: [min, max],
  handle: { id, value, percent = 0 },
  disabled = false,
  showTimelineError,
  formatTooltip,
  getHandleProps,
  isActive,
  showTooltip,
  tooltipTag,
  onHandleClick,
}: HandleProps) => {
  const leftPosition = `${percent}%`;
  const [mouseOver, setMouseOver] = useState(false);

  return (
    <>
      {(mouseOver || isActive) && !disabled && showTooltip ? (
        <div
          style={{
            left: `${percent}%`,
            position: "absolute",
            marginLeft: "-11px",
            marginTop: "-35px",
          }}
        >
          <div className="tooltip">
            <span className="tooltiptext">
              {tooltipTag + " " + formatTooltip(value)}
            </span>
          </div>
        </div>
      ) : null}
      <div
        className="react_time_range__handle_wrapper"
        style={{ left: leftPosition }}
        {...getHandleProps(id, {
          onMouseEnter: () => setMouseOver(true),
          onMouseLeave: () => setMouseOver(false),
        })}
        onClick={() => onHandleClick?.(id, value)}
      />
      <div
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        className={`react_time_range__handle_container${
          disabled ? "__disabled" : ""
        }`}
        style={{ left: leftPosition }}
      >
        <div
          className={`react_time_range__handle_marker${
            error && showTimelineError ? "__error" : ""
          }`}
        />
      </div>
    </>
  );
};

export default Handle;
