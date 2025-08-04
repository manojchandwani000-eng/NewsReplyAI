import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Download, Plus } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  
  const { data: languages = [] } = useQuery({
    queryKey: ["/api/languages", "active"],
  });

  const handleExport = async (type: string) => {
    try {
      const response = await fetch(`/api/export/${type}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${type}-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {/* Language Selector */}
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((language: any) => (
                <SelectItem key={language.code} value={language.code}>
                  {language.flag} {language.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Export Button */}
          <Select onValueChange={handleExport}>
            <SelectTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inquiries">Export Inquiries</SelectItem>
              <SelectItem value="analytics">Export Analytics</SelectItem>
              <SelectItem value="templates">Export Templates</SelectItem>
            </SelectContent>
          </Select>

          {/* Add Template Button */}
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Template
          </Button>
        </div>
      </div>
    </header>
  );
}
