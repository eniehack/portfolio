import { EleventyHtmlBasePlugin, EleventyRenderPlugin } from "@11ty/eleventy";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import { Recipe } from '@cooklang/cooklang-ts';
import fs from "node:fs"

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
    // from https://rknight.me/blog/adding-cooklang-support-to-eleventy-two-ways/
    config.addTemplateFormats("cook");
    config.addExtension("cook", {
        getData: async (inputPath) => {
            const content = fs.readFileSync(inputPath, 'utf-8').split('---')[2]
            const recipe = new Recipe(content, {defaultIngredientAmount: "適量"})
            return {
                ingredients: recipe.ingredients,
                metadata: recipe.metadata,
                steps: recipe.steps.map(step => {
                    return step.map(s => {
                        if (s.type === 'text') {
                            return s.value
                        } else if (s.type === 'ingredient') {
                            return `<span class="cl-ingredient">${s.name.toLowerCase()}</span>`
                        } else if (s.type === 'timer') {
                            return `<span class="cl-timer">${s.quantity} ${s.units}</span>`
                        } else if (s.type === 'cookware') {
                            return `<span class="cl-cookware">${s.name.toLowerCase()}</span>`
                        }
                    }).join('')
                }),
            }
		},
		compile: async (inputContent) => {
			return async () => {
				return inputContent
			};
		},
    })

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
