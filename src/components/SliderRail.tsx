import { useCallback, useState } from "react";
import { GetRailProps } from "react-compound-slider";
import "./tooltip.scss";

export interface SliderRailProps {
  getEventData: (e: MouseEvent) => { value: number; percent: number };
  formatTooltip: (ms: number) => string;
  getRailProps: GetRailProps;
  activeHandleID: string;
  showTooltip: boolean;
  tooltipTag: string;
  className?: string;
}

export const SliderRail = ({
  getEventData,
  formatTooltip,
  getRailProps,
  activeHandleID,
  showTooltip,
  tooltipTag,
  className,
}: SliderRailProps) => {
  const [percent, setPercent] = useState<number | null>(null);
  const [value, setValue] = useState<number | null>(null);

  const scrollCallback = useCallback(
    (e: MouseEvent) => {
      if (activeHandleID) {
        setValue(null);
        setPercent(null);
      } else {
        const { value, percent } = getEventData(e);
        setValue(value);
        setPercent(percent);
      }
    },
    [activeHandleID, getEventData]
  );

  const onMouseEnter = () => {
    document.addEventListener("mousemove", scrollCallback, true);
  };

  const onMouseLeave = () => {
    setValue(null);
    setPercent(null);
    document.removeEventListener("mousemove", scrollCallback, true);
  };

  return (
    <>
      {!activeHandleID && showTooltip && value ? (
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
        className={
          "react_time_range__rail__outer" + (className ? " " + className : "")
        }
        {...getRailProps({
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave,
        })}
      />
      <div className="react_time_range__rail__inner" />
    </>
  );
};

export default SliderRail;
