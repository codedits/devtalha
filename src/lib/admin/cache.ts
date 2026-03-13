export const PORTFOLIO_CACHE_REVALIDATE_SECONDS = 60 * 60 * 24 * 7;

export const PORTFOLIO_HOME_TAG = "portfolio:home";

export function getSectionTag(section: string) {
  return `portfolio:section:${section}`;
}

export function getSectionTags(section: string) {
  return [PORTFOLIO_HOME_TAG, getSectionTag(section)];
}
