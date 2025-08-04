import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";

const categoryColors = {
  "Subscription": "bg-blue-100 text-blue-800",
  "Billing": "bg-yellow-100 text-yellow-800", 
  "Technical": "bg-red-100 text-red-800",
  "Content Request": "bg-purple-100 text-purple-800"
};

const statusColors = {
  "auto-resolved": "bg-green-100 text-green-800",
  "manual-review": "bg-orange-100 text-orange-800",
  "pending": "bg-gray-100 text-gray-800"
};

const languageFlags = {
  "en": "🇺🇸",
  "es": "🇪🇸", 
  "fr": "🇫🇷",
  "de": "🇩🇪",
  "pt": "🇵🇹"
};

const languageNames = {
  "en": "English",
  "es": "Spanish",
  "fr": "French", 
  "de": "German",
  "pt": "Portuguese"
};

export function RecentInquiries() {
  const { data: inquiries = [], isLoading } = useQuery({
    queryKey: ["/api/inquiries"],
    queryFn: async () => {
      const response = await fetch("/api/inquiries?recent=10");
      return response.json();
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"]
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date();
    const past = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const hours = Math.floor(diffInMinutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  if (isLoading) {
    return (
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Inquiries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Inquiries</CardTitle>
        <Button variant="ghost" size="sm">View All</Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Customer</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Category</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Language</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {inquiries.map((inquiry: any) => (
                <tr key={inquiry.id}>
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {inquiry.customerName.split(' ').map((n: string) => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{inquiry.customerName}</p>
                        <p className="text-sm text-gray-500">{inquiry.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    {inquiry.categoryId && (
                      <Badge className={categoryColors[getCategoryName(inquiry.categoryId) as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}>
                        {getCategoryName(inquiry.categoryId)}
                      </Badge>
                    )}
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-900">
                      {languageFlags[inquiry.languageCode as keyof typeof languageFlags]} {languageNames[inquiry.languageCode as keyof typeof languageNames]}
                    </span>
                  </td>
                  <td className="py-4">
                    <Badge className={statusColors[inquiry.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800"}>
                      {inquiry.status.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  </td>
                  <td className="py-4 text-sm text-gray-500">
                    {formatTimeAgo(inquiry.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {inquiries.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No recent inquiries found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
