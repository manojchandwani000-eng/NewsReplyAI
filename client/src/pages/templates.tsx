import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { TemplateModal } from "@/components/modals/template-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Edit, Trash2 } from "lucide-react";

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

export default function Templates() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["/api/templates"]
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"]
  });

  const { data: languages = [] } = useQuery({
    queryKey: ["/api/languages", "active"]
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c: any) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const filteredTemplates = templates.filter((template: any) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || getCategoryName(template.categoryId) === selectedCategory;
    const matchesLanguage = selectedLanguage === "all" || template.languageCode === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage;
  });

  return (
    <Layout title="Templates" subtitle="Manage your automated response templates">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Categories" />
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

        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All Languages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((language: any) => (
              <SelectItem key={language.code} value={language.code}>
                {language.flag} {language.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template: any) => {
            const categoryName = getCategoryName(template.categoryId);
            return (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
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
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-4">
                    {template.content}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                    <span>Used {template.usageCount} times</span>
                    <span>{template.successRate}% success rate</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {filteredTemplates.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-sm mb-4">
                {searchTerm || selectedCategory !== "all" || selectedLanguage !== "all"
                  ? "Try adjusting your search or filters."
                  : "Create your first template to get started with automated responses."
                }
              </p>
              <Button onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <TemplateModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </Layout>
  );
}
