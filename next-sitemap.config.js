/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://www.quantumhive.us', // Use environment variable or default
  generateRobotsTxt: true, // Optional: Will generate robots.txt based on this config
  // Optional: Add any paths to exclude from the sitemap
  // exclude: ['/admin/*', '/private'],
  // Optional: Default transformation function for URLs
  // transform: async (config, path) => {
  //   return {
  //     loc: path, // => this will be exported as http(s)://<siteUrl>/<path>
  //     changefreq: config.changefreq,
  //     priority: config.priority,
  //     lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
  //     alternateRefs: config.alternateRefs ?? [],
  //   }
  // },
  // Optional: Add custom policies for robots.txt
  // robotsTxtOptions: {
  //   policies: [
  //     { userAgent: '*', allow: '/' },
  //     { userAgent: ' spécifique-bot', disallow: ['/admin'] },
  //   ],
  //   additionalSitemaps: [
  //     'https://example.com/my-custom-sitemap-1.xml',
  //     'https://example.com/my-custom-sitemap-2.xml',
  //   ],
  // },
};