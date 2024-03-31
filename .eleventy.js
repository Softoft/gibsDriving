module.exports = function(eleventyConfig) {
	// Copy the `assets` directory to the output
	eleventyConfig.addPassthroughCopy("images");
	eleventyConfig.addPassthroughCopy("index.css");
};
