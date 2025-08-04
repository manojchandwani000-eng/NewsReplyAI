import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TemplateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const languageOptions = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
];

export function TemplateModal({ open, onOpenChange }: TemplateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    languageCode: "",
    content: "",
    keywords: ""
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"]
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/templates", {
        ...data,
        keywords: data.keywords.split(",").map((k: string) => k.trim()).filter((k: string) => k)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/templates"] });
      toast({
        title: "Template Created",
        description: "Your template has been created successfully.",
      });
      onOpenChange(false);
      setFormData({
        name: "",
        categoryId: "",
        languageCode: "",
        content: "",
        keywords: ""
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create template. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.categoryId || !formData.languageCode || !formData.content) {
      toast({
        title: "Validation Error", 
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    createTemplateMutation.mutate(formData);
  };

  const handleClose = () => {
    setFormData({
      name: "",
      categoryId: "",
      languageCode: "",
      content: "",
      keywords: ""
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Template Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Subscription Welcome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Language *</Label>
            <RadioGroup 
              value={formData.languageCode} 
              onValueChange={(value) => setFormData({ ...formData, languageCode: value })}
              className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2"
            >
              {languageOptions.map((lang) => (
                <div key={lang.code} className="flex items-center space-x-2">
                  <RadioGroupItem value={lang.code} id={lang.code} />
                  <Label htmlFor={lang.code} className="text-sm cursor-pointer">
                    {lang.flag} {lang.name}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="content">Response Template *</Label>
            <Textarea
              id="content"
              rows={8}
              placeholder="Write your automated response template here. Use {{customer_name}}, {{subscription_type}}, etc. for dynamic content."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Available variables: {{customer_name}}, {{subscription_type}}, {{billing_date}}, {{support_link}}
            </p>
          </div>

          <div>
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Input
              id="keywords"
              placeholder="subscription, sign up, register, activate"
              value={formData.keywords}
              onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">
              Keywords help categorize incoming inquiries automatically
            </p>
          </div>
        </form>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={createTemplateMutation.isPending}
          >
            {createTemplateMutation.isPending ? "Creating..." : "Create Template"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
