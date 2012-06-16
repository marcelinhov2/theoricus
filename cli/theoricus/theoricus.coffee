#<< theoricus/commands/*

exports.run = ->
	new theoricus.Theoricus

class Theoricus

	# requirements
	fs = require "fs"
	path = require "path"
	colors = require 'colors'
	
	constructor:->
		@pwd = @_get_app_root()
		@root = path.normalize __dirname + "/.."
		
		cmds =	"#{'model'.cyan}#{'|'.white}#{'view'.cyan}#{'|'.white}" +
				"#{'controller'.cyan}#{'|'.white}#{'all'.cyan}"

		@header = "#{'Theoricus'.bold} #{'v0.0.1\n  Blast MVC implementation for CoffeeScript'.grey}\n\n"

		@header += "#{'Usage:'.bold}\n"
		@header += "  theoricus #{'new'.red}      #{'path'.green}\n"
		@header += "  theoricus #{'add'.red}      #{cmds} [#{'name'.magenta}] [#{'field1'.yellow}] [#{'field2'.yellow}]\n"
		@header += "  theoricus #{'rm'.red}       #{cmds} [#{'name'.magenta}]\n"
		@header += "  theoricus #{'start'.red}    [#{'port'.magenta}] [#{'--no-indexing'.green}] [#{'--force-indexing'.green}] [#{'--debug'.green}] [#{'--env'.green} #{'production'.cyan}#{'|'.white}#{'test'.cyan}#{'|'.white}#{'development'.cyan}]\n"
		@header += "  theoricus #{'compile'.red}  [#{'--no-indexing'.green}] [#{'--force-indexing'.green}]\n"
		@header += "  theoricus #{'release'.red}  [#{'--no-indexing'.green}] [#{'--force-indexing'.green}]\n\n"

		@header += "#{'Options:'.bold}\n"
		@header += "             #{'new'.red}   Creates a new working project in the file system.\n"
		@header += "             #{'add'.red}   Generates a new model|view|controller file.\n"
		@header += "              #{'rm'.red}   Destroy some model|view|controller file.\n"
		@header += "           #{'start'.red}   Starts app in watch'n'compile mode at http://localhost:1123\n"
		@header += "         #{'compile'.red}   Compile app to release destination.\n"
		@header += "         #{'version'.red}   Show theoricus version.\n"
		@header += "            #{'help'.red}   Show this help screen.\n\n"

		@header += "#{'Flags:'.bold}\n"
		@header += "         #{'--debug'.green}   Use with 'start' to force debug mode in production or test environment   [default: false]\n"
		@header += "           #{'--env'.green}   Use with 'start' to set environment.                                     [default: dev  ]\n"
		@header += " #{'--skip-indexing'.green}   Use with 'start' or 'compile' to avoid static file's indexing.           [default: false]\n"
		@header += "#{'--force-indexing'.green}   Use with 'start' or 'compile' to force static file's indexing.           [default: false]\n\n"

		@header += "#{'Params:'.bold}\n"
		@header += "            #{'name'.magenta}   Name for your model, view and controller.\n"
		@header += "          #{'fields'.yellow}   Model fields, can be used   when add new models or 'all'.\n"
		@header += "         #{'options'.yellow}   Model fields, can be used   when add new models or 'all'.\n"

		options = process.argv.slice 2
		cmd = options.join( " " ).match /([a-z]+)/
		cmd = cmd[1] if cmd?

		if @pwd is null and cmd is not "help"
			console.log "#{'Error:'.bold} Not a Theoricus app.".red
			return

		switch cmd
			when "new" then new theoricus.commands.AddProject @, options
			when "add" then new theoricus.commands.Add @, options
			when "rm" then new theoricus.commands.Rm @, options
			when "start" then new theoricus.commands.Server @, options
			when "compile" then new theoricus.commands.Compiler @, options
			when "version" then console.log "vesion"
			else
				console.log @header

	_get_app_root:()->
		current = path.resolve "."

		while true
			app = path.normalize "#{current}/app/controllers/app_controller.coffee"

			unless path.existsSync app
				tmp = path.normalize path.resolve "#{current}/../"
				if current == tmp
					return null
				else
					current = tmp

			contents = fs.readFileSync app, "utf-8"
			return current if contents.indexOf( "theoricus.mvc.Controller" ) > 0
			return null