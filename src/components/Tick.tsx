export interface TickProps {
  tick: {
    id: string;
    value: number;
    percent: number;
  };
  count: number;
  format: (d: number) => string;
}

const Tick = ({ tick, count, format = (d) => d.toString() }: TickProps) => {
  const tickLabelStyle = {
    marginLeft: `${-(100 / count) / 2}%`,
    width: `${100 / count}%`,
    left: `${tick.percent}%`,
  };

  return (
    <>
      <div
        className="react_time_range__tick_marker__large"
        style={{ left: `${tick.percent}%` }}
      />
      <div className="react_time_range__tick_label" style={tickLabelStyle}>
        {format(tick.value)}
      </div>
    </>
  );
};

export default Tick;
