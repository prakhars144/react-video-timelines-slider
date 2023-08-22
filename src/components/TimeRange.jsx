import React from "react";
import PropTypes from "prop-types";
import { scaleTime } from "d3-scale";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import {
  format,
  addHours,
  startOfToday,
  endOfToday,
  differenceInMilliseconds,
  isBefore,
  isAfter,
  set,
  addMinutes,
} from "date-fns";

import SliderRail from "./SliderRail.jsx";
import Track from "./Track.jsx";
import Tick from "./Tick.jsx";
import Handle from "./Handle.jsx";

import "./TimeRange.scss";

const getTimelineConfig = (timelineStart, timelineLength) => (date) => {
  const percent =
    (differenceInMilliseconds(date, timelineStart) / timelineLength) * 100;
  const value = Number(format(date, "T"));
  return { percent, value };
};

const getFormattedBlockedIntervals = (
  blockedDates = [],
  [startTime, endTime]
) => {
  if (!blockedDates.length) return null;

  const timelineLength = differenceInMilliseconds(endTime, startTime);
  const getConfig = getTimelineConfig(startTime, timelineLength);

  const formattedBlockedDates = blockedDates.map((interval, index) => {
    let { start, end } = interval;

    if (isBefore(start, startTime)) start = startTime;
    if (isAfter(end, endTime)) end = endTime;

    const source = getConfig(start);
    const target = getConfig(end);

    return { id: `blocked-track-${index}`, source, target };
  });

  return formattedBlockedDates;
};

const getNowConfig = ([startTime, endTime]) => {
  const timelineLength = differenceInMilliseconds(endTime, startTime);
  const getConfig = getTimelineConfig(startTime, timelineLength);

  const source = getConfig(new Date());
  const target = getConfig(addMinutes(new Date(), 1));

  return { id: "now-track", source, target };
};

const TimeRange = ({
  sliderRailClassName,
  timelineInterval = [startOfToday(), endOfToday()],
  selectedInterval = [
    set(new Date(), { minutes: 0, seconds: 0, milliseconds: 0 }),
    set(addHours(new Date(), 1), { minutes: 0, seconds: 0, milliseconds: 0 }),
  ],
  disabledIntervals = [],
  containerClassName,
  step = 1000 * 60 * 30,
  ticksNumber = 48,
  error = false,
  showNow,
  formatTick = (ms) => format(new Date(ms), "HH:mm"),
  formatTooltip = (ms) => format(new Date(ms), "HH:mm:ss"),
  tooltipTag = "Value:",
  mode = 3,
  showTimelineError = false,
  showTooltip = true,
  onUpdateCallback,
  onChangeCallback,
}) => {
  function disabledIntervals() {
    return getFormattedBlockedIntervals(disabledIntervals, timelineInterval);
  }

  function now() {
    return getNowConfig(timelineInterval);
  }

  const onChange = (newTime) => {
    const formattedNewTime = newTime.map((t) => new Date(t));
    onChangeCallback(formattedNewTime);
  };

  const checkIsSelectedIntervalNotValid = ([start, end], source, target) => {
    const { value: startInterval } = source;
    const { value: endInterval } = target;

    if (
      (startInterval > start && endInterval <= end) ||
      (startInterval >= start && endInterval < end)
    )
      return true;
    if (start >= startInterval && end <= endInterval) return true;

    const isStartInBlockedInterval =
      start > startInterval && start < endInterval && end >= endInterval;
    const isEndInBlockedInterval =
      end < endInterval && end > startInterval && start <= startInterval;

    return isStartInBlockedInterval || isEndInBlockedInterval;
  };

  const onUpdate = (newTime) => {
    if (disabledIntervals?.length) {
      const isValuesNotValid = disabledIntervals.some(({ source, target }) =>
        checkIsSelectedIntervalNotValid(newTime, source, target)
      );
      const formattedNewTime = newTime.map((t) => new Date(t));
      onUpdateCallback({ error: isValuesNotValid, time: formattedNewTime });
      return;
    }

    const formattedNewTime = newTime.map((t) => new Date(t));
    onUpdateCallback({ error: false, time: formattedNewTime });
  };

  const getDateTicks = () => {
    return scaleTime()
      .domain(timelineInterval)
      .ticks(ticksNumber)
      .map((t) => +t);
  };

  const domain = timelineInterval.map((t) => Number(t));

  return (
    <div
      className={containerClassName || "react_time_range__time_range_container"}
    >
      <Slider
        mode={mode}
        step={step}
        domain={domain}
        onUpdate={onUpdate}
        onChange={onChange}
        values={selectedInterval.map((t) => +t)}
        rootStyle={{ position: "relative", width: "100%" }}
      >
        <Rail>
          {({ getRailProps, getEventData, activeHandleID }) => (
            <SliderRail
              className={sliderRailClassName}
              activeHandleID={activeHandleID}
              getRailProps={getRailProps}
              getEventData={getEventData}
              formatTooltip={formatTooltip}
              showTooltip={showTooltip}
              tooltipTag={tooltipTag}
            />
          )}
        </Rail>

        <Handles>
          {({ handles, getHandleProps, activeHandleID }) => (
            <>
              {handles.map((handle) => (
                <Handle
                  error={error}
                  key={handle.id}
                  handle={handle}
                  domain={domain}
                  getHandleProps={getHandleProps}
                  showTimelineError={showTimelineError}
                  formatTooltip={formatTooltip}
                  isActive={handle.id === activeHandleID}
                  showTooltip={showTooltip}
                  tooltipTag={tooltipTag}
                />
              ))}
            </>
          )}
        </Handles>

        <Tracks left={false} right={false}>
          {({ tracks, getTrackProps }) => (
            <>
              {tracks?.map(({ id, source, target }) => (
                <Track
                  error={error}
                  key={id}
                  source={source}
                  target={target}
                  getTrackProps={getTrackProps}
                  showTimelineError={showTimelineError}
                />
              ))}
            </>
          )}
        </Tracks>

        {disabledIntervals?.length ?(
          <Tracks left={false} right={false}>
            {({ getTrackProps }) => (
              <>
                {disabledIntervals.map(({ id, source, target }) => (
                  <Track
                    key={id}
                    source={source}
                    target={target}
                    getTrackProps={getTrackProps}
                    showTimelineError={showTimelineError}
                    disabled
                  />
                ))}
              </>
            )}
          </Tracks>
        ): undefined}

        {showNow ? (
          <Tracks left={false} right={false}>
            {({ getTrackProps }) => (
              <Track
                key={now?.id}
                source={now?.source}
                target={now?.target}
                getTrackProps={getTrackProps}
                showTimelineError={showTimelineError}
              />
            )}
          </Tracks>
        ): undefined}

        <Ticks values={getDateTicks()}>
          {({ ticks }) => (
            <>
              {ticks.map((tick) => (
                <Tick
                  key={tick.id}
                  tick={tick}
                  count={ticks.length}
                  format={formatTick}
                />
              ))}
            </>
          )}
        </Ticks>
      </Slider>
    </div>
  );
};

TimeRange.propTypes = {
  ticksNumber: PropTypes.number.isRequired,
  selectedInterval: PropTypes.arrayOf(PropTypes.object),
  timelineInterval: PropTypes.arrayOf(PropTypes.object),
  disabledIntervals: PropTypes.arrayOf(PropTypes.object),
  containerClassName: PropTypes.string,
  sliderRailClassName: PropTypes.string,
  step: PropTypes.number,
  formatTick: PropTypes.func,
  formatTooltip: PropTypes.func,
  showTimelineError: PropTypes.bool,
  showTooltip: PropTypes.bool,
  tooltipTag: PropTypes.string,
  error: PropTypes.bool,
  onChangeCallback: PropTypes.func,
  onUpdateCallback: PropTypes.func,
};

export default TimeRange;
