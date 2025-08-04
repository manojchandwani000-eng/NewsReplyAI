interface CategoryMatch {
  categoryId: string;
  score: number;
}

export class NLPService {
  /**
   * Categorize an inquiry based on its content and available categories
   */
  async categorizeInquiry(content: string, categories: any[]): Promise<string | null> {
    const matches: CategoryMatch[] = [];
    
    const normalizedContent = content.toLowerCase();
    
    for (const category of categories) {
      let score = 0;
      const keywords = category.keywords || [];
      
      // Check for keyword matches
      for (const keyword of keywords) {
        const keywordLower = keyword.toLowerCase();
        if (normalizedContent.includes(keywordLower)) {
          // Give higher score for exact matches
          if (normalizedContent.split(' ').includes(keywordLower)) {
            score += 10;
          } else {
            score += 5;
          }
        }
      }
      
      // Category name matching
      if (normalizedContent.includes(category.name.toLowerCase())) {
        score += 15;
      }
      
      if (score > 0) {
        matches.push({ categoryId: category.id, score });
      }
    }
    
    // Return the category with the highest score
    if (matches.length > 0) {
      matches.sort((a, b) => b.score - a.score);
      return matches[0].categoryId;
    }
    
    return null;
  }

  /**
   * Find the best matching template for an inquiry
   */
  async findBestTemplate(content: string, categoryId: string | null, languageCode: string, templates: any[]): Promise<string | null> {
    // Filter templates by category and language
    const candidateTemplates = templates.filter(template => 
      template.categoryId === categoryId && template.languageCode === languageCode
    );
    
    if (candidateTemplates.length === 0) {
      // Fallback to templates in the same language but different category
      const fallbackTemplates = templates.filter(template => 
        template.languageCode === languageCode
      );
      
      if (fallbackTemplates.length === 0) return null;
      
      // Return the most used template as fallback
      fallbackTemplates.sort((a, b) => b.usageCount - a.usageCount);
      return fallbackTemplates[0].id;
    }
    
    if (candidateTemplates.length === 1) {
      return candidateTemplates[0].id;
    }
    
    // If multiple templates, find the best match based on keywords
    const matches: { templateId: string; score: number }[] = [];
    const normalizedContent = content.toLowerCase();
    
    for (const template of candidateTemplates) {
      let score = 0;
      const keywords = template.keywords || [];
      
      for (const keyword of keywords) {
        if (normalizedContent.includes(keyword.toLowerCase())) {
          score += 1;
        }
      }
      
      // Factor in success rate and usage count
      score += (template.successRate / 100) * 2;
      score += Math.min(template.usageCount / 10, 5);
      
      matches.push({ templateId: template.id, score });
    }
    
    if (matches.length > 0) {
      matches.sort((a, b) => b.score - a.score);
      return matches[0].templateId;
    }
    
    // Return the most successful template
    candidateTemplates.sort((a, b) => b.successRate - a.successRate);
    return candidateTemplates[0].id;
  }

  /**
   * Detect the language of the inquiry content
   */
  async detectLanguage(content: string): Promise<string> {
    // Simple language detection based on common words/patterns
    const languagePatterns = {
      es: ['hola', 'gracias', 'por favor', 'suscripción', 'facturación', 'problema'],
      fr: ['bonjour', 'merci', 's\'il vous plaît', 'abonnement', 'facturation', 'problème'],
      de: ['hallo', 'danke', 'bitte', 'abonnement', 'rechnung', 'problem'],
      pt: ['olá', 'obrigado', 'por favor', 'assinatura', 'faturamento', 'problema'],
    };
    
    const normalizedContent = content.toLowerCase();
    
    for (const [langCode, patterns] of Object.entries(languagePatterns)) {
      for (const pattern of patterns) {
        if (normalizedContent.includes(pattern)) {
          return langCode;
        }
      }
    }
    
    // Default to English
    return 'en';
  }

  /**
   * Process template content with dynamic variables
   */
  processTemplate(templateContent: string, variables: Record<string, string>): string {
    let processed = templateContent;
    
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      processed = processed.replace(new RegExp(placeholder, 'g'), value);
    }
    
    return processed;
  }
}

export const nlpService = new NLPService();
