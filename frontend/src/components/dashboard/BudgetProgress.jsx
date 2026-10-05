const budgets = [
  {
    name: "Travel",
    amount: "₹1,50,000",
    used: "₹1,12,500",
    percentage: 75,
    color: "bg-[#28786f]"
  },
  {
    name: "Food",
    amount: "₹70,000",
    used: "₹45,500",
    percentage: 65,
    color: "bg-[#ed8b52]"
  },
  {
    name: "Accommodation",
    amount: "₹1,00,000",
    used: "₹82,000",
    percentage: 82,
    color: "bg-[#579cc0]"
  },
  {
    name: "Office Supplies",
    amount: "₹50,000",
    used: "₹21,500",
    percentage: 43,
    color: "bg-[#8d6bb3]"
  }
];

export default function BudgetProgress() {

  return (
    <div className="
      rounded-2xl
      border
      border-[#e7e3da]
      bg-white
      p-5
    ">

      <div className="mb-5 flex items-center justify-between">

        <h2 className="text-[15px] font-semibold text-[#172b35]">
          Budgets
        </h2>

        <button className="text-[11px] text-[#28786f]">
          View all →
        </button>

      </div>

      <div className="space-y-5">

        {budgets.map((budget) => (

          <div key={budget.name}>

            <div className="mb-2 flex items-center justify-between">

              <div>

                <p className="text-[11px] font-medium text-[#34484e]">
                  {budget.name}
                </p>

                <p className="mt-0.5 text-[9px] text-[#8a9599]">
                  {budget.used} of {budget.amount}
                </p>

              </div>

              <span className="text-[10px] font-semibold text-[#53646a]">
                {budget.percentage}%
              </span>

            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[#eeeae3]">

              <div
                className={`h-full rounded-full ${budget.color}`}
                style={{
                  width: `${budget.percentage}%`
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}