function update() {
  var options = {};

  var pronoun_dropdown = document.getElementById("actor_pronoun");
  var pronoun = pronoun_dropdown.options[pronoun_dropdown.selectedIndex].value;
  if (pronoun != "none") {
    if (document.getElementById("actor_plural").checked) {
      options.actors = {value: pronoun};
    }
    else {
      options.actor = {value: pronoun};
    }
  }
  else {
    var actor = document.getElementById("actor").value;
    if (actor != "") {
      if (document.getElementById("actor_plural").checked) {
        options.actors = actor;
      }
      else {
        options.actor = actor;
      }
    }
  }

  var verb_dropdown = document.getElementById("verb");
  var verb = verb_dropdown.options[verb_dropdown.selectedIndex].value;
  if (verb != "none") {
    options.verb = {value: verb};
  }

  var object_dropdown = document.getElementById("object");
  var object = object_dropdown.options[object_dropdown.selectedIndex].value;
  if (object != "none") {
    if (document.getElementById("object_plural").checked) {
      options.objects = {value: object};
    }
    else {
      options.object = {value: object};
    }
  }

  var target_dropdown = document.getElementById("target");
  var target = target_dropdown.options[target_dropdown.selectedIndex].value;
  if (target != "none") {
    if (document.getElementById("target_plural").checked) {
      options.targets = {value: target};
    }
    else {
      options.target = {value: target};
    }
  }

  pronoun_dropdown = document.getElementById("object_owner_pronoun");
  pronoun = pronoun_dropdown.options[pronoun_dropdown.selectedIndex].value;
  if (pronoun != "none") {
    if (document.getElementById("object_owner_plural").checked) {
      options.object_owners = {value: pronoun};
    }
    else {
      options.object_owner = {value: pronoun};
    }
  }
  else {
    var object_owner = document.getElementById("object_owner").value;
    if (object_owner != "") {
      if (document.getElementById("object_owner_plural").checked) {
        options.object_owners = object_owner;
      }
      else {
        options.object_owner = object_owner;
      }
    }
  }

  pronoun_dropdown = document.getElementById("target_owner_pronoun");
  pronoun = pronoun_dropdown.options[pronoun_dropdown.selectedIndex].value;
  if (pronoun != "none") {
    if (document.getElementById("target_owner_plural").checked) {
      options.target_owners = {value: pronoun};
    }
    else {
      options.target_owner = {value: pronoun};
    }
  }
  else {
    var target_owner = document.getElementById("target_owner").value;
    if (target_owner != "") {
      if (document.getElementById("target_owner_plural").checked) {
        options.target_owners = target_owner;
      }
      else {
        options.target_owner = target_owner;
      }
    }
  }

  var result = nelumba.i18n.sentence(options);
  document.getElementById("output_en").innerHTML = result;

  options.locale = "es";
  result = nelumba.i18n.sentence(options);
  document.getElementById("output_es").innerHTML = result;
}

document.getElementById("actor").onkeyup = update;
document.getElementById("actor").onchange = update;
document.getElementById("actor_plural").onkeyup = update;
document.getElementById("actor_plural").onchange = update;
document.getElementById("object_plural").onkeyup = update;
document.getElementById("object_plural").onchange = update;
document.getElementById("target_plural").onkeyup = update;
document.getElementById("target_plural").onchange = update;
document.getElementById("target").onkeyup = update;
document.getElementById("target").onchange = update;
document.getElementById("object").onkeyup = update;
document.getElementById("object").onchange = update;
document.getElementById("verb").onkeyup = update;
document.getElementById("verb").onchange = update;
document.getElementById("object_owner_plural").onkeyup = update;
document.getElementById("object_owner_plural").onchange = update;
document.getElementById("target_owner_plural").onkeyup = update;
document.getElementById("target_owner_plural").onchange = update;
document.getElementById("target_owner").onkeyup = update;
document.getElementById("target_owner").onchange = update;
document.getElementById("object_owner").onkeyup = update;
document.getElementById("object_owner").onchange = update;
document.getElementById("object_owner_pronoun").onkeyup = update;
document.getElementById("object_owner_pronoun").onchange = update;
document.getElementById("target_owner_pronoun").onkeyup = update;
document.getElementById("target_owner_pronoun").onchange = update;
document.getElementById("actor_pronoun").onkeyup = update;
document.getElementById("actor_pronoun").onchange = update;

update();
