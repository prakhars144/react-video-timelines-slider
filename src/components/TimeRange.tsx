import { scaleTime } from "d3-scale";
import {
  addHours,
  addMinutes,
  differenceInMilliseconds,
  endOfToday,
  format,
  isAfter,
  isBefore,
  set,
  startOfToday,
} from "date-fns";
import { Handles, Rail, Slider, Ticks, Tracks } from "react-compound-slider";

import Handle from "./Handle";
import SliderRail from "./SliderRail";
import Tick from "./Tick";
import Track from "./Track";

import "./TimeRange.scss";

const getTimelineConfig =
  (timelineStart: Date, timelineLength: number) => (date: Date) => {
    const percent =
      (differenceInMilliseconds(date, timelineStart) / timelineLength) * 100;
    const value = Number(format(date, "T"));
    return { percent, value };
  };

const getFormattedBlockedIntervals = (
  blockedDates: { start: Date; end: Date }[] = [],
  [startTime, endTime]: Date[]
) => {
  if (!blockedDates.length) return undefined;

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

const getNowConfig = ([startTime, endTime]: Date[]) => {
  const timelineLength = differenceInMilliseconds(endTime, startTime);
  const getConfig = getTimelineConfig(startTime, timelineLength);

  const source = getConfig(new Date());
  const target = getConfig(addMinutes(new Date(), 1));

  return { id: "now-track", source, target };
};

export interface TimeRangeProps {
  sliderRailClassName?: string;
  timelineInterval?: Date[];
  selectedInterval?: Date[];
  disabledIntervals?: { start: Date; end: Date }[];
  containerClassName?: string;
  step?: number;
  ticksNumber?: number;
  error?: boolean;
  showNow?: boolean;
  formatTick?: (ms: number) => string;
  formatTooltip?: (ms: number) => string;
  tooltipTag?: string;
  mode?: 1 | 2 | 3;
  showTimelineError?: boolean;
  showTooltip?: boolean;
  onUpdateCallback?: (data: { error: boolean; time: Date[] }) => void;
  onChangeCallback?: (data: Date[]) => void;
  onHandlesClick?: (id: string, value: number) => void;
}

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
  onUpdateCallback = () => {},
  onChangeCallback,
  onHandlesClick,
}: TimeRangeProps) => {
  const disabledIntervalsConfig = getFormattedBlockedIntervals(
    disabledIntervals,
    timelineInterval
  );
  const now = getNowConfig(timelineInterval);

  const onChange = (newTime: ReadonlyArray<number>) => {
    const formattedNewTime = newTime.map((t) => new Date(t));
    if (onChangeCallback) onChangeCallback(formattedNewTime);
  };

  const checkIsSelectedIntervalNotValid = (
    [start, end]: readonly number[],
    source: { value: number },
    target: { value: number }
  ) => {
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

  const onUpdate = (newTime: ReadonlyArray<number>) => {
    if (disabledIntervalsConfig?.length) {
      const isValuesNotValid = disabledIntervalsConfig.some(
        ({ source, target }) =>
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

  const domain: [number, number] = [
    Number(timelineInterval[0]),
    Number(timelineInterval[1]),
  ];

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
                  onHandleClick={onHandlesClick}
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

        {disabledIntervalsConfig?.length ? (
          <Tracks left={false} right={false}>
            {({ getTrackProps }) => (
              <>
                {disabledIntervalsConfig.map(({ id, source, target }) => (
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
        ) : undefined}

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
        ) : undefined}

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

export default TimeRange;
