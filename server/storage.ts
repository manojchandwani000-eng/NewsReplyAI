import { type Category, type InsertCategory, type Language, type InsertLanguage, type Template, type InsertTemplate, type Inquiry, type InsertInquiry, type Analytics, type InsertAnalytics } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Languages
  getLanguages(): Promise<Language[]>;
  getActiveLanguages(): Promise<Language[]>;
  getLanguage(id: string): Promise<Language | undefined>;
  getLanguageByCode(code: string): Promise<Language | undefined>;
  createLanguage(language: InsertLanguage): Promise<Language>;
  updateLanguage(id: string, language: Partial<InsertLanguage>): Promise<Language | undefined>;
  deleteLanguage(id: string): Promise<boolean>;

  // Templates
  getTemplates(): Promise<Template[]>;
  getTemplatesByCategory(categoryId: string): Promise<Template[]>;
  getTemplatesByLanguage(languageCode: string): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, template: Partial<InsertTemplate>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;
  incrementTemplateUsage(id: string): Promise<void>;
  updateTemplateSuccessRate(id: string, successRate: number): Promise<void>;

  // Inquiries
  getInquiries(): Promise<Inquiry[]>;
  getRecentInquiries(limit?: number): Promise<Inquiry[]>;
  getInquiry(id: string): Promise<Inquiry | undefined>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, inquiry: Partial<InsertInquiry>): Promise<Inquiry | undefined>;
  deleteInquiry(id: string): Promise<boolean>;

  // Analytics
  getAnalytics(): Promise<Analytics[]>;
  getAnalyticsByDate(date: string): Promise<Analytics | undefined>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  updateAnalytics(date: string, analytics: Partial<InsertAnalytics>): Promise<Analytics | undefined>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private languages: Map<string, Language>;
  private templates: Map<string, Template>;
  private inquiries: Map<string, Inquiry>;
  private analytics: Map<string, Analytics>;

  constructor() {
    this.categories = new Map();
    this.languages = new Map();
    this.templates = new Map();
    this.inquiries = new Map();
    this.analytics = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize default categories
    const defaultCategories = [
      { name: "Subscription", description: "Subscription-related inquiries", color: "#3B82F6", keywords: ["subscribe", "subscription", "sign up", "register", "activate"] },
      { name: "Billing", description: "Billing and payment inquiries", color: "#F59E0B", keywords: ["billing", "payment", "invoice", "charge", "refund"] },
      { name: "Technical", description: "Technical support inquiries", color: "#EF4444", keywords: ["technical", "bug", "error", "problem", "issue"] },
      { name: "Content Request", description: "Content and feature requests", color: "#8B5CF6", keywords: ["content", "request", "feature", "suggestion", "feedback"] },
    ];

    defaultCategories.forEach(cat => {
      const id = randomUUID();
      this.categories.set(id, { id, ...cat });
    });

    // Initialize default languages
    const defaultLanguages = [
      { code: "en", name: "English", flag: "🇺🇸", isActive: true },
      { code: "es", name: "Español", flag: "🇪🇸", isActive: true },
      { code: "fr", name: "Français", flag: "🇫🇷", isActive: true },
      { code: "de", name: "Deutsch", flag: "🇩🇪", isActive: true },
      { code: "pt", name: "Português", flag: "🇵🇹", isActive: true },
    ];

    defaultLanguages.forEach(lang => {
      const id = randomUUID();
      this.languages.set(id, { id, ...lang });
    });

    // Initialize default analytics
    const today = new Date().toISOString().split('T')[0];
    const analyticsId = randomUUID();
    this.analytics.set(analyticsId, {
      id: analyticsId,
      date: today,
      totalInquiries: 1247,
      autoResolved: 1089,
      manualReview: 158,
      avgResponseTime: 1200, // 1.2 seconds in milliseconds
      categoryBreakdown: {
        "Subscription": 456,
        "Billing": 234,
        "Technical": 189,
        "Content Request": 156
      },
      languageBreakdown: {
        "en": 623,
        "es": 312,
        "fr": 187,
        "de": 89,
        "pt": 36
      }
    });
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { id, ...insertCategory };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updated = { ...category, ...updates };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Languages
  async getLanguages(): Promise<Language[]> {
    return Array.from(this.languages.values());
  }

  async getActiveLanguages(): Promise<Language[]> {
    return Array.from(this.languages.values()).filter(lang => lang.isActive);
  }

  async getLanguage(id: string): Promise<Language | undefined> {
    return this.languages.get(id);
  }

  async getLanguageByCode(code: string): Promise<Language | undefined> {
    return Array.from(this.languages.values()).find(lang => lang.code === code);
  }

  async createLanguage(insertLanguage: InsertLanguage): Promise<Language> {
    const id = randomUUID();
    const language: Language = { id, ...insertLanguage };
    this.languages.set(id, language);
    return language;
  }

  async updateLanguage(id: string, updates: Partial<InsertLanguage>): Promise<Language | undefined> {
    const language = this.languages.get(id);
    if (!language) return undefined;

    const updated = { ...language, ...updates };
    this.languages.set(id, updated);
    return updated;
  }

  async deleteLanguage(id: string): Promise<boolean> {
    return this.languages.delete(id);
  }

  // Templates
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplatesByCategory(categoryId: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => template.categoryId === categoryId);
  }

  async getTemplatesByLanguage(languageCode: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(template => template.languageCode === languageCode);
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = { 
      id, 
      ...insertTemplate,
      usageCount: 0,
      successRate: 0
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: string, updates: Partial<InsertTemplate>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;

    const updated = { ...template, ...updates };
    this.templates.set(id, updated);
    return updated;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }

  async incrementTemplateUsage(id: string): Promise<void> {
    const template = this.templates.get(id);
    if (template) {
      template.usageCount++;
      this.templates.set(id, template);
    }
  }

  async updateTemplateSuccessRate(id: string, successRate: number): Promise<void> {
    const template = this.templates.get(id);
    if (template) {
      template.successRate = successRate;
      this.templates.set(id, template);
    }
  }

  // Inquiries
  async getInquiries(): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values());
  }

  async getRecentInquiries(limit: number = 10): Promise<Inquiry[]> {
    return Array.from(this.inquiries.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    return this.inquiries.get(id);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const id = randomUUID();
    const inquiry: Inquiry = { 
      id, 
      ...insertInquiry,
      createdAt: new Date(),
      resolvedAt: null,
      responseTime: null
    };
    this.inquiries.set(id, inquiry);
    return inquiry;
  }

  async updateInquiry(id: string, updates: Partial<InsertInquiry>): Promise<Inquiry | undefined> {
    const inquiry = this.inquiries.get(id);
    if (!inquiry) return undefined;

    const updated = { ...inquiry, ...updates };
    this.inquiries.set(id, updated);
    return updated;
  }

  async deleteInquiry(id: string): Promise<boolean> {
    return this.inquiries.delete(id);
  }

  // Analytics
  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values());
  }

  async getAnalyticsByDate(date: string): Promise<Analytics | undefined> {
    return Array.from(this.analytics.values()).find(analytics => analytics.date === date);
  }

  async createAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = randomUUID();
    const analytics: Analytics = { id, ...insertAnalytics };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async updateAnalytics(date: string, updates: Partial<InsertAnalytics>): Promise<Analytics | undefined> {
    const analytics = Array.from(this.analytics.values()).find(a => a.date === date);
    if (!analytics) return undefined;

    const updated = { ...analytics, ...updates };
    this.analytics.set(analytics.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
