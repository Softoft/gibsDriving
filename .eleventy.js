const { EleventyI18nPlugin } = require("@11ty/eleventy");


module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(EleventyI18nPlugin, {
		defaultLanguage: "en",
	});
	eleventyConfig.addPassthroughCopy("images");
	eleventyConfig.addPassthroughCopy("index.css");
	eleventyConfig.addPassthroughCopy("index.js");
	eleventyConfig.addPassthroughCopy("CNAME");
	eleventyConfig.addPassthroughCopy("sitemap.xml");
	eleventyConfig.addPassthroughCopy("robots.txt");
	return {
		dir: {
			output: "docs",
		},
	};
};
