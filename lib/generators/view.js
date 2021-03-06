// Generated by CoffeeScript 1.6.3
(function() {
  var View, fs, fsu, path;

  fs = require('fs');

  fsu = require('fs-util');

  path = require('path');

  module.exports = View = (function() {
    function View(the, name, controller_name_lc, mvc, repl) {
      var contents, e, name_camel, name_lc, src, style_folder, style_path, style_relative, template_folder, template_path, template_relative, tmpl_mvc, tmpl_style, tmpl_template, tmpl_view, view_folder, view_path, view_relative;
      this.the = the;
      this.repl = repl;
      name_camel = name.camelize();
      name_lc = name.toLowerCase();
      src = path.join(this.the.app_root, 'src');
      view_folder = path.join(src, "app/views/" + controller_name_lc);
      template_folder = path.join(src, "templates/" + controller_name_lc);
      style_folder = path.join(src, "styles/" + controller_name_lc);
      if (mvc) {
        view_path = "" + view_folder + "/index.coffee";
        template_path = "" + template_folder + "/index.jade";
        style_path = "" + style_folder + "/index.styl";
      } else {
        view_path = "" + view_folder + "/" + name_lc + ".coffee";
        template_path = "" + template_folder + "/" + name_lc + ".jade";
        style_path = "" + style_folder + "/" + name_lc + ".styl";
      }
      view_relative = view_path.replace(this.the.app_root + '/', '');
      template_relative = template_path.replace(this.the.app_root + '/', '');
      style_relative = style_path.replace(this.the.app_root + '/', '');
      tmpl_mvc = "" + this.the.root + "/cli/templates/mvc";
      tmpl_view = "" + tmpl_mvc + "/view.coffee";
      tmpl_template = "" + tmpl_mvc + "/view.jade";
      tmpl_style = "" + tmpl_mvc + "/view.styl";
      try {
        fsu.mkdir_p(view_folder);
        fsu.mkdir_p(template_folder);
        fsu.mkdir_p(style_folder);
      } catch (_error) {
        e = _error;
      }
      contents = (fs.readFileSync(tmpl_view)).toString();
      contents = contents.replace(/~NAME_LOWER/g, name_lc);
      contents = contents.replace(/~NAME_CAMEL/g, name_camel);
      contents = contents.replace(/~CONTROLLER_NAME_LC/g, controller_name_lc);
      if (!fs.existsSync(view_path)) {
        fs.writeFileSync(view_path, contents);
        if (!this.repl) {
          console.log(("" + 'Created'.bold + " " + view_relative).green);
        }
      } else {
        (this.repl || console).error(("" + 'Already exists'.bold + " " + view_relative).yellow);
      }
      if (!fs.existsSync(template_path)) {
        fs.writeFileSync(template_path, fs.readFileSync(tmpl_template));
        if (!this.repl) {
          console.log(("" + 'Created'.bold + " " + template_relative).green);
        }
      } else {
        (this.repl || console).error(("" + 'Already exists'.bold + " " + template_relative).yellow);
      }
      if (!fs.existsSync(style_path)) {
        fs.writeFileSync(style_path, fs.readFileSync(tmpl_style));
        if (!this.repl) {
          console.log(("" + 'Created'.bold + " " + style_relative).green);
        }
      } else {
        (this.repl || console).error(("" + 'Already exists'.bold + " " + style_relative).yellow);
      }
    }

    return View;

  })();

}).call(this);

/*
//@ sourceMappingURL=view.map
*/
