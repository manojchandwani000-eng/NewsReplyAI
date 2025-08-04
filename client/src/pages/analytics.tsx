import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, Clock, MessageSquare } from "lucide-react";
import { useState } from "react";

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");

  const { data: analytics = [] } = useQuery({
    queryKey: ["/api/analytics"]
  });

  const { data: inquiries = [] } = useQuery({
    queryKey: ["/api/inquiries"]
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"]
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["/api/templates"]
  });

  // Calculate metrics
  const totalInquiries = inquiries.length;
  const autoResolvedCount = inquiries.filter((i: any) => i.status === 'auto-resolved').length;
  const avgResponseTime = inquiries.reduce((acc: number, inquiry: any) => {
    return acc + (inquiry.responseTime || 0);
  }, 0) / inquiries.length || 0;

  const autoResolutionRate = totalInquiries > 0 ? (autoResolvedCount / totalInquiries) * 100 : 0;

  // Category breakdown data
  const categoryData = categories.map((category: any) => {
    const categoryInquiries = inquiries.filter((i: any) => i.categoryId === category.id);
    return {
      name: category.name,
      count: categoryInquiries.length,
      resolved: categoryInquiries.filter((i: any) => i.status === 'auto-resolved').length
    };
  }).filter((item: any) => item.count > 0);

  // Language breakdown data
  const languageBreakdown = inquiries.reduce((acc: any, inquiry: any) => {
    const lang = inquiry.languageCode;
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {});

  const languageData = Object.entries(languageBreakdown).map(([code, count]) => ({
    name: code.toUpperCase(),
    value: count
  }));

  // Response time trend (mock data for last 7 days)
  const responseTrendData = [
    { day: '7d ago', time: 1.8 },
    { day: '6d ago', time: 1.5 },
    { day: '5d ago', time: 1.3 },
    { day: '4d ago', time: 1.1 },
    { day: '3d ago', time: 1.0 },
    { day: '2d ago', time: 1.2 },
    { day: '1d ago', time: 1.2 }
  ];

  // Template performance
  const templatePerformance = templates
    .sort((a: any, b: any) => b.usageCount - a.usageCount)
    .slice(0, 5)
    .map((template: any) => ({
      name: template.name.length > 20 ? template.name.substring(0, 20) + '...' : template.name,
      usage: template.usageCount,
      success: template.successRate
    }));

  return (
    <Layout title="Analytics" subtitle="Track performance and insights for your automation">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Performance Overview</h3>
          <p className="text-sm text-gray-600">Analyze your customer support automation metrics</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">{totalInquiries}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+12.5%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Auto-Resolution Rate</p>
                <p className="text-2xl font-bold text-gray-900">{autoResolutionRate.toFixed(1)}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+5.2%</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-gray-900">{(avgResponseTime / 1000).toFixed(1)}s</p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">-0.3s improved</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold text-gray-900">{templates.length}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-600 font-medium">{categories.length} categories</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Inquiries by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" name="Total" />
                <Bar dataKey="resolved" fill="#10B981" name="Auto-Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Language Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Language Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languageData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {languageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Response Time Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}s`, 'Response Time']} />
                <Line type="monotone" dataKey="time" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Templates Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Top Templates by Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {templatePerformance.map((template, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{template.name}</p>
                    <div className="flex items-center mt-1">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-3">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(template.usage / Math.max(...templatePerformance.map(t => t.usage))) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{template.usage} uses</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{template.success}%</span>
                    <p className="text-xs text-gray-500">success</p>
                  </div>
                </div>
              ))}
              
              {templatePerformance.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No template usage data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
