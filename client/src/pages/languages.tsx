import { useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Plus, Edit, Globe } from "lucide-react";

const availableLanguages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "pt", name: "Português", flag: "🇵🇹" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "한국어", flag: "🇰🇷" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
];

export default function Languages() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    flag: "",
    isActive: true
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: languages = [], isLoading } = useQuery({
    queryKey: ["/api/languages"]
  });

  const { data: templates = [] } = useQuery({
    queryKey: ["/api/templates"]
  });

  const createLanguageMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/languages", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      toast({
        title: "Language Added",
        description: "Language has been added successfully.",
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add language. Please try again.",
        variant: "destructive",
      });
    }
  });

  const updateLanguageMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("PUT", `/api/languages/${editingLanguage.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      toast({
        title: "Language Updated",
        description: "Language has been updated successfully.",
      });
      handleCloseDialog();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update language. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.name || !formData.flag) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (editingLanguage) {
      updateLanguageMutation.mutate(formData);
    } else {
      createLanguageMutation.mutate(formData);
    }
  };

  const handleEdit = (language: any) => {
    setEditingLanguage(language);
    setFormData({
      code: language.code,
      name: language.name,
      flag: language.flag,
      isActive: language.isActive
    });
    setIsCreateOpen(true);
  };

  const handleToggleActive = async (language: any) => {
    try {
      await apiRequest("PUT", `/api/languages/${language.id}`, {
        isActive: !language.isActive
      });
      queryClient.invalidateQueries({ queryKey: ["/api/languages"] });
      toast({
        title: "Language Updated",
        description: `${language.name} has been ${!language.isActive ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update language status.",
        variant: "destructive",
      });
    }
  };

  const handleCloseDialog = () => {
    setIsCreateOpen(false);
    setEditingLanguage(null);
    setFormData({
      code: "",
      name: "",
      flag: "",
      isActive: true
    });
  };

  const handleSelectLanguage = (langCode: string) => {
    const selected = availableLanguages.find(lang => lang.code === langCode);
    if (selected) {
      setFormData({
        code: selected.code,
        name: selected.name,
        flag: selected.flag,
        isActive: true
      });
    }
  };

  const getLanguageTemplateCount = (languageCode: string) => {
    return templates.filter((template: any) => template.languageCode === languageCode).length;
  };

  const unusedLanguages = availableLanguages.filter(
    available => !languages.some((existing: any) => existing.code === available.code)
  );

  return (
    <Layout title="Languages" subtitle="Manage supported languages for your automated responses">
      <div className="flex justify-between items-center mb-6">
        <div className="text-sm text-gray-600">
          {languages.filter((l: any) => l.isActive).length} active languages • {templates.length} total templates
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button disabled={unusedLanguages.length === 0}>
              <Plus className="w-4 h-4 mr-2" />
              Add Language
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLanguage ? "Edit Language" : "Add New Language"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {!editingLanguage && unusedLanguages.length > 0 && (
                <div>
                  <Label>Select Language</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {unusedLanguages.map((lang) => (
                      <Button
                        key={lang.code}
                        type="button"
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleSelectLanguage(lang.code)}
                      >
                        {lang.flag} {lang.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Language Code *</Label>
                  <Input
                    id="code"
                    placeholder="en"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase() })}
                    required
                    disabled={editingLanguage}
                  />
                </div>
                <div>
                  <Label htmlFor="flag">Flag *</Label>
                  <Input
                    id="flag"
                    placeholder="🇺🇸"
                    value={formData.flag}
                    onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="name">Language Name *</Label>
                <Input
                  id="name"
                  placeholder="English"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </form>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleSubmit}
                disabled={createLanguageMutation.isPending || updateLanguageMutation.isPending}
              >
                {editingLanguage ? "Update Language" : "Add Language"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language: any) => (
            <Card key={language.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{language.flag}</span>
                    <div>
                      <CardTitle className="text-lg">{language.name}</CardTitle>
                      <p className="text-sm text-gray-500 uppercase">{language.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={language.isActive}
                      onCheckedChange={() => handleToggleActive(language)}
                    />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEdit(language)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <Badge variant={language.isActive ? "default" : "secondary"}>
                      {language.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Templates:</span>
                    <Badge variant="outline">
                      {getLanguageTemplateCount(language.code)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {languages.length === 0 && !isLoading && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-500">
              <Globe className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No languages configured</h3>
              <p className="text-sm mb-4">
                Add languages to support multi-language customer communications.
              </p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Language
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Layout>
  );
}
