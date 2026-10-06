import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const budgets = [
  {
    name: "Engineering & Cloud",
    amount: "₹3,50,000",
    used: "₹2,62,500",
    percentage: 75,
  },
  {
    name: "Sales & Client Dinners",
    amount: "₹1,80,000",
    used: "₹1,56,600",
    percentage: 87,
  },
  {
    name: "Marketing & Conferences",
    amount: "₹2,20,000",
    used: "₹1,21,000",
    percentage: 55,
  },
  {
    name: "Operations & Facilities",
    amount: "₹1,00,000",
    used: "₹42,000",
    percentage: 42,
  },
];

export default function BudgetProgress() {
  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div>
          <CardTitle className="text-base font-semibold text-foreground">Department Budgets</CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Quarterly department threshold monitoring
          </CardDescription>
        </div>
        <Button asChild variant="ghost" size="sm" className="gap-1 text-xs text-muted-foreground hover:text-foreground">
          <Link to="/budgets">
            Manage
            <ArrowUpRight className="size-3.5" />
          </Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        {budgets.map((budget) => {
          const isHigh = budget.percentage >= 80;
          return (
            <div key={budget.name} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-foreground">{budget.name}</span>
                  <span className="ml-2 text-muted-foreground text-[11px]">
                    {budget.used} / {budget.amount}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {isHigh && <ShieldAlert className="size-3.5 text-destructive" />}
                  <span className={`font-bold ${isHigh ? "text-destructive" : "text-foreground"}`}>
                    {budget.percentage}%
                  </span>
                </div>
              </div>
              <Progress
                value={budget.percentage}
                className="h-2"
                indicatorClassName={isHigh ? "bg-destructive" : "bg-primary"}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}