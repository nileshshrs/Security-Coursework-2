import { FaTshirt } from "react-icons/fa";
import { MdAttachMoney } from "react-icons/md";
import { BsCartCheck } from "react-icons/bs";
import { HiUsers } from "react-icons/hi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const cards = [
  {
    label: "Total Sales",
    value: "$24,900",
    icon: <MdAttachMoney className="text-green-600 text-3xl" />,
    footer: "+8% this month",
    color: "bg-green-50"
  },
  {
    label: "Total Orders",
    value: "1,250",
    icon: <BsCartCheck className="text-blue-600 text-3xl" />,
    footer: "+4% this month",
    color: "bg-blue-50"
  },
  {
    label: "Total Products",
    value: "320",
    icon: <FaTshirt className="text-violet-600 text-3xl" />,
    footer: "New arrivals this week",
    color: "bg-violet-50"
  },
  {
    label: "Total Customers",
    value: "985",
    icon: <HiUsers className="text-yellow-600 text-3xl" />,
    footer: "+12 new today",
    color: "bg-yellow-50"
  },
];

// Random demo data
type TrafficData = {
  time: string;
  traffic: number;
};
const hours = Array.from({ length: 24 }, (_, i) => i);
const networkTraffic: TrafficData[] = hours.map(h => ({
  time: `${h}:00`,
  traffic: 150 + Math.round(Math.abs(Math.sin(h / 2) * 70) + Math.random() * 50),
}));

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
};
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="rounded-xl shadow-lg bg-white px-4 py-3 border border-gray-200">
      <div className="text-sm font-medium text-gray-700">
        Hour: <span className="font-bold">{label}</span>
      </div>
      <div className="text-xl font-bold text-indigo-600">{payload[0].value} visitors</div>
    </div>
  );
}

export default function DashboardOverview() {
  return (
    <div className="flex flex-col h-full min-h-screen px-0 py-8">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {cards.map(card => (
          <div
            key={card.label}
            className={`rounded-2xl shadow-md p-6 flex flex-col gap-2 transition hover:shadow-lg border ${card.color}`}
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-white p-2 shadow">{card.icon}</div>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500 font-semibold">{card.label}</span>
                <span className="text-2xl font-bold">{card.value}</span>
              </div>
            </div>
            <div className="mt-4 text-xs text-gray-600">{card.footer}</div>
          </div>
        ))}
      </div>
      {/* Network Traffic Overview */}
      <div className="flex-1 bg-gradient-to-br from-white via-indigo-50 to-violet-50 rounded-2xl shadow-xl border p-6 flex flex-col justify-between">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-1">Network Traffic</h2>
            <span className="text-gray-500 text-sm">Hourly Active Visitors (random demo data)</span>
          </div>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full shadow-sm">
            Today
          </span>
        </div>
        <div className="flex-1 min-h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={networkTraffic} margin={{ top: 28, right: 35, left: 8, bottom: 18 }}>
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="4 8" vertical={false} />
              <XAxis
                dataKey="time"
                interval={3}
                tickLine={false}
                axisLine={false}
                tick={{
                  fill: "#6366f1",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{
                  fill: "#a1a1aa",
                  fontWeight: 600,
                  fontSize: 12,
                }}
                width={40}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#6366f11a" }} />
              <Line
                type="monotone"
                dataKey="traffic"
                stroke="#6366f1"
                strokeWidth={4}
                dot={{
                  r: 5,
                  fill: "#6366f1",
                  stroke: "#fff",
                  strokeWidth: 2,
                  filter: "drop-shadow(0 4px 12px #6366f133)",
                }}
                activeDot={{
                  r: 8,
                  fill: "#fff",
                  stroke: "#6366f1",
                  strokeWidth: 4,
                  filter: "drop-shadow(0 2px 6px #6366f155)",
                }}
                isAnimationActive={true}
                animationDuration={1200}
                legendType="none"
                className="z-10"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
