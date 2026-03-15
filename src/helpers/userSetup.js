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

  // All published notes sorted by created date (newest first), excluding gardenEntry
  eleventyConfig.addCollection("gardenNotes", function (collectionApi) {
    return collectionApi
      .getAll()
      .filter((item) => {
        return (
          item.data["dg-publish"] === true &&
          Array.isArray(item.data.tags) &&
          item.data.tags.indexOf("gardenEntry") === -1
        );
      })
      .sort((a, b) => {
        const dateA = new Date(a.data.created || a.date);
        const dateB = new Date(b.data.created || b.date);
        return dateB - dateA;
      });
  });
}
exports.userMarkdownSetup = userMarkdownSetup;
exports.userEleventySetup = userEleventySetup;
