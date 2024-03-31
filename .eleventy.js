module.exports = function(eleventyConfig) {
	// Copy the `assets` directory to the output
	eleventyConfig.addPassthroughCopy("images");
	eleventyConfig.addPassthroughCopy("index.css");
	eleventyConfig.addPassthroughCopy("index.js");
	eleventyConfig.addPassthroughCopy("CNAME");
	eleventyConfig.addPassthroughCopy("google260ae717eb48ea92.html");
	eleventyConfig.addPassthroughCopy("sitemap.xml");
};
