export type DonutSlice = {
  id: string;
  value: number;
  color: string;
};

type DonutChartProps = {
  slices: DonutSlice[];
  totalLabel?: string;
  totalValue?: string;
  size?: number;
  radius?: number;
  strokeWidth?: number;
};

export function DonutChart({
  slices,
  totalLabel = "Total",
  totalValue = "0.00",
  size = 240,
  radius = 78,
  strokeWidth = 44,
}: DonutChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;
  const safeSlices = slices.filter((slice) => slice.value > 0);
  const total = safeSlices.reduce((sum, slice) => sum + slice.value, 0);

  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#27272a"
        strokeWidth={strokeWidth}
      />

      {total > 0 &&
        safeSlices.map((slice) => {
          const arc = (slice.value / total) * circumference;
          const currentOffset = offset;
          offset += arc;

          return (
            <circle
              key={slice.id}
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke={slice.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${arc} ${circumference - arc}`}
              strokeDashoffset={-currentOffset}
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
        })}

      <circle cx={cx} cy={cy} r={50} fill="#09090b" />
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        className="fill-zinc-300 text-[12px]"
      >
        {totalLabel}
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        className="fill-zinc-100 text-[16px] font-semibold"
      >
        {totalValue}
      </text>
    </svg>
  );
}
