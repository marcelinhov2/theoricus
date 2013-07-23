should = do (require 'chai').should
colors = require 'colors'

{page_is_rendered} = require '../../utils/conditions'
quit = require '../../utils/quit'

exports.test = ( browser, browser_conf, base_url, timeout, mark_as_passed )->

  describe 'testing title', ->

    before (done)->
      browser.init browser_conf, (err)->
        should.not.exist err
        browser.get base_url, (err)->
          should.not.exist err
          do done

    after (done)->
      quit browser, mark_as_passed, done

    describe 'using ' + browser_conf.name, ->

      # ------------------------------------------------------------------------
      # menu
      describe 'menu must to exist', ->
        it 'wait until menu is visible', (done)->
          browser.waitForElementByClassName 'menu', timeout, (err)->
            should.not.exist err
            browser.elementByClassName 'menu', (err, el)->
              should.not.exist err
              should.exist el
              do done

      # ------------------------------------------------------------------------
      # /title/theoricus
      describe 'link /title/theoricus', ->

        it 'click /title/theoricus link and check if redirect begun', (done)->
          browser.elementById 'title-theoricus', (err, el)->
            should.not.exist err
            el.click (err)->
              should.not.exist err
              browser.eval 'window.location.pathname', (err, pathname)->
                should.not.exist err
                should.exist pathname
                pathname.should.equal '/title/theoricus'
                do done

        it 'wait until page is rendered', (done)->
          browser.waitForCondition page_is_rendered, timeout, 30, (err, res)->
            should.not.exist err
            res.should.be.true
            do done

        it 'check if title is `Theoricus`', (done)->
          browser.title (err, title)->
            should.not.exist err
            should.exist title
            title.should.equal 'Theoricus'
            do done

      # ------------------------------------------------------------------------
      # /title/is
      describe 'link /title/is', ->
        it 'click /title/theoricus link and check if redirect begun', (done)->
          browser.elementById 'title-is', (err, el)->
            should.not.exist err
            el.click (err)->
              should.not.exist err
              browser.eval 'window.location.pathname', (err, pathname)->
                should.not.exist err
                should.exist pathname
                pathname.should.equal '/title/is'
                do done

        it 'wait until page is rendered', (done)->
          browser.waitForCondition page_is_rendered, timeout, 30, (err, res)->
            should.not.exist err
            res.should.be.true
            do done

        it 'check if title is `Theoricus`', (done)->
          browser.title (err, title)->
            should.not.exist err
            should.exist title
            title.should.equal 'Theoricus is'
            do done

      # ------------------------------------------------------------------------
      # /title/awesome
      describe 'link /title/awesome', ->
        it 'click /title/theoricus link and check if redirect begun', (done)->
          browser.elementById 'title-awesome', (err, el)->
            browser.clickElement el, ->
              browser.eval 'window.location.pathname', (err, pathname)->
                should.not.exist err
                should.exist pathname
                pathname.should.equal '/title/awesome'
                do done

        it 'wait until page is rendered', (done)->
          browser.waitForCondition page_is_rendered, timeout, 30, (err, res)->
            should.not.exist err
            res.should.be.true
            do done

        it 'check if title is `Theoricus`', (done)->
          browser.title (err, title)->
            should.not.exist err
            should.exist title
            title.should.equal 'Theoricus is awesome'
            quit browser, mark_as_passed, done