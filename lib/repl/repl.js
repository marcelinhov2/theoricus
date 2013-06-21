// Generated by CoffeeScript 1.6.3
(function() {
  var Event, REPL, colors, cs, cs_eval, fs, path, repl, util, vm,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  util = require('util');

  repl = require('repl');

  fs = require('fs');

  colors = require('colors');

  path = require('path');

  vm = require('vm');

  cs = require('coffee-script');

  cs_eval = require('./repl-cs');

  Event = require('../utils/event');

  module.exports = REPL = (function(_super) {
    __extends(REPL, _super);

    REPL.prototype.mode = 'cs';

    REPL.prototype.multiline = null;

    REPL.prototype.initialized = false;

    function REPL() {
      this.destroy = __bind(this.destroy, this);
      this.generate = __bind(this.generate, this);
      this.set_mode = __bind(this.set_mode, this);
      this["eval"] = __bind(this["eval"], this);
      console.log('➜  ' + 'initializing..'.grey);
      this.mode = 'js';
      this.multiline = {
        enabled: false,
        buffer: '',
        lines: 0
      };
      this.stdout = process.stdout, this.stdin = process.stdin;
    }

    REPL.prototype.start = function() {
      var msg, prompt, terminal, useColors;
      msg = ['   Run'.grey, '.help'.white.bold, 'to see options'.grey].join(' ');
      console.log(msg);
      useColors = true;
      terminal = true;
      prompt = this.format_prompt();
      this.repl = repl.start({
        prompt: prompt,
        "eval": this["eval"],
        useColors: useColors,
        terminal: terminal
      });
      this.refresh_promt();
      this.configure_repl();
      this.configure_multiline();
      this.wrap_repl_interactions();
      this.wrap_rli_interactions();
      return this.initialized = true;
    };

    REPL.prototype.configure_repl = function() {
      var cmd, max_length, name, polyfills, standard_cmds, _ref, _results,
        _this = this;
      standard_cmds = '.break .clear .exit .help .save .load'.split(' ');
      max_length = 0;
      polyfills = ' ';
      this.repl.commands['.help'] = {
        help: 'Show repl options',
        action: function() {
          return _this.help(standard_cmds, max_length, polyfills);
        }
      };
      this.repl.commands['.set_mode'] = {
        help: 'Switches eval mode between javascript and coffeescript [js|cs]',
        action: this.set_mode
      };
      this.repl.commands['.g'] = {
        help: 'Generates models, views and controllers:'.white + ("\n\t\t.g model <model-name>\n\t\t.g view <controller-name>/<view-name>\n\t\t.g controller <controller-name>\n\t\t.g mvc <controller-name>\n\t\t" + '  * models,views=singular, controllers=plural'.cyan).grey,
        action: this.generate
      };
      this.repl.commands['.d'] = {
        help: 'Destroys models, views and controllers:'.white + ("\n\t\t.d model <model-name>\n\t\t.d view <controller-name>/<view-name>\n\t\t.d controller <controller-name>\n\t\t.d mvc <controller-name>\n\t\t.d mvc <controller-name> --rf (delete the whole view folder)\n\t\t" + '  * models,views=singular, controllers=plural'.cyan).grey,
        action: this.destroy
      };
      _ref = this.repl.commands;
      _results = [];
      for (name in _ref) {
        cmd = _ref[name];
        max_length = Math.max(max_length, name.length);
        _results.push(polyfills = (Array(max_length)).join(' '));
      }
      return _results;
    };

    REPL.prototype.configure_multiline = function() {
      var _this = this;
      return this.repl.inputStream.on('keypress', function(char, key) {
        if (!(key && key.ctrl && !key.meta && !key.shift && key.name === 'v')) {
          return;
        }
        if (_this.multiline) {
          if (!_this.multiline.buffer.match(/\n/)) {
            _this.multiline.enabled = !_this.multiline.enabled;
            _this.multiline.lines = 0;
            return _this.refresh_promt();
          }
          if ((_this.repl.rli.line != null) && !_this.repl.rli.line.match(/^\s*$/)) {
            return;
          }
          _this.multiline.enabled = !_this.multiline.enabled;
          _this.repl.rli.line = '';
          _this.repl.rli.cursor = 0;
          _this.repl.rli.output.cursorTo(0);
          _this.repl.rli.output.clearLine(1);
          if (_this.mode === 'cs') {
            _this.multiline.buffer = _this.multiline.buffer.replace(/\n/g, '\uFF00');
          } else if (_this.mode === 'js') {
            _this.multiline.buffer = _this.multiline.buffer.replace(/\n/g, '');
          }
          _this.repl.rli.emit('line', _this.multiline.buffer);
          _this.multiline.buffer = '';
          return _this.multiline.lines = 0;
        } else {
          _this.multiline.enabled = !_this.multiline.enabled;
          return _this.refresh_promt();
        }
      });
    };

    REPL.prototype.wrap_repl_interactions = function() {
      var _this = this;
      return this.repl.on('exit', function() {
        return process.exit();
      });
    };

    REPL.prototype.wrap_rli_interactions = function() {
      var on_line, on_sigint, quit,
        _this = this;
      quit = 0;
      on_line = (this.repl.rli.listeners('line'))[0];
      this.repl.rli.removeListener('line', on_line);
      this.repl.rli.on('line', function(cmd) {
        if (!_this.multiline.enabled) {
          return on_line(cmd);
        }
        _this.multiline.buffer += "" + cmd + "\n";
        _this.multiline.lines++;
        quit = 0;
        return _this.refresh_promt();
      });
      on_sigint = (this.repl.rli.listeners('SIGINT'))[0];
      this.repl.rli.removeListener('SIGINT', on_sigint);
      return this.repl.rli.on('SIGINT', function() {
        if (++quit === 2) {
          return _this.repl.rli.close();
        }
        console.log('\r\n(^C again to quit)');
        return _this.refresh_promt();
      });
    };

    REPL.prototype["eval"] = function(input, context, filename, callback) {
      var e;
      switch (this.mode) {
        case 'cs':
          cs_eval.apply(null, arguments);
          break;
        case 'js':
          try {
            callback(null, vm.runInContext(input, context, filename));
          } catch (_error) {
            e = _error;
            callback(e);
          }
      }
      return this.refresh_promt();
    };

    REPL.prototype.help = function(standard_cmds, max_length, polyfills) {
      var cmd, framed, name, _ref, _ref1;
      this.log('» '.bold.magenta + 'default'.bold.magenta);
      _ref = this.repl.commands;
      for (name in _ref) {
        cmd = _ref[name];
        if (!(__indexOf.call(standard_cmds, name) >= 0)) {
          continue;
        }
        framed = (polyfills + name).slice(-max_length);
        this.log("" + framed + "  " + cmd.help);
      }
      this.log('\n   ' + '» '.bold.magenta + 'theoricus'.bold.magenta);
      _ref1 = this.repl.commands;
      for (name in _ref1) {
        cmd = _ref1[name];
        if (!(__indexOf.call(standard_cmds, name) < 0)) {
          continue;
        }
        framed = (polyfills + name).slice(-max_length);
        this.log("" + framed + "  " + cmd.help);
      }
      this.log('\n   ' + '» Note:'.bold.magenta + 'theoricus'.bold.magenta);
      return this.log('\tCTRL + V toogle between single line vs multiline modes'.grey);
    };

    REPL.prototype.set_mode = function(mode) {
      this.mode = mode;
      this.refresh_promt();
      return this.log('Mode switched to:'.grey, mode.green);
    };

    REPL.prototype.generate = function(input) {
      var name, type, _ref;
      _ref = input.trim().split(' '), type = _ref[0], name = _ref[1];
      if (!type) {
        return this.error('Type not informed (model, view, controller, mvc) »'.red, '.g [type] [name]'.white);
      }
      if (!name) {
        return this.error('Name not informed »'.red, '.g [type] [name]'.white);
      }
      return this.emit('generate', type, name);
    };

    REPL.prototype.destroy = function(input) {
      var name, rf, type, _ref;
      _ref = input.trim().split(' '), type = _ref[0], name = _ref[1], rf = _ref[2];
      if (!type(/^--/.test(type))) {
        return this.error('Type not informed (model, view, controller, mvc) »'.red, '.d [type] [name] [--rf]'.white);
      }
      if (!name || (/^--/.test(name))) {
        return this.error('Name not informed »'.red, '.d [type] [name] [--rf]'.white);
      }
      return this.emit('destroy', type, name, rf === '--rf');
    };

    REPL.prototype.format_prompt = function() {
      var mode, start, the;
      start = '➜ '.red;
      if (this.multiline.enabled) {
        the = 'the';
        the += ((Array(6).join('.')) + this.multiline.lines).slice(-6);
        the = the.bold.grey;
      } else {
        the = 'theoricus'.bold.grey;
      }
      mode = ("(" + this.mode + ")").cyan;
      return "" + start + " " + the + ":" + mode + " ";
    };

    REPL.prototype.refresh_promt = function() {
      var prompt;
      prompt = this.format_prompt();
      this.repl.rli.setPrompt(prompt, prompt.stripColors.length);
      return this.repl.rli.prompt(true);
    };

    REPL.prototype.clear_prompt = function() {
      var chars;
      chars = (this.format_prompt()).length + 1;
      this.stdout.write("\x1B[" + chars + "D");
      this.stdout.write(Array(chars).join(' '));
      return this.stdout.write("\x1B[" + chars + "D");
    };

    REPL.prototype.show_prompt = function() {
      return this.stdout.write(this.format_prompt());
    };

    REPL.prototype.log = function() {
      var msg;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.initialized) {
        this.clear_prompt();
      }
      console.log.apply(null, ['  '].concat(msg));
      if (this.initialized) {
        return this.show_prompt();
      }
    };

    REPL.prototype.error = function() {
      var msg;
      msg = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (this.initialized) {
        this.clear_prompt();
      }
      console.error.apply(null, ['  '].concat(msg));
      if (this.initialized) {
        return this.show_prompt();
      }
    };

    return REPL;

  })(Event);

}).call(this);

/*
//@ sourceMappingURL=repl.map
*/