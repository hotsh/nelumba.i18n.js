var YAML = require('yamljs');
var fs = require('fs');

var locales = fs.readdirSync('../../lotus-i18n/lib/lotus-i18n/locales');

locales.forEach(function(locale) {
  var grammar = require('../../lotus-i18n/lib/lotus-i18n/locales/'+locale+'/grammar.yml');
  var lexicon = require('../../lotus-i18n/lib/lotus-i18n/locales/'+locale+'/lexicon.yml');

  var stream = fs.createWriteStream("../bin/lotus.i18n."+locale+".js");

  stream.once('open', function(fd) {
    stream.write("if (!(\"lotus\" in window)) { window.lotus = {}; }\n");
    stream.write("if (!(\"i18n\" in lotus)) { lotus.i18n = {}; }\n");
    stream.write("if (!(\"raw_grammars\" in lotus.i18n)) { lotus.i18n.raw_grammars = {}; }\n");
    stream.write("if (!(\"raw_lexicons\" in lotus.i18n)) { lotus.i18n.raw_lexicons = {}; }\n");
    stream.write("lotus.i18n.raw_grammars."+locale+" = " + JSON.stringify(grammar) + ";\n");
    stream.write("lotus.i18n.raw_lexicons."+locale+" = " + JSON.stringify(lexicon) + ";\n");
  });
});
