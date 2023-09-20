import React from "react";
import { endOfToday, set } from "date-fns";
import TimeRange from "..";
import { TimeRangeProps } from "../components/TimeRange";

const now = new Date();
const getTodayAtSpecificHour = (hour = 12) =>
  set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 });

const selectedStart = getTodayAtSpecificHour();
const selectedEnd = getTodayAtSpecificHour(14);

const startTime = getTodayAtSpecificHour(7);
const endTime = endOfToday();

const disabledIntervals = [
  { start: getTodayAtSpecificHour(16), end: getTodayAtSpecificHour(17) },
  { start: getTodayAtSpecificHour(7), end: getTodayAtSpecificHour(12) },
  { start: getTodayAtSpecificHour(20), end: getTodayAtSpecificHour(24) },
];

const TimeRangeTest = () => {
  const [state, setState] = React.useState<{
    error: boolean | undefined;
    selectedInterval: Date[];
  }>({
    error: false,
    selectedInterval: [selectedStart, selectedEnd],
  });

  const errorHandler = ({ error }: TimeRangeProps) =>
    setState({ ...state, error });

  const onChangeCallback = (selectedInterval: Date[]) =>
    setState({ ...state, selectedInterval });

  return (
    <TimeRange
      error={state.error}
      ticksNumber={20}
      step={1}
      selectedInterval={state.selectedInterval}
      timelineInterval={[startTime, endTime]}
      onUpdateCallback={errorHandler}
      onChangeCallback={onChangeCallback}
      disabledIntervals={disabledIntervals}
      showTooltip={true}
      showTimelineError={false}
    />
  );
};

export default TimeRangeTest;
