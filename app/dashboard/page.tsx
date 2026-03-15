export default function DashboardOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-2 text-foreground">Overview</h1>
      <p className="text-muted-foreground mb-8">Welcome to the StudyHub admin dashboard. Manage content and users here.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg text-foreground mb-2">Study Planners</h3>
          <p className="text-3xl font-bold text-primary mb-1">12</p>
          <p className="text-sm text-muted-foreground">Total planners available</p>
        </div>
        
        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg text-foreground mb-2">Tests & MCQs</h3>
          <p className="text-3xl font-bold text-blue-500 mb-1">45</p>
          <p className="text-sm text-muted-foreground">Active mock tests</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-lg text-foreground mb-2">Faculty</h3>
          <p className="text-3xl font-bold text-green-500 mb-1">8</p>
          <p className="text-sm text-muted-foreground">Registered faculty members</p>
        </div>
      </div>
    </div>
  );
}
