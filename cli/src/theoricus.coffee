fs = require "fs"
path = require "path"
colors = require 'colors'

require '../vendors/inflection'

Add = require './commands/add'
AddProject = require './commands/add_project'
Rm = require './commands/rm'
Server = require './commands/server'
StaticServer = require './commands/static_server'
Compiler = require './commands/compiler'
Index = require './commands/index'

exports.run = ->
  new Theoricus

module.exports = class Theoricus
  
  constructor:->
    @root = path.join __dirname, "../.."
    @app_root = @_get_app_root()
    @pwd = @app_root || path.resolve "."

    @version = (require "#{@root}/package.json" ).version
    cmds =  "#{'model'.cyan}#{'|'.white}#{'view'.cyan}#{'|'.white}" +
        "#{'controller'.cyan}#{'|'.white}#{'mvc'.cyan}"

    @header = "#{'Theoricus'.bold} " + "v#{@version}\nCoffeeScript MVC implementation for the browser + lazy navigation mechanism.\n\n".grey

    @header += "#{'Usage:'.bold}\n"
    @header += "  theoricus #{'new'.red}      #{'path'.green}\n"
    @header += "  theoricus #{'add'.red}      #{cmds} \n" #[#{'name'.magenta}] [#{'field1'.yellow}] [#{'field2'.yellow}]\n"
    @header += "  theoricus #{'rm'.red}       #{cmds} \n" #[#{'name'.magenta}]\n"
    @header += "  theoricus #{'start'.red}    #{'port'.green} default is #{'11235'.yellow}\n" #"[#{'port'.magenta}] [#{'--no-indexing'.green}] [#{'--force-indexing'.green}] [#{'--debug'.green}] [#{'--env'.green} #{'production'.cyan}#{'|'.white}#{'test'.cyan}#{'|'.white}#{'development'.cyan}]\n"
    @header += "  theoricus #{'compile'.red}  #{'port'.green} default is #{'http://localhost:11235'.yellow}\n" #[#{'--no-indexing'.green}] [#{'--force-indexing'.green}]\n"
    @header += "  theoricus #{'index'.red}    \n\n" #[#{'--no-indexing'.green}] [#{'--force-indexing'.green}]\n\n"
    # @header += "  theoricus #{'release'.red}  \n" #[#{'--no-indexing'.green}] [#{'--force-indexing'.green}]\n\n"

    @header += "#{'Options:'.bold}\n"
    @header += "             #{'new'.red}   Creates a new working project in the file system.\n"
    @header += "             #{'add'.red}   Generates a new model|view|controller file.\n"
    @header += "              #{'rm'.red}   Destroy some model|view|controller file.\n"
    @header += "           #{'start'.red}   Starts app in watch'n'compile mode at http://localhost:11235\n"
    @header += "         #{'compile'.red}   Compile app to release destination.\n"
    @header += "           #{'index'.red}   Index the whole application to a static non-js version.\n"
    @header += "         #{'version'.red}   Show theoricus version.\n"
    @header += "            #{'help'.red}   Show this help screen.\n"

    # @header += "#{'Flags:'.bold}\n"
    # @header += "         #{'--debug'.green}   Use with 'start' to force debug mode in production or test environment   [default: false]\n"
    # @header += "           #{'--env'.green}   Use with 'start' to set environment.                                     [default: dev  ]\n"
    # @header += " #{'--skip-indexing'.green}   Use with 'start' or 'compile' to avoid static file's indexing.           [default: false]\n"
    # @header += "#{'--force-indexing'.green}   Use with 'start' or 'compile' to force static file's indexing.           [default: false]\n\n"

    # @header += "#{'Params:'.bold}\n"
    # @header += "            #{'name'.magenta}   Name for your model, view and controller.\n"
    # @header += "          #{'fields'.yellow}   Model fields, can be used   when add new models or 'all'.\n"
    # @header += "         #{'options'.yellow}   Model fields, can be used   when add new models or 'all'.\n"

    options = process.argv.slice 2
    cmd = options.join( " " ).match /([a-z]+)/
    cmd = if cmd? then cmd[1] else 'help'
    

    if @app_root == null and cmd != "help" and cmd != "new"
      console.log "ERROR".bold.red + " Not a Theoricus app."
      return

    options.watch ?= false

    switch cmd
      when "new"     then new AddProject @, options
      when "add"     then new Add @, options
      when "rm"      then new Rm @, options
      when "start"   then new Server @, options
      when "static"  then new StaticServer @, options
      when "compile" then new Compiler @, options
      when "index"   then new Index @, options
      when "version"
        console.log @version
      else
        console.log @header

  _get_app_root:()->
    current = path.resolve "."

    while true
      app = path.normalize "#{current}/app/app_controller.coffee"

      if fs.existsSync app
        contents = fs.readFileSync app, "utf-8"
        if contents.indexOf( "theoricus.mvc.Controller" ) > 0
          return current
        else
          return null
      else
        tmp = path.normalize path.resolve("#{current}/../")
        if current == tmp
          return null
        else
          current = tmp
          continue