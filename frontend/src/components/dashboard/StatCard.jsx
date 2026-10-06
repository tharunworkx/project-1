import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function StatCard({
  icon: Icon,
  value,
  title,
  changePercentage,
  isPositive = true,
  className
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center gap-2.5 pb-2">
        <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-sm">
          <Icon className="size-4.5" />
        </div>
        <span className="text-2xl font-bold tracking-tight text-foreground">{value}</span>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5 pt-0">
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <p className="flex items-center gap-1.5 text-xs">
          <span className={isPositive ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-destructive font-medium"}>
            {changePercentage}
          </span>
          <span className="text-muted-foreground">than last month</span>
        </p>
      </CardContent>
    </Card>
  );
}