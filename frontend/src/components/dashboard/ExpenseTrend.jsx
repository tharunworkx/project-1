import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const data = [
  {
    month: "Jan",
    expenses: 32000,
    approved: 24000
  },
  {
    month: "Feb",
    expenses: 42000,
    approved: 31000
  },
  {
    month: "Mar",
    expenses: 38000,
    approved: 30000
  },
  {
    month: "Apr",
    expenses: 52000,
    approved: 42000
  },
  {
    month: "May",
    expenses: 46000,
    approved: 38000
  }
];

export default function ExpenseTrend() {

  return (
    <div className="
      rounded-2xl
      border
      border-[#e7e3da]
      bg-white
      p-5
    ">

      <div className="mb-4 flex items-center justify-between">

        <div>
          <h2 className="text-[15px] font-semibold text-[#172b35]">
            Expense Trend
          </h2>

          <p className="mt-1 text-[11px] text-[#78858a]">
            Monthly expense activity
          </p>
        </div>

        <div className="flex gap-1 rounded-lg bg-[#f5f3ed] p-1">

          {["7D", "30D", "3M", "6M", "1Y"].map(
            (period) => (
              <button
                key={period}
                className={`
                  rounded-md
                  px-2.5
                  py-1.5
                  text-[10px]
                  ${period === "3M"
                    ? "bg-white font-semibold text-[#172b35] shadow-sm"
                    : "text-[#7b8589]"
                  }
                `}
              >
                {period}
              </button>
            )
          )}

        </div>

      </div>

      <div className="h-[260px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <LineChart
            data={data}
            margin={{
              top: 10,
              right: 5,
              left: 0,
              bottom: 0
            }}
          >

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#ebe8e1"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#7b8589",
                fontSize: 10
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#7b8589",
                fontSize: 10
              }}
              tickFormatter={(value) =>
                `₹${value / 1000}k`
              }
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#e86b4b"
              strokeWidth={2}
              dot={{
                r: 3
              }}
            />

            <Line
              type="monotone"
              dataKey="approved"
              stroke="#28786f"
              strokeWidth={2}
              dot={{
                r: 3
              }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-2 flex gap-5 text-[10px] text-[#68777c]">

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#e86b4b]" />
          Total Expenses
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#28786f]" />
          Approved
        </div>

      </div>

    </div>
  );
}