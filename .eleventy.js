module.exports = function (eleventyConfig) {
	// Copy the `assets` directory to the output
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
