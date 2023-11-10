import PropTypes from "prop-types";
import React, { useState } from "react";
import "./tooltip.scss";

const Handle = ({
  error,
  domain: [min, max],
  handle: { id, value, percent = 0 },
  disabled,
  showTimelineError,
  formatTooltip,
  getHandleProps,
  isActive,
  showTooltip,
  tooltipTag,
}) => {
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
          <div className='tooltip'>
            <span className='tooltiptext'>
              {tooltipTag + " " + formatTooltip(value)}
            </span>
          </div>
        </div>
      ) : null}
      <div
        className='react_time_range__handle_wrapper'
        style={{ left: leftPosition }}
        {...getHandleProps(id, {
          onMouseEnter: () => setMouseOver(true),
          onMouseLeave: () => setMouseOver(false),
        })}
      />
      <div
        role='slider'
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

Handle.propTypes = {
  domain: PropTypes.array.isRequired,
  handle: PropTypes.shape({
    id: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    percent: PropTypes.number.isRequired,
  }).isRequired,
  getHandleProps: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  formatTooltip: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  showTooltip: PropTypes.bool.isRequired,
  tooltipTag: PropTypes.string.isRequired,
};

Handle.defaultProps = { disabled: false };

export default Handle;
