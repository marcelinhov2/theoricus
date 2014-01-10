polvo = require 'polvo'

fork = (require 'child_process').fork

module.exports = class Index

  constructor:( @the, @cli )->
    options = compile: true, server: true, base: @the.app_root
    @polvo = polvo options, out:(msg)=>
      console.log msg
      if msg.stripColors.charAt(0) is '♫'
        @start_snapshooter()

    process.on 'exit', =>
      @polvo.close()
      @snapshooter.kill()

  start_snapshooter:->
    console.log 'Start indexing pages..'.magenta
    snapshooter_path = path.join @the.root, 'node_modules', 'snapshooter'
    snapshooter_path = path.join snapshooter_path, 'bin', 'snapshooter'

    output = if (o = @cli.argv.index is true) then 'public_indexed' else o
    url = @cli.argv.url ? 'localhost:' + polvo.read_config().server.port
    opts = [ '-i', url, '-o', output]

    if @cli.argv.snapshooter?
      opts = opts.concat [].concat (@cli.argv.snapshooter.split ' ')

    @snapshooter = fork snapshooter_path, opts, cwd: @the.app_root
    @snapshooter.on 'exit', -> process.exit()