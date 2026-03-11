import { Zap } from "lucide-react";

export default function EmptyDashboardState() {
  return (
    <div className="flex-1 flex items-center justify-center flex-col gap-4 text-muted-foreground bg-muted/5 h-full">
      <Zap className="w-16 h-16 opacity-20" />
      <h2 className="text-xl font-semibold text-foreground">No Project Selected</h2>
      <p className="max-w-sm text-center">Select an existing project from the sidebar or select "Add" to create a new one to start mocking APIs.</p>
    </div>
  );
}
