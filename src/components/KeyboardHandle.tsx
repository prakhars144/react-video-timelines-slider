import { GetHandleProps } from "react-compound-slider";

export interface KeyboardHandleProps {
  domain: [number, number];
  handle: {
    id: string;
    value: number;
    percent: number;
  };
  disabled?: boolean;
  getHandleProps: GetHandleProps;
}

const KeyboardHandle = ({
  domain: [min, max],
  handle: { id, value, percent = 0 },
  disabled = false,
  getHandleProps,
}: KeyboardHandleProps) => (
  <button
    role="slider"
    aria-valuemin={min}
    aria-valuemax={max}
    aria-valuenow={value}
    className="react_time_range__keyboard_handle"
    style={{
      left: `${percent}%`,
      backgroundColor: disabled ? "#666" : "#ffc400",
    }}
    {...getHandleProps(id)}
  />
);

export default KeyboardHandle;
