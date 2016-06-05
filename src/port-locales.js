var YAML = require('yamljs');
var fs = require('fs');

var locales = fs.readdirSync('../../nelumba-i18n/lib/nelumba-i18n/locales');

locales.forEach(function(locale) {
  var grammar = YAML.load('../../nelumba-i18n/lib/nelumba-i18n/locales/'+locale+'/grammar.yml');
  var lexicon = YAML.load('../../nelumba-i18n/lib/nelumba-i18n/locales/'+locale+'/lexicon.yml');

  var stream = fs.createWriteStream("../bin/nelumba.i18n."+locale+".js");

  stream.once('open', function(fd) {
    stream.write("if (!(\"nelumba\" in window)) { window.nelumba = {}; }\n");
    stream.write("if (!(\"i18n\" in nelumba)) { nelumba.i18n = {}; }\n");
    stream.write("if (!(\"grammars\" in nelumba.i18n)) { nelumba.i18n.grammars = {}; }\n");
    stream.write("if (!(\"lexicons\" in nelumba.i18n)) { nelumba.i18n.lexicons = {}; }\n");
    stream.write("nelumba.i18n.grammars."+locale+" = " + JSON.stringify(grammar[locale]) + ";\n");
    stream.write("nelumba.i18n.lexicons."+locale+" = " + JSON.stringify(lexicon[locale]) + ";\n");
  });
});
