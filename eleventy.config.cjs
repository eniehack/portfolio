const { EleventyHtmlBasePlugin } = require("@11ty/eleventy");
const pluginWebc = require("@11ty/eleventy-plugin-webc");

/** @param {import("@11ty/eleventy").UserConfig} config */
module.exports = function (config) {
    config.addPlugin(pluginWebc)
    config.addPlugin(EleventyHtmlBasePlugin, {
        baseHref: process.env.NODE_ENV === "production" ? "https://www.eniehack.net/~eniehack" : "http://localhost:8080",
    })
    config.addPassthroughCopy("assets");
    config.addShortcode("date", function () {
      const date = new Date();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${date.getFullYear()}-${month.toString().length !== 2 ? "0"+month.toString() : month.toString() }-${day.toString().length !== 2 ? "0"+day.toString() : day.toString() }`
    });

    return {
        dir: {
            input: "src",
            include: "src/_includes",
            data: "_data",
        },
        htmlTemplateEngine: "njk",
        templateFormats: ["html", "njk", "webc"],
        pathPrefix: process.env.NODE_ENV === "production" ? "/~eniehack/" : "/",
    }
}
