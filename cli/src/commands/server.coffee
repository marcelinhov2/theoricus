class Server
	http = require "http"
	url = require "url"
	path = require "path"
	fs = require "fs"

	exec = require( "child_process" ).exec

	constructor:( @the, options )->
		@port = "11235"
		@root = "#{@the.pwd}/public"

		# console.log  "Server is born()"
		@compiler = new theoricus.commands.Compiler @the, options
		@start_server()

	start_server:()->
		@server = http.createServer( @_handler ).listen @port
		console.log "#{'Server running at'.bold} http://localhost:#{@port}".grey

	close_server:()->
		@server.close()


	_handler:(request, response)=>
		headers = request.headers
		agent = headers['user-agent']
		crawl = agent.indexOf( "Googlebot" ) >= 0 || agent.indexOf( "curl" ) >= 0

		uri = url.parse( request.url ).pathname
		filename = path.join( @root, uri )

		path.exists filename, (exists)=>

			if !exists || fs.lstatSync( filename ).isDirectory()

				filename = path.join( @root, "/index.html" )
				file = fs.readFileSync( filename , "utf-8")
				response.writeHead 200, {"Content-Type": "text/html"}

				if crawl is true
					script = "#{@the.root}/crawler/phantomjs.coffee"
					cmd = "phantomjs #{script} http://"+
							headers.host +
							request.url +
							"?crawler"

					exec cmd, (error, stdout, stderr)->
						throw error if error
						response.writeHead 200, {"Content-Type": "text/html"}
						response.write stdout
						response.end()
				else
					response.write file
					response.end()
				return

			fs.readFile filename, "utf-8", (err, file)->
				if err
					response.writeHead 500, {"Content-Type": "text/plain"}
					response.write err + "\n"
					response.end()
					return

				if filename.match /.js$/m
					response.writeHead 200, {"Content-Type": "text/javascript"}
				else if filename.match /.css$/m
					response.writeHead 200, {"Content-Type": "text/css"}

				response.write file
				response.end()