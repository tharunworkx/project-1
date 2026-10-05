export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "default"
}) {

  const styles = {
    default: {
      card: "bg-white border-[#e7e3da]",
      icon: "bg-[#edf4ed] text-[#397267]",
      subtitle: "text-[#43816f]"
    },

    orange: {
      card: "bg-[#fcf2ec] border-[#f2e0d6]",
      icon: "bg-[#f9dfd1] text-[#d8663e]",
      subtitle: "text-[#d8663e]"
    },

    blue: {
      card: "bg-[#f0f5f5] border-[#dce8e6]",
      icon: "bg-[#dceae7] text-[#32766e]",
      subtitle: "text-[#43816f]"
    }
  };

  const current = styles[variant] || styles.default;

  return (
    <div className={`
      rounded-2xl
      border
      p-5
      ${current.card}
    `}>

      <div className="flex items-start justify-between">

        <div>

          <p className="text-[12px] font-medium text-[#66767c]">
            {title}
          </p>

          <h2 className="
            mt-2
            text-[27px]
            font-semibold
            tracking-[-0.03em]
            text-[#172b35]
          ">
            {value}
          </h2>

          <p className={`
            mt-2
            text-[11px]
            ${current.subtitle}
          `}>
            {subtitle}
          </p>

        </div>

        <div className={`
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          ${current.icon}
        `}>

          <Icon size={19} strokeWidth={1.7} />

        </div>

      </div>

    </div>
  );
}