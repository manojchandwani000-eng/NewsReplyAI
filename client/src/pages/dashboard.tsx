import { Layout } from "@/components/layout/layout";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { RecentInquiries } from "@/components/dashboard/recent-inquiries";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { CategoryPerformance } from "@/components/dashboard/category-performance";
import { TemplateGrid } from "@/components/dashboard/template-grid";

export default function Dashboard() {
  return (
    <Layout 
      title="Dashboard" 
      subtitle="Monitor your automated customer support performance"
    >
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RecentInquiries />
        
        <div className="space-y-6">
          <QuickActions />
          <CategoryPerformance />
        </div>
      </div>

      <TemplateGrid />
    </Layout>
  );
}
