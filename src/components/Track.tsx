import { GetTrackProps } from "react-compound-slider";

const getTrackConfig = ({
  error,
  source,
  target,
  showTimelineError,
  disabled,
}: Omit<TrackProps, "getTrackProps">) => {
  const basicStyle = {
    left: `${source.percent}%`,
    width: `calc(${target.percent - source.percent}% - 1px)`,
  };

  if (disabled) return basicStyle;

  const coloredTrackStyle =
    error && showTimelineError
      ? {
          backgroundColor: "rgba(214,0,11,0.5)",
          borderLeft: "1px solid rgba(214,0,11,0.5)",
          borderRight: "1px solid rgba(214,0,11,0.5)",
        }
      : {
          backgroundColor: "rgba(98, 203, 102, 0.7)",
          borderLeft: "1px solid #62CB66",
          borderRight: "1px solid #62CB66",
        };

  return { ...basicStyle, ...coloredTrackStyle };
};

export interface TrackProps {
  error?: boolean;
  source: {
    value: number;
    percent: number;
  };
  target: {
    value: number;
    percent: number;
  };
  showTimelineError: boolean;
  getTrackProps: GetTrackProps;
  disabled?: boolean;
}

const Track = ({
  error,
  source,
  target,
  showTimelineError,
  getTrackProps,
  disabled = false,
}: TrackProps) => (
  <div
    className={`react_time_range__track${disabled ? "__disabled" : ""}`}
    style={getTrackConfig({
      error,
      source,
      target,
      showTimelineError,
      disabled,
    })}
    {...getTrackProps()}
  />
);

export default Track;
