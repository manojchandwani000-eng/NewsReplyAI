import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Mail, CheckCircle, Clock, Globe } from "lucide-react";

export function StatsCards() {
  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics"],
  });

  const todayAnalytics = analytics?.[0] || {
    totalInquiries: 0,
    autoResolved: 0,
    avgResponseTime: 0,
    languageBreakdown: {}
  };

  const successRate = todayAnalytics.totalInquiries > 0 
    ? Math.round((todayAnalytics.autoResolved / todayAnalytics.totalInquiries) * 100)
    : 0;

  const avgResponseTimeSeconds = (todayAnalytics.avgResponseTime / 1000).toFixed(1);
  const activeLanguageCount = Object.keys(todayAnalytics.languageBreakdown).length;

  const stats = [
    {
      title: "Total Inquiries",
      value: todayAnalytics.totalInquiries.toLocaleString(),
      change: "+12.5%",
      changeLabel: "vs last month",
      icon: Mail,
      iconBg: "bg-blue-100",
      iconColor: "text-primary"
    },
    {
      title: "Auto-Resolved",
      value: todayAnalytics.autoResolved.toLocaleString(),
      change: `${successRate}%`,
      changeLabel: "success rate",
      icon: CheckCircle,
      iconBg: "bg-green-100",
      iconColor: "text-secondary"
    },
    {
      title: "Avg Response Time",
      value: `${avgResponseTimeSeconds}s`,
      change: "-0.3s",
      changeLabel: "improved",
      icon: Clock,
      iconBg: "bg-yellow-100",
      iconColor: "text-accent"
    },
    {
      title: "Active Languages",
      value: activeLanguageCount.toString(),
      change: "EN, ES, FR, DE, PT",
      changeLabel: "",
      icon: Globe,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm text-secondary font-medium">{stat.change}</span>
                    {stat.changeLabel && (
                      <span className="text-xs text-gray-500 ml-1">{stat.changeLabel}</span>
                    )}
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
