import {
  EllipsisVertical,
  ChevronUp,
  Plane,
  Utensils,
  Hotel,
  Fuel,
  Building,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

const spendingData = [
  {
    icon: Plane,
    category: "Travel & Commute",
    subtitle: "Flights & Train booking",
    spent: "₹2,72,500",
    progress: 75,
  },
  {
    icon: Utensils,
    category: "Food & Meals",
    subtitle: "Client dinners & Lunches",
    spent: "₹1,45,200",
    progress: 55,
  },
  {
    icon: Hotel,
    category: "Accommodation",
    subtitle: "Hotels & Stays",
    spent: "₹1,82,000",
    progress: 68,
  },
  {
    icon: Fuel,
    category: "Fuel & Transit",
    subtitle: "Local travel allowance",
    spent: "₹94,500",
    progress: 42,
  },
  {
    icon: Building,
    category: "Office Supplies",
    subtitle: "Hardware & Consumables",
    spent: "₹72,400",
    progress: 30,
  },
];

export default function ExpenseBreakdown() {
  return (
    <Card className="shadow-xs flex flex-col justify-between">
      <CardContent className="flex flex-col gap-4 p-5 pb-3">
        {/* Card Header with Ellipsis Menu */}
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-foreground">Top Spending Categories</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground size-7 rounded-full">
                <EllipsisVertical className="size-4" />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer">Refresh Data</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Export Summary</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">Set Budgets</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Big Total & Comparison */}
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">₹8,42,450</span>
            <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <ChevronUp className="size-3.5" />
              <span>12.8%</span>
            </span>
          </div>
          <span className="text-muted-foreground text-xs">Total department expenses this quarter</span>
        </div>
      </CardContent>

      {/* Categories List with Progress Bars */}
      <CardContent className="flex flex-col gap-3.5 p-5 pt-0">
        {spendingData.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.category} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="size-9 rounded-sm">
                  <AvatarFallback className="bg-primary/10 text-primary rounded-sm">
                    <Icon className="size-4.5" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-semibold text-foreground">{item.category}</span>
                  <span className="text-[11px] text-muted-foreground">{item.subtitle}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 min-w-28">
                <span className="text-xs font-semibold text-foreground">{item.spent}</span>
                <Progress value={item.progress} className="w-28 h-1.5" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}