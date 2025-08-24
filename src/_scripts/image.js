import Image from "@11ty/eleventy-img";

const getImageUrl = async function(src) {
	const img = await Image(src, {
		formats: ["webp", "png"],
        outputDir: "_site/img/",
        transformOnRequest: process.env.ELEVENTY_RUN_MODE === "serve",
	});
    let data = img.webp[img.webp.length - 1];
    return data.url
};

const filter = { getImageUrl };

export {
    filter
}