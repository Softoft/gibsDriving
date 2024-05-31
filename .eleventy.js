const { EleventyI18nPlugin } = require("@11ty/eleventy");


module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(EleventyI18nPlugin, {
		defaultLanguage: "en",
	});
	eleventyConfig.addPassthroughCopy("images");
	eleventyConfig.addPassthroughCopy("guest_posts");
	eleventyConfig.addPassthroughCopy("index.css");
	eleventyConfig.addPassthroughCopy("index.js");
	eleventyConfig.addPassthroughCopy("fallback-language-redirect.js");
	eleventyConfig.addPassthroughCopy("CNAME");
	eleventyConfig.addPassthroughCopy("google260ae717eb48ea92.html");
	eleventyConfig.addCollection("englishBlogs", function(collectionApi) {
		return collectionApi.getFilteredByTag("blog").filter((item) => item.page.lang === "en");
	});
	eleventyConfig.addCollection("dutchBlogs", function(collectionApi) {
		return collectionApi.getFilteredByTag("blog").filter((item) => item.page.lang === "nl");
	});
	return {
		dir: {
			output: "docs",
		},
	};
};
