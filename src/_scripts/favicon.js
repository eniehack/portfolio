import * as cheerio from 'cheerio';
import { URL } from 'url';

async function getFavicon(url) {
  try {
    // URLの正規化
    const baseUrl = new URL(url);
    
    // HTMLを取得
    const response = await fetch(url, {
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; 11ty-favicon-bot/1.0)'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const html = await response.text();
    const $ = cheerio.load(html);
    
    // favicon候補を優先度順で検索
    const selectors = [
      'link[rel="icon"]',
      'link[rel="shortcut icon"]',
      'link[rel="apple-touch-icon"]',
      'link[rel="apple-touch-icon-precomposed"]'
    ];
    
    for (const selector of selectors) {
      const links = $(selector);
      let link;
      for (const l of links) {
        console.debug(l.attribs)
        if (! l.attribs["href"]) continue;
        link = l
        if (l.attribs["size"]) {
            if (l.attribs["size"] == "32x32") {
                break;
            }
        }
        console.debug(baseUrl.toString(), link.attribs)
      }
      if (link) {
        const href = link.attribs['href'];
        console.debug("href", new URL(href, baseUrl).href)
        if (href) {
          // 絶対URLに変換
          return new URL(href, baseUrl).href;
        }
      }
    }
    
    // デフォルトのfavicon.icoを試す
    const defaultFavicon = new URL('/favicon.ico', baseUrl).href;
    const faviconResponse = await fetch(defaultFavicon, { 
      method: 'HEAD',
      timeout: 3000 
    });
    
    if (faviconResponse.ok) {
      return defaultFavicon;
    }
    
    return null; // 見つからない場合
    
  } catch (error) {
    console.warn(`Favicon取得エラー (${url}):`, error.message);
    return null;
  }
};

const shortcode = { getFavicon };

export {
    shortcode
}

// 11tyでの使用例:
// .eleventy.js に追加
// eleventyConfig.addAsyncShortcode("favicon", require("./path/to/this/file"));
// 
// テンプレートでの使用:
// {% favicon "https://example.com" %}