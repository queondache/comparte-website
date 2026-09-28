// Accesso ai testi e alle rotte per lingua
import it from './it.json';
import es from './es.json';
import en from './en.json';
import siteData from '../data/site.json';

export type Lang = 'it' | 'es' | 'en';
export type PageKey = 'home' | 'dona' | 'cuba' | 'trasparenza' | 'grazie';
export type Dict = typeof it;

const dicts: Record<Lang, Dict> = { it, es: es as Dict, en: en as Dict };
export const LANGS: Lang[] = ['it', 'es', 'en'];
export const SITE_URL = 'https://www.comparte.it';
export const site = siteData;

export const routes: Record<Lang, Record<PageKey, string>> = {
  it: { home: '/', dona: '/dona/', cuba: '/cuba/', trasparenza: '/trasparenza/', grazie: '/grazie/' },
  es: { home: '/es/', dona: '/es/dona/', cuba: '/es/cuba/', trasparenza: '/es/transparencia/', grazie: '/es/gracias/' },
  en: { home: '/en/', dona: '/en/donate/', cuba: '/en/cuba/', trasparenza: '/en/transparency/', grazie: '/en/thank-you/' },
};

export const t = (lang: Lang): Dict => dicts[lang];

export const altLinks = (pageKey: PageKey) =>
  LANGS.map((lang) => ({ lang, href: SITE_URL + routes[lang][pageKey] }));
