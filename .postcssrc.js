// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
  "plugins": {
    // to edit target browsers: use "browserslist" field in package.json
    "postcss-write-svg": {},
    "autoprefixer": {},
    "postcss-px-to-viewport": {
    	viewportWidth: 750, 
    	viewportHeight: 1334, 
    	unitPrecision: 7, 
    	viewportUnit: 'vw', 
    	selectorBlackList: [], 
    	minPixelValue: 1, 
    	mediaQuery: false
    }  
  }
}
