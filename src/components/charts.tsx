import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

type textInfo = {
  id: string;
  value: string | null;
  className: string | undefined;
  entered: string | null;
  time: number | null;
};

interface ChartProps {
  readonly results: textInfo[];
}

export default function Charts({ results }: ChartProps) {

  let data = [];

  const totalChars = results.length;
  if(totalChars <= 20){
    data = results;
  }
  else {
    const step= Math.ceil(totalChars / 20);
    data = results.filter((_,index) => index % step === 0);
  }

  const start = results[0].time ?? 0;

  const filteredData = data.map((item, index) => {
    const elapsedMs = (item.time ?? 0) - start;
    const charIndex = results.findIndex( r => r.id === item.id) + 1;
    const minutes = Math.floor(elapsedMs / (1000 * 60));
    const seconds = Math.floor(charIndex / 1000 % 60);

    return {
      ...item,
      index,
      elapsed: `${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`,
      wpm: elapsedMs > 0 ? Math.round(((index + 1) /5) / ((elapsedMs / (1000 * 60)))) : 0
    };

  })

  console.log(data)

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={filteredData}>
        <XAxis dataKey="elapsed" label={{ value: "Time", position: "insideBottom", offset: -5 }} />
        <YAxis dataKey="wpm" label={{ value: "Words Per Minute", angle: -90, }} />
      </BarChart>
    </ResponsiveContainer>
  );
}
