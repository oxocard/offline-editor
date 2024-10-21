export const getBrowserLanguage = () => {
  const userLang = navigator.language;
  if (userLang.startsWith('de')) return 'de';
  else if (userLang.startsWith('fr')) return 'fr';
  else if (userLang.startsWith('en')) return 'en';
  else return 'de';
};
