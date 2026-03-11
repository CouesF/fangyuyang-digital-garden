function userMarkdownSetup(md) {
  // The md parameter stands for the markdown-it instance used throughout the site generator.
  // Feel free to add any plugin you want here instead of /.eleventy.js
}
function userEleventySetup(eleventyConfig) {
  // Daily updates: Obsidian notes tagged "daily-update" shown on the landing page
  eleventyConfig.addCollection("dailyUpdates", function (collectionApi) {
    return collectionApi
      .getFilteredByTag("daily-update")
      .sort((a, b) => b.date - a.date)
      .slice(0, 10);
  });
}
exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
