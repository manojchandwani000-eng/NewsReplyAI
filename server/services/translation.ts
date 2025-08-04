export class TranslationService {
  private readonly GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY || process.env.TRANSLATE_API_KEY || "";

  /**
   * Translate text using Google Translate API
   */
  async translateText(text: string, targetLanguage: string, sourceLanguage: string = 'auto'): Promise<string> {
    if (!this.GOOGLE_TRANSLATE_API_KEY) {
      console.warn('Google Translate API key not configured, returning original text');
      return text;
    }

    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: sourceLanguage,
          target: targetLanguage,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation failed:', error);
      return text; // Return original text if translation fails
    }
  }

  /**
   * Translate a template to a target language
   */
  async translateTemplate(template: any, targetLanguageCode: string): Promise<string> {
    return this.translateText(template.content, targetLanguageCode);
  }

  /**
   * Get available language codes for translation
   */
  getAvailableLanguages(): string[] {
    return ['en', 'es', 'fr', 'de', 'pt', 'it', 'nl', 'pl', 'ru', 'ja', 'ko', 'zh'];
  }

  /**
   * Detect the language of given text
   */
  async detectLanguage(text: string): Promise<string> {
    if (!this.GOOGLE_TRANSLATE_API_KEY) {
      // Fallback to simple detection
      return this.simpleLanguageDetection(text);
    }

    try {
      const response = await fetch(`https://translation.googleapis.com/language/translate/v2/detect?key=${this.GOOGLE_TRANSLATE_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text
        })
      });

      if (!response.ok) {
        throw new Error(`Language detection API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data.detections[0][0].language;
    } catch (error) {
      console.error('Language detection failed:', error);
      return this.simpleLanguageDetection(text);
    }
  }

  /**
   * Simple language detection fallback
   */
  private simpleLanguageDetection(text: string): string {
    const languagePatterns = {
      es: ['hola', 'gracias', 'por favor', 'suscripción', 'facturación', 'problema', 'ayuda'],
      fr: ['bonjour', 'merci', 's\'il vous plaît', 'abonnement', 'facturation', 'problème', 'aide'],
      de: ['hallo', 'danke', 'bitte', 'abonnement', 'rechnung', 'problem', 'hilfe'],
      pt: ['olá', 'obrigado', 'por favor', 'assinatura', 'faturamento', 'problema', 'ajuda'],
    };
    
    const normalizedText = text.toLowerCase();
    
    for (const [langCode, patterns] of Object.entries(languagePatterns)) {
      const matches = patterns.filter(pattern => normalizedText.includes(pattern));
      if (matches.length >= 2) {
        return langCode;
      }
    }
    
    return 'en'; // Default to English
  }
}

export const translationService = new TranslationService();
