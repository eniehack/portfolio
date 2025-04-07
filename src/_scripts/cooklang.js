import { Recipe } from '@cooklang/cooklang-ts';
import fs from "node:fs/promises";

// from https://rknight.me/blog/adding-cooklang-support-to-eleventy-two-ways/
export const extension = {
    getData: async (inputPath) => {
        const fileContent = await fs.readFile(inputPath, 'utf-8')
        const content = fileContent.split('---')[2]
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
}
