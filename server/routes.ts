import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nlpService } from "./services/nlp";
import { translationService } from "./services/translation";
import { insertCategorySchema, insertLanguageSchema, insertTemplateSchema, insertInquirySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(id, updates);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteCategory(id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Languages
  app.get("/api/languages", async (req, res) => {
    try {
      const languages = await storage.getLanguages();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch languages" });
    }
  });

  app.get("/api/languages/active", async (req, res) => {
    try {
      const languages = await storage.getActiveLanguages();
      res.json(languages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active languages" });
    }
  });

  app.post("/api/languages", async (req, res) => {
    try {
      const languageData = insertLanguageSchema.parse(req.body);
      const language = await storage.createLanguage(languageData);
      res.status(201).json(language);
    } catch (error) {
      res.status(400).json({ message: "Invalid language data" });
    }
  });

  app.put("/api/languages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertLanguageSchema.partial().parse(req.body);
      const language = await storage.updateLanguage(id, updates);
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
      res.json(language);
    } catch (error) {
      res.status(400).json({ message: "Invalid language data" });
    }
  });

  // Templates
  app.get("/api/templates", async (req, res) => {
    try {
      const { categoryId, languageCode } = req.query;
      let templates;
      
      if (categoryId) {
        templates = await storage.getTemplatesByCategory(categoryId as string);
      } else if (languageCode) {
        templates = await storage.getTemplatesByLanguage(languageCode as string);
      } else {
        templates = await storage.getTemplates();
      }
      
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates", async (req, res) => {
    try {
      const templateData = insertTemplateSchema.parse(req.body);
      const template = await storage.createTemplate(templateData);
      res.status(201).json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  app.put("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertTemplateSchema.partial().parse(req.body);
      const template = await storage.updateTemplate(id, updates);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(400).json({ message: "Invalid template data" });
    }
  });

  app.delete("/api/templates/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTemplate(id);
      if (!deleted) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // Translate template
  app.post("/api/templates/:id/translate", async (req, res) => {
    try {
      const { id } = req.params;
      const { targetLanguageCode } = req.body;
      
      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      const translatedContent = await translationService.translateTemplate(template, targetLanguageCode);
      
      res.json({ translatedContent });
    } catch (error) {
      res.status(500).json({ message: "Failed to translate template" });
    }
  });

  // Inquiries
  app.get("/api/inquiries", async (req, res) => {
    try {
      const { recent } = req.query;
      let inquiries;
      
      if (recent) {
        inquiries = await storage.getRecentInquiries(parseInt(recent as string) || 10);
      } else {
        inquiries = await storage.getInquiries();
      }
      
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch inquiries" });
    }
  });

  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      
      // Auto-detect language if not provided
      if (!inquiryData.languageCode) {
        inquiryData.languageCode = await nlpService.detectLanguage(inquiryData.content);
      }
      
      const inquiry = await storage.createInquiry(inquiryData);
      
      // Try to auto-categorize and find matching template
      const categories = await storage.getCategories();
      const categoryId = await nlpService.categorizeInquiry(inquiry.content, categories);
      
      if (categoryId) {
        const templates = await storage.getTemplates();
        const templateId = await nlpService.findBestTemplate(
          inquiry.content, 
          categoryId, 
          inquiry.languageCode, 
          templates
        );
        
        if (templateId) {
          const template = await storage.getTemplate(templateId);
          if (template) {
            // Process template with customer data
            const responseContent = nlpService.processTemplate(template.content, {
              customer_name: inquiry.customerName,
              customer_email: inquiry.customerEmail,
              subscription_type: "Premium", // This would come from customer data
              billing_date: new Date().toLocaleDateString(),
              support_link: "https://support.example.com"
            });

            // Update inquiry with response
            await storage.updateInquiry(inquiry.id, {
              categoryId,
              responseTemplateId: templateId,
              responseContent,
              status: "auto-resolved",
              resolvedAt: new Date(),
              responseTime: 1200 // 1.2 seconds
            });

            // Update template usage
            await storage.incrementTemplateUsage(templateId);
          }
        }
      }
      
      const updatedInquiry = await storage.getInquiry(inquiry.id);
      res.status(201).json(updatedInquiry);
    } catch (error) {
      res.status(400).json({ message: "Invalid inquiry data" });
    }
  });

  app.put("/api/inquiries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertInquirySchema.partial().parse(req.body);
      const inquiry = await storage.updateInquiry(id, updates);
      if (!inquiry) {
        return res.status(404).json({ message: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(400).json({ message: "Invalid inquiry data" });
    }
  });

  // Analytics
  app.get("/api/analytics", async (req, res) => {
    try {
      const { date } = req.query;
      
      if (date) {
        const analytics = await storage.getAnalyticsByDate(date as string);
        if (!analytics) {
          return res.status(404).json({ message: "Analytics not found for date" });
        }
        res.json(analytics);
      } else {
        const analytics = await storage.getAnalytics();
        res.json(analytics);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Export data
  app.get("/api/export/:type", async (req, res) => {
    try {
      const { type } = req.params;
      let data;
      
      switch (type) {
        case "inquiries":
          data = await storage.getInquiries();
          break;
        case "analytics":
          data = await storage.getAnalytics();
          break;
        case "templates":
          data = await storage.getTemplates();
          break;
        default:
          return res.status(400).json({ message: "Invalid export type" });
      }
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="${type}-export-${new Date().toISOString().split('T')[0]}.json"`);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Failed to export data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
