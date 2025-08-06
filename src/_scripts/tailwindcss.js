import fs from 'fs';
import path from 'path';

/**
 * 
 * @param {{input: string, output: string, processor: import("postcss").Processor }} opts 
 */
export const tailwindProcessor = async ({ input, output, processor }) => {
    const inputCSSPath = path.resolve(input)
    const outputCSSPath = path.resolve(output)
    const content = fs.readFileSync(inputCSSPath, 'utf8')
    const outputDir = path.dirname(outputCSSPath)
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {recursive: true})
    }

    const result = await processor.process(content, {
        from: inputCSSPath,
        to: outputCSSPath
    })

    fs.writeFileSync(outputCSSPath, result.css)
}