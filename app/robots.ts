import type { MetadataRoute } from "next";

/**
 * Generates metadata for robots.txt, controlling how search engine bots crawl and index the application's pages.
 *
 * This function specifies the robots.txt rules for the entire application, allowing or disallowing certain paths
 * for web crawlers. The current configuration allows all user agents (*) to crawl the root path (/), meaning
 * that search engines are allowed to index the homepage of the application.
 * @returns {MetadataRoute.Robots} The robots.txt ruleset for the application.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
  };
}
