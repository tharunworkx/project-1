const expenses = [
  {
    employee: "Arun Kumar",
    category: "Travel",
    date: "05 Oct 2026",
    status: "Approved",
    amount: "₹4,850"
  },
  {
    employee: "Priya Sharma",
    category: "Food",
    date: "04 Oct 2026",
    status: "Pending",
    amount: "₹1,240"
  },
  {
    employee: "Rahul S",
    category: "Fuel",
    date: "04 Oct 2026",
    status: "Approved",
    amount: "₹2,100"
  },
  {
    employee: "Karthik M",
    category: "Office",
    date: "03 Oct 2026",
    status: "Review",
    amount: "₹3,450"
  },
  {
    employee: "Divya R",
    category: "Accommodation",
    date: "02 Oct 2026",
    status: "Approved",
    amount: "₹7,800"
  }
];

function StatusBadge({ status }) {

  const styles = {
    Approved: "bg-[#e7f2eb] text-[#31725e]",
    Pending: "bg-[#fff0e5] text-[#d36d42]",
    Review: "bg-[#eee8f5] text-[#8064a2]"
  };

  return (
    <span className={`
      rounded-full
      px-2.5
      py-1
      text-[9px]
      font-medium
      ${styles[status]}
    `}>
      {status}
    </span>
  );
}

export default function RecentExpenses() {

  return (
    <div className="
      overflow-hidden
      rounded-2xl
      border
      border-[#e7e3da]
      bg-white
    ">

      <div className="
        flex
        items-center
        justify-between
        border-b
        border-[#eeeae3]
        px-5
        py-4
      ">

        <h2 className="text-[15px] font-semibold text-[#172b35]">
          Recent Expenses
        </h2>

        <button className="text-[11px] text-[#28786f]">
          View all →
        </button>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>

            <tr className="border-b border-[#eeeae3]">

              <th className="px-5 py-3 text-left text-[9px] font-medium uppercase tracking-wide text-[#8a9599]">
                Employee
              </th>

              <th className="px-4 py-3 text-left text-[9px] font-medium uppercase tracking-wide text-[#8a9599]">
                Category
              </th>

              <th className="px-4 py-3 text-left text-[9px] font-medium uppercase tracking-wide text-[#8a9599]">
                Date
              </th>

              <th className="px-4 py-3 text-left text-[9px] font-medium uppercase tracking-wide text-[#8a9599]">
                Status
              </th>

              <th className="px-5 py-3 text-right text-[9px] font-medium uppercase tracking-wide text-[#8a9599]">
                Amount
              </th>

            </tr>

          </thead>

          <tbody>

            {expenses.map((expense) => (

              <tr
                key={`${expense.employee}-${expense.date}`}
                className="border-b border-[#f1eee8] last:border-0 hover:bg-[#faf9f6]"
              >

                <td className="px-5 py-3.5 text-[11px] font-medium text-[#273a40]">
                  {expense.employee}
                </td>

                <td className="px-4 py-3.5 text-[10px] text-[#65757b]">
                  {expense.category}
                </td>

                <td className="px-4 py-3.5 text-[10px] text-[#65757b]">
                  {expense.date}
                </td>

                <td className="px-4 py-3.5">
                  <StatusBadge status={expense.status} />
                </td>

                <td className="px-5 py-3.5 text-right text-[11px] font-semibold text-[#273a40]">
                  {expense.amount}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}