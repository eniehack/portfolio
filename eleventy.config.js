import { EleventyHtmlBasePlugin, EleventyRenderPlugin } from "@11ty/eleventy";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import pluginRss from "@11ty/eleventy-plugin-rss";
import {filter as monoxaFilter, shortCode as monoxaShortCode} from "./src/_scripts/monoxa.js";
import {extension as cookExtension} from "./src/_scripts/cooklang.js";

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
    config.addPlugin(pluginRss);

    config.addFilter("newDate", monoxaFilter.newDate);
    config.addFilter("sortUpdates", monoxaFilter.sortUpdates);
    config.addFilter("reverseUpdates", monoxaFilter.reverseUpdates);
    config.addShortcode("now", monoxaShortCode.now);
    config.addShortcode("date", monoxaShortCode.date);

    config.addFilter("dateToRfc3339", pluginRss.dateToRfc3339);
    config.addFilter("toISO8601", function (date) {
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${date.getFullYear()}-${month.toString().length !== 2 ? "0"+month.toString() : month.toString() }-${day.toString().length !== 2 ? "0"+day.toString() : day.toString() }`
    });

    // from https://rknight.me/blog/adding-cooklang-support-to-eleventy-two-ways/
    config.addTemplateFormats("cook");
    config.addExtension("cook", cookExtension)

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
