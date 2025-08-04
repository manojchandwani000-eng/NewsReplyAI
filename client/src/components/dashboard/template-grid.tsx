import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";

const categoryColors = {
  "Subscription": "bg-blue-100 text-blue-800",
  "Billing": "bg-yellow-100 text-yellow-800",
  "Technical": "bg-red-100 text-red-800", 
  "Content Request": "bg-purple-100 text-purple-800"
};

const languageFlags = {
  "en": "🇺🇸",
  "es": "🇪🇸",
  "fr": "🇫🇷", 
  "de": "🇩🇪",
  "pt": "🇵🇹"
};

export function TemplateGrid() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["/api/templates"]
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"]
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const filteredTemplates = selectedCategory === "all" 
    ? templates 
    : templates.filter((template: any) => {
        const categoryName = getCategoryName(template.categoryId);
        return categoryName.toLowerCase() === selectedCategory.toLowerCase();
      });

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Response Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Response Templates</CardTitle>
        <div className="flex items-center space-x-3">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category: any) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template: any) => {
            const categoryName = getCategoryName(template.categoryId);
            return (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge className={categoryColors[categoryName as keyof typeof categoryColors] || "bg-gray-100 text-gray-800"}>
                      {categoryName}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {languageFlags[template.languageCode as keyof typeof languageFlags]} {template.languageCode.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {template.content.substring(0, 120)}...
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Used {template.usageCount} times</span>
                  <span>{template.successRate}% success rate</span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {selectedCategory === "all" 
              ? "No templates found. Create your first template to get started."
              : `No templates found for ${selectedCategory} category.`
            }
          </div>
        )}
      </CardContent>
    </Card>
  );
}
