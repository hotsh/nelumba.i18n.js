if (!("nelumba" in window)) {
  window.nelumba = (function () {
    var nelumba = {
    };

    return nelumba;
  }());
}

if (!("i18n" in nelumba)) {
  nelumba.i18n = {}
}

if (!("lexicons" in nelumba.i18n)) {
  nelumba.i18n.lexicons = {}
}

if (!("grammars" in nelumba.i18n)) {
  nelumba.i18n.grammars = {}
}

if (!("rules" in nelumba.i18n)) {
  nelumba.i18n.rules = {}
}

if (!('indexOf' in Array.prototype)) {
  Array.prototype.indexOf= function(find, i /*opt*/) {
    if (i===undefined) i= 0;
    if (i<0) i+= this.length;
    if (i<0) i= 0;
    for (var n= this.length; i<n; i++)
      if (i in this && this[i]===find)
        return i;
    return -1;
  };
}
if (!Object.keys) {
  Object.keys = function (obj) {
    var keys = [],
        k;
    for (k in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, k)) {
        keys.push(k);
      }
    }
    return keys;
  };
}
if (!('forEach' in Array.prototype)) {
  Array.prototype.forEach= function(action, that /*opt*/) {
    for (var i= 0, n= this.length; i<n; i++)
      if (i in this)
        action.call(that, this[i], i, this);
  };
}
if (!('map' in Array.prototype)) {
  Array.prototype.map= function(mapper, that /*opt*/) {
    var other= new Array(this.length);
    for (var i= 0, n= this.length; i<n; i++)
      if (i in this)
        other[i]= mapper.call(that, this[i], i, this);
    return other;
  };
}
if (!('filter' in Array.prototype)) {
  Array.prototype.filter= function(filter, that /*opt*/) {
    var other= [], v;
    for (var i=0, n= this.length; i<n; i++)
      if (i in this && filter.call(that, v= this[i], i, this))
        other.push(v);
    return other;
  };
}
if (!('every' in Array.prototype)) {
  Array.prototype.every= function(tester, that /*opt*/) {
    for (var i= 0, n= this.length; i<n; i++)
      if (i in this && !tester.call(that, this[i], i, this))
        return false;
    return true;
  };
}

nelumba.i18n.lexicon = function(options) {
  var locale = nelumba.i18n.locale(options);

  if (locale in nelumba.i18n.lexicons) {
    return nelumba.i18n.lexicons[locale];
  }

  return null;
}

nelumba.i18n.grammar = function(options) {
  var locale = nelumba.i18n.locale(options);

  if (locale in nelumba.i18n.grammars) {
    return nelumba.i18n.grammars[locale];
  }

  return null;
};

nelumba.i18n.rules = function(options) {
  var locale = nelumba.i18n.locale(options);

  if (locale in nelumba.i18n.rules) {
    return nelumba.i18n.rules[locale];
  }

  var grammar = nelumba.i18n.grammar(options);
  var rules = [];

  function cartProd(paramArray) {
    function addTo(curr, args) {
      var i, copy,
          rest = args.slice(1),
          last = !rest.length,
          result = [];

      for (i = 0; i < args[0].length; i++) {
        copy = curr.slice();
        copy.push(args[0][i]);

        if (last) {
          result.push(copy);
        } else {
          result = result.concat(addTo(copy, rest));
        }
      }

      return result;
    }

    return addTo([], Array.prototype.slice.call(arguments));
  }

  var number_of_rules = grammar["rules"].length;
  for (var i = 0; i < number_of_rules; i++) {
    var rule = grammar["rules"][i];

    if (rule["match"] && rule["match"].length > 0 &&
        !(typeof(rule["match"][0]) == "object")) {
      rule["match"] = [rule["match"]];
    }

    if (rule["do"].match(/\$[^\$]+\$/)) {
      var patterns = rule["do"].split('$');
      if ((patterns.length % 2) == 0) {
        patterns.push("");
      }
      var number_of_subrules = (patterns.length - 1) / 2;
      var subrules = [];
      for (var j = 1; j < patterns.length; j+=2) {
        subrules.push(grammar["subrules"][patterns[j]]);
      }

      subrules = cartProd.apply(null, subrules);

      for (var j = 0; j < subrules.length; j++) {
        var set = subrules[j];
        var new_rule = {};

        new_rule["for"] = [];
        for (var k = 0; k < set.length; k++) {
          new_rule["for"] = new_rule["for"].concat(set[k]["for"]);
        }
        new_rule["for"] = new_rule["for"].concat(rule["for"]);
        // Remove duplicates and nulls:
        new_rule["for"] = new_rule["for"].filter(function(elem, pos, self) {
          if (elem == null) {
            return false;
          }
          return self.indexOf(elem) == pos;
        });

        new_rule["match"] = [];
        for (var k = 0; k < set.length; k++) {
          var matches = set[k]["match"];
          if (matches && matches.length > 0 &&
              !(typeof(matches[0]) == "object")) {
            matches = [matches];
          }
          if (matches) {
            new_rule["match"] = new_rule["match"].concat(matches);
          }
        }

        if (new_rule["match"].length == 0) {
          new_rule["match"].push([]);
        }

        new_rule["do"] = "";
        for (var k = 0; k < patterns.length; k++) {
          if ((k % 2) == 0) {
            new_rule["do"] += patterns[k];
          }
          else {
            new_rule["do"] += set[(k-1)/2]["do"];
          }
        }

        rules.push(new_rule);
      }
    }
    else {
      if (!rule["for"]) {
        rule["for"] = [];
      }

      if (!rule["match"]) {
        rule["match"] = [[]];
      }

      rules.push(rule);
    }
  }

  nelumba.i18n.rules[locale] = rules;

  return nelumba.i18n.rules[locale];
};

nelumba.i18n.translate = function(tag, options) {
  if (options == undefined) {
    options = {};
  }

  var locale = nelumba.i18n.locale(options);
  var lexicon = nelumba.i18n.lexicon(options);

  function pathTo(obj,is) {
    function multiIndex(obj,is) {
      return is.length ? multiIndex(obj[is[0]],is.slice(1)) : obj
    }
    return multiIndex(obj,is.split('.'))
  }

  return pathTo(lexicon, tag);
};

nelumba.i18n.sentence = function(options) {
  var locale = nelumba.i18n.locale(options);
  var rules = nelumba.i18n.rules(options);
  var lexicon = nelumba.i18n.lexicon(options);

  var components = {};
  var elements = [];

  if (typeof(options["actor"]) == "object") {
    components["actor_pronoun"] = options["actor"];
    elements.push("actor_pronoun");
  }
  else if (options["actor_pronoun"]) {
    components["actor_pronoun"] = options["actor_pronoun"];
    elements.push("actor_pronoun");
  }
  else if (options["actor"]) {
    components["actor"] = options["actor"];
    elements.push("actor");
  }

  if (typeof(options["actors"]) == "object") {
    components["actors_pronoun"] = options["actors"];
    elements.push("actors_pronoun");
  }
  else if (options["actors_pronoun"]) {
    components["actors_pronoun"] = options["actors_pronoun"];
    elements.push("actors_pronoun");
  }
  else if (options["actors"]) {
    components["actors"] = options["actors"];
    elements.push("actors");
  }

  if (typeof(options["object_owner"]) == "object") {
    components["object_owner_pronoun"] = options["object_owner"];
    elements.push("object_owner_pronoun");
  }
  else if (options["object_owner_pronoun"]) {
    components["object_owner_pronoun"] = options["object_owner_pronoun"];
    elements.push("object_owner_pronoun");
  }
  else if (options["object_owner"]) {
    components["object_owner"] = options["object_owner"];
    elements.push("object_owner");
  }

  if (typeof(options["object_owners"]) == "object") {
    components["object_owners_pronoun"] = options["object_owners"];
    elements.push("object_owners_pronoun");
  }
  else if (options["object_owners_pronoun"]) {
    components["object_owners_pronoun"] = options["object_owners_pronoun"];
    elements.push("object_owners_pronoun");
  }
  else if (options["object_owners"]) {
    components["object_owners"] = options["object_owners"];
    elements.push("object_owners");
  }

  if (typeof(options["target_owner"]) == "object") {
    components["target_owner_pronoun"] = options["target_owner"];
    elements.push("target_owner_pronoun");
  }
  else if (options["target_owner_pronoun"]) {
    components["target_owner_pronoun"] = options["target_owner_pronoun"];
    elements.push("target_owner_pronoun");
  }
  else if (options["target_owner"]) {
    components["target_owner"] = options["target_owner"];
    elements.push("target_owner");
  }

  if (typeof(options["target_owners"]) == "object") {
    components["target_owners_pronoun"] = options["target_owners"];
    elements.push("target_owners_pronoun");
  }
  else if (options["target_owners_pronoun"]) {
    components["target_owners_pronoun"] = options["target_owners_pronoun"];
    elements.push("target_owners_pronoun");
  }
  else if (options["target_owners"]) {
    components["target_owners"] = options["target_owners"];
    elements.push("target_owners");
  }

  if (options["action"]) {
    components["action"] = options["action"];
    elements.push("action");
  }

  if (options["field"]) {
    components["field"] = options["field"];
    elements.push("field");
  }

  if (options["object"]) {
    components["object"] = options["object"];
    elements.push("object");
  }

  if (options["objects"]) {
    components["objects"] = options["objects"];
    elements.push("objects");
  }

  if (options["target"]) {
    components["target"] = options["target"];
    elements.push("target");
  }

  if (options["targets"]) {
    components["targets"] = options["targets"];
    elements.push("targets");
  }

  if (options["verb"]) {
    components["verb"] = options["verb"];
    elements.push("verb");
  }

  var result = "";
  rules.every(function(hash, i, arr) {
    var unused = hash["for"].filter(function(elem, i, self) {
      return !(elem in components)
    });

    if (hash["for"].indexOf("actor") != -1 && hash["for"].indexOf("verb") != -1) {
    }

    if (unused.length == 0 && hash["for"].length == elements.length) {
      if (!hash["match"]) {
        hash["match"] = [[]];
      }

      var violations = hash["match"].filter(function(rule, i, self) {
        if (rule[0] && components[rule[0]]) {
          var value = components[rule[0]];
          if (typeof(value) == "object") {
            value = value.value;
          }
          return !value.match(new RegExp(rule[1]));
        }
        else {
          return false;
        }
      });

      if (violations.length == 0) {
        result = hash["do"];

        elements.forEach(function(component, i, self) {
          var value = components[component];
          if (typeof(value) == "object") {
            value = value.value;
            var matcher = new RegExp("[\\.a-zA-Z_]*%"
              + component.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1")
              + "%[\\.a-zA-Z_]*");

            token = result.match(matcher);
            token = token[0].replace("%"+component+"%", value);
            result = result.replace(matcher, nelumba.i18n.translate(token, options));
          }
          else {
            result = result.replace("%"+component+"%", value);
          }
        });

        return false;
      }
    }

    return true;
  });

  return result;
};

nelumba.i18n.locale = function(options) {
  var locale = options["locale"];

  if (!locale) {
    locale = "en";
  }

  return locale;
};

nelumba.i18n.verbs = {
  post: { value: "post" }
};

nelumba.i18n.objects = {
  note:  { value: "note" },
  album: { value: "album" },
  file:  { value: "file" }
};

nelumba.i18n.pronouns = {
  he:  { value: "he" },
  she: { value: "she" },
  ey:  { value: "ey" }
};
