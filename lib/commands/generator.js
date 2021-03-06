// Generated by CoffeeScript 1.6.3
(function() {
  var Controller, Generator, Model, Question, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Model = require('../generators/model');

  Controller = require('../generators/controller');

  View = require('../generators/view');

  Question = require('../generators/question');

  module.exports = Generator = (function(_super) {
    __extends(Generator, _super);

    Generator.prototype.log_changes = true;

    function Generator(the, cli, type, name, repl) {
      this.the = the;
      this.cli = cli;
      this.repl = repl;
      if (!this.the.is_theoricus_app()) {
        return;
      }
      if (this.cli === null) {
        this.cli = {
          argv: {
            generate: type,
            _: [name]
          }
        };
      }
      this.create();
    }

    Generator.prototype.create = function() {
      var error_msg, f, name, q, type,
        _this = this;
      if (this.cli.argv.generate === true) {
        q = "Which you would like to create? [model|view|controller|mvc] : ";
        f = /(model|view|controller|mvc)/;
        return this.ask(q, f, function(type) {
          _this.cli.argv.generate = type;
          return _this.create();
        });
      }
      type = this.cli.argv.generate;
      if (this[type] == null) {
        error_msg = "Valid options: controller, model, view, mvc.";
        if (this.repl) {

        } else {
          return console.error(error_msg);
        }
      }
      name = this.cli.argv._[0];
      if (name == null) {
        q = "Please give it a name : ";
        f = /([^\s]*)/;
        return this.ask(q, f, function(name) {
          _this.cli.argv._ = [name];
          return _this.create();
        });
      }
      return this[type](name);
    };

    Generator.prototype.mvc = function(name) {
      this.model(name.singularize());
      this.view("" + name + "/index", true);
      return this.controller(name);
    };

    Generator.prototype.model = function(name) {
      return new Model(this.the, name, this.repl);
    };

    Generator.prototype.view = function(path, mvc) {
      var error_msg, folder, name, parts;
      if (mvc == null) {
        mvc = false;
      }
      folder = (parts = path.split('/'))[0];
      name = parts[1];
      if (name == null) {
        error_msg = 'ERROR '.bold.red + "Views should be added with path-style notation.\n\nUsage:\n  the -g view <controller-name>/<view-name>\n\nExamples:\n  the -g view users/index\n  the -g view users/list\n\n(*)\n  Remember that controller names are plural.\n  View names are singular.";
        return console.log(error_msg);
      }
      return new View(this.the, name, folder, mvc, this.repl);
    };

    Generator.prototype.controller = function(name) {
      return new Controller(this.the, name, this.repl);
    };

    return Generator;

  })(Question);

}).call(this);

/*
//@ sourceMappingURL=generator.map
*/
