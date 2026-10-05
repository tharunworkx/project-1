import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from "recharts";

const data = [
  { name: "Travel", value: 32 },
  { name: "Food", value: 21 },
  { name: "Accommodation", value: 18 },
  { name: "Fuel", value: 12 },
  { name: "Office", value: 10 },
  { name: "Other", value: 7 }
];

const colors = [
  "#286f68",
  "#ed8b52",
  "#579cc0",
  "#e17c86",
  "#8d6bb3",
  "#c7a85a"
];

export default function ExpenseBreakdown() {

  return (
    <div className="
      rounded-2xl
      border
      border-[#e7e3da]
      bg-white
      p-5
    ">

      <div className="flex items-center justify-between">

        <h2 className="text-[15px] font-semibold text-[#172b35]">
          Expense Breakdown
        </h2>

        <button className="text-[11px] text-[#28786f]">
          View all →
        </button>

      </div>

      <div className="relative mt-4 h-[185px]">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={75}
              paddingAngle={2}
              strokeWidth={0}
            >

              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={colors[index]}
                />
              ))}

            </Pie>

          </PieChart>

        </ResponsiveContainer>

        <div className="
          pointer-events-none
          absolute
          inset-0
          flex
          items-center
          justify-center
          text-center
        ">

          <div>

            <p className="text-[20px] font-semibold text-[#172b35]">
              ₹8.42L
            </p>

            <p className="text-[9px] text-[#7a858a]">
              Total Expenses
            </p>

          </div>

        </div>

      </div>

      <div className="space-y-2">

        {data.map((item, index) => (

          <div
            key={item.name}
            className="flex items-center justify-between"
          >

            <div className="flex items-center gap-2">

              <span
                className="h-2 w-2 rounded-full"
                style={{
                  backgroundColor: colors[index]
                }}
              />

              <span className="text-[10px] text-[#69787d]">
                {item.name}
              </span>

            </div>

            <span className="text-[10px] font-medium text-[#43545a]">
              {item.value}%
            </span>

          </div>

        ))}

      </div>

    </div>
  );
}