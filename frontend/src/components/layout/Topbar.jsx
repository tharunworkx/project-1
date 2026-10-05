import {
  Search,
  Bell,
  ChevronDown,
  Command
} from "lucide-react";

export default function Topbar() {

  return (
    <header className="
      fixed
      left-[255px]
      right-0
      top-0
      z-30
      h-[68px]
      border-b
      border-[#e5e2da]
      bg-[#fdfcf9]
    ">

      <div className="flex h-full items-center justify-between px-7">

        {/* Search */}

        <div className="
          flex
          h-10
          w-[470px]
          items-center
          rounded-xl
          border
          border-[#e6e3dc]
          bg-[#f7f5f0]
          px-3
        ">

          <Search
            size={18}
            className="text-[#738087]"
          />

          <input
            type="text"
            placeholder="Search expenses, employees, projects..."
            className="
              ml-3
              flex-1
              bg-transparent
              text-sm
              text-[#172b35]
              outline-none
              placeholder:text-[#78858a]
            "
          />

          <div className="
            flex
            items-center
            gap-1
            rounded-md
            border
            border-[#dedbd4]
            px-1.5
            py-1
            text-[10px]
            text-[#7b8589]
          ">
            <Command size={11} />
            K
          </div>

        </div>

        {/* Right side */}

        <div className="flex items-center gap-6">

          {/* Notification */}

          <button className="relative text-[#34464c]">

            <Bell size={20} strokeWidth={1.7} />

            <span className="
              absolute
              -right-1
              -top-1
              h-2.5
              w-2.5
              rounded-full
              border-2
              border-[#fdfcf9]
              bg-[#e86c4a]
            " />

          </button>

          <div className="h-7 w-px bg-[#e3e0d8]" />

            {/* Profile */}

            <button className="flex items-center gap-3">

              <div className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-[#d9e4d3]
              text-sm
              font-semibold
              text-[#315047]
            ">
                TH
              </div>

              <div className="text-left">

                <p className="text-[13px] font-semibold text-[#172b35]">
                  Tharun
                </p>

                <p className="text-[11px] text-[#748187]">
                  Administrator
                </p>

              </div>

              <ChevronDown
                size={16}
                className="text-[#637176]"
              />

            </button>

        </div>

      </div>

    </header>
  );
}