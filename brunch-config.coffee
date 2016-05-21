exports.config =
# See http://brunch.io/#documentation for docs.

#Brunch will ignore files starting with an underscore by default.
#But if you don't want to use that convention for your tests, then you can
#uncomment the below.
#conventions: ignored: /.+\.spec\.js/
  modules:
    definition: false
    wrapper: false

#Only need to explicitly set the hint pattern if using auto-reload
  plugins:
    jshint:
      pattern: /^app\/.*\.js$/
  npm:
    enabled: false
  files:
    javascripts:
      joinTo:
        'javascript/app.js': /^app/
        'javascript/vendor.js': [
          /^vendor/

          # external libs
          #'bower_components/modernizr/modernizr.js'
          'bower_components/lodash/lodash.js'
          'bower_components/bootstrap/dist/js/bootstrap.js'
          'bower_components/jquery/dist/jquery.js'
          'bower_components/tether/dist/js/tether.js'

          # angular
          'bower_components/angular/angular.js'
          'bower_components/angular-cookies/angular-cookies.js'
          'bower_components/angular-animate/angular-animate.js'
          'bower_components/angular-sanitize/angular-sanitize.js'
          'bower_components/angular-messages/angular-messages.js'
          'bower_components/angular-aria/angular-aria.js'
          'bower_components/angular-material/angular-material.js'
          'bower_components/ui-router/release/angular-ui-router.js'
        ]
      order:
        before: [
          # jquery
          'bower_components/jquery/dist/jquery.js'

          # angular
          'bower_components/angular/angular.js'

          # tether
          'bower_components/tether/dist/js/tether.js'

          # bootstrap
          'bower_components/bootstrap/dist/js/bootstrap.js'

          'app/**/*.module.js'
        ]
    stylesheets:
#      defaultExtension: 'scss'
      joinTo:
        'stylesheets/app.css': /^app/
        'stylesheets/vendor.css': [
          'bower_components/bootstrap/scss/bootstrap.scss'
          'bower_components/angular-material/angular-material.css'
        ]
    templates:
      joinTo: 'javascript/templates.js'

  sourceMaps: false