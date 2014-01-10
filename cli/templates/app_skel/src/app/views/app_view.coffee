View = require 'theoricus/mvc/view'

module.exports = class AppView extends View

	set_triggers: ->
		super()
		# automagically route links starting with "/"
		@el.find( 'a[href^="/"]' ).each ( index, item ) =>
			@make_internal_link item

	make_internal_link: (item) ->
		$( item ).click ( event ) =>
			@navigate $( event.delegateTarget ).attr('href')
			return off