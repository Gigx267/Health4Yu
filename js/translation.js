// Translation System
class TranslationManager {
    constructor() {
        this.languages = {
            'en': 'English',
            'de': 'Deutsch',
            'ru': 'Русский'
        };
        
        this.flagClasses = {
            'en': 'flag-en',
            'de': 'flag-de',
            'ru': 'flag-ru'
        };
        
        this.currentLanguage = 'en';
        this.translations = {};
    }

    async loadLanguage(lang) {
        try {
            const response = await fetch(`languages/${lang}.json`);
            this.translations = await response.json();
            this.applyTranslations();
            this.updateLanguageSwitcher(lang);
            this.saveLanguagePreference(lang);
        } catch (error) {
            console.error('Error loading language file:', error);
        }
    }

    applyTranslations() {
        // Update document title
        document.title = this.translations.siteTitle || document.title;
        
        // Update all translatable elements
        document.querySelectorAll('[data-translate]').forEach(element => {
            const key = element.getAttribute('data-translate');
            if (this.translations[key]) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = this.translations[key];
                } else if (element.hasAttribute('title')) {
                    element.title = this.translations[key];
                } else if (element.hasAttribute('alt')) {
                    element.alt = this.translations[key];
                } else {
                    element.textContent = this.translations[key];
                }
            }
        });
    }

    updateLanguageSwitcher(lang) {
        const currentLanguageElement = document.getElementById('currentLanguage');
        if (currentLanguageElement) {
            currentLanguageElement.innerHTML = `
                <span class="flag-icon ${this.flagClasses[lang]}"></span>
                <span>${lang.toUpperCase()}</span>
            `;
        }
        this.currentLanguage = lang;
        document.documentElement.lang = lang;
    }

    changeLanguage(lang) {
        this.loadLanguage(lang);
    }

    saveLanguagePreference(lang) {
        localStorage.setItem('preferredLanguage', lang);
    }

    getSavedLanguage() {
        return localStorage.getItem('preferredLanguage') || 'en';
    }

    init() {
        const savedLang = this.getSavedLanguage();
        this.loadLanguage(savedLang);
    }
}

// Initialize translation manager
const translationManager = new TranslationManager();
document.addEventListener('DOMContentLoaded', () => translationManager.init());
window.changeLanguage = (lang) => translationManager.changeLanguage(lang);