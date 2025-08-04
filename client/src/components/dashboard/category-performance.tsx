import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

const categoryColors = {
  "Subscription": "bg-blue-500",
  "Billing": "bg-yellow-500",
  "Technical": "bg-red-500", 
  "Content Request": "bg-purple-500"
};

export function CategoryPerformance() {
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"]
  });

  const { data: inquiries = [] } = useQuery({
    queryKey: ["/api/inquiries"]
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"]
  });

  // Calculate category performance
  const categoryStats = categories.map((category: any) => {
    const categoryInquiries = inquiries.filter((inquiry: any) => inquiry.categoryId === category.id);
    const autoResolved = categoryInquiries.filter((inquiry: any) => inquiry.status === 'auto-resolved');
    const autoResolvedPercentage = categoryInquiries.length > 0 
      ? Math.round((autoResolved.length / categoryInquiries.length) * 100)
      : 0;

    return {
      name: category.name,
      count: categoryInquiries.length,
      autoResolvedPercentage,
      color: categoryColors[category.name as keyof typeof categoryColors] || "bg-gray-500"
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Performance</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categoryStats.map((category) => (
          <div key={category.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
              <span className="text-sm font-medium text-gray-700">{category.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{category.count}</p>
              <p className="text-xs text-gray-500">{category.autoResolvedPercentage}% auto-resolved</p>
            </div>
          </div>
        ))}
        
        {categoryStats.length === 0 && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No category data available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
