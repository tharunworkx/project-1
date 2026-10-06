import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/50">
      <div className="text-muted-foreground mx-auto flex size-full max-w-360 items-center justify-between gap-3 px-4 py-3.5 max-sm:flex-col sm:gap-6 sm:px-6 text-xs">
        <p className="text-balance max-sm:text-center">
          {`© ${new Date().getFullYear()}`}{" "}
          <span className="font-semibold text-foreground">ExpenseHub</span>
          , Enterprise Expense Management System
        </p>
        <div className="flex items-center gap-5 max-sm:hidden">
          <Link to="/admin/policies" className="text-muted-foreground hover:text-foreground transition">
            Compliance Policy
          </Link>
          <Link to="/reports" className="text-muted-foreground hover:text-foreground transition">
            Audit Reports
          </Link>
          <Link to="/settings" className="text-muted-foreground hover:text-foreground transition">
            Support & Docs
          </Link>
        </div>
      </div>
    </footer>
  );
}
