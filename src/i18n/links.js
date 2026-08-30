// Every href is relative: the site is served from /reverse-prime-plot/, so a
// root-absolute path would escape the subpath. Each page therefore needs its
// own set rather than one dictionary constant.
const LINKS = {
  'en:home': { otherLanguage: 'fa/', otherPage: 'chains/' },
  'fa:home': { otherLanguage: '../', otherPage: 'chains/' },
  'en:chains': { otherLanguage: '../fa/chains/', otherPage: '../' },
  'fa:chains': { otherLanguage: '../../chains/', otherPage: '../' },
};

export const REPOSITORY_URL = 'https://github.com/cocodedk/reverse-prime-plot';

export function linksFor(language, page) {
  return LINKS[`${language}:${page}`] ?? LINKS['en:home'];
}
