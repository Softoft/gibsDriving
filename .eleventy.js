const { EleventyI18nPlugin } = require("@11ty/eleventy");


module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(EleventyI18nPlugin, {
		defaultLanguage: "en",
	});
	eleventyConfig.addPassthroughCopy("images");
	eleventyConfig.addPassthroughCopy("guest_posts");
	eleventyConfig.addPassthroughCopy("styles");
	eleventyConfig.addPassthroughCopy("scripts");
	eleventyConfig.addPassthroughCopy("CNAME");
	eleventyConfig.addCollection("englishBlogs", function(collectionApi) {
		return collectionApi.getFilteredByTag("blog").filter((item) => item.page.lang === "en");
	});
	eleventyConfig.addCollection("dutchBlogs", function(collectionApi) {
		return collectionApi.getFilteredByTag("blog").filter((item) => item.page.lang === "nl");
	});
	eleventyConfig.addCollection("germanBlogs", function (collectionApi) {
		return collectionApi.getFilteredByTag("blog").filter((item) => item.page.lang === "de");
	});
	return {
		dir: {
			input: "src",
			includes: "_includes",
			output: "_site",
		},
	};
};
