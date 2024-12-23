import { EleventyHtmlBasePlugin, EleventyRenderPlugin } from "@11ty/eleventy";
import pluginWebc from "@11ty/eleventy-plugin-webc";

/** @param {import("@11ty/eleventy").UserConfig} config */
export default function (config) {
    config.addPlugin(EleventyHtmlBasePlugin, {
        baseHref: process.env.NODE_ENV === "production" ? "https://www.eniehack.net/~eniehack" : "http://localhost:8080",
    })
    config.addPassthroughCopy("assets");
    config.addPlugin(EleventyRenderPlugin);
    config.addBundle("css");
    config.addPlugin(pluginWebc, {
       components: "src/_includes/**/*.webc",
    })
    config.addFilter("toISO8601", function (date) {
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
