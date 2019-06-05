let mix = require('laravel-mix');

class VaporMixPlugin {
    boot() {
        Config.postCss.push(function (css) {
            css.walkDecls(decl => {
                decl.value = decl.value.replace(/\{\{\sASSET_URL\s\}\}/g, process.env.ASSET_URL)
            })
        });
    }
}

mix.extend('vapor', new VaporMixPlugin());
