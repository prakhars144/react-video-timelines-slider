import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./tooltip.scss";

export const SliderRail = ({
  getEventData,
  formatTooltip,
  getRailProps,
  activeHandleID,
  showTooltip,
  tooltipTag,
}) => {
  const [percent, setPercent] = useState(null);
  const [value, setValue] = useState(null);

  const scrollCallback = useCallback((e) => {
    if (activeHandleID) {
      setValue(null);
      setPercent(null);
    } else {
      const { value, percent } = getEventData(e);
      setValue(value);
      setPercent(percent);
    }
  }, []);

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
        className="react_time_range__rail__outer"
        {...getRailProps({
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave,
        })}
      />
      <div className="react_time_range__rail__inner" />
    </>
  );
};

SliderRail.propTypes = {
  getEventData: PropTypes.func.isRequired,
  getRailProps: PropTypes.func.isRequired,
  formatTooltip: PropTypes.func.isRequired,
  activeHandleID: PropTypes.string.isRequired,
  showTooltip: PropTypes.bool.isRequired,
  tooltipTag: PropTypes.string.isRequired,
};

export default SliderRail;
