/**
 * Gulpfile.
 *
 * Gulp with WordPress.
 *
 * Implements:
 *      1. Live reloads browser with BrowserSync.
 *      2. CSS: Sass to CSS conversion, error catching, Autoprefixing, Sourcemaps,
 *         CSS minification, and Merge Media Queries.
 *      3. JS: Concatenates & uglifies Vendor and Custom JS files.
 *      4. Images: Minifies PNG, JPEG, GIF and SVG images.
 *      5. Watches files for changes in CSS or JS.
 *      6. Watches files for changes in PHP.
 *      7. Corrects the line endings.
 *      8. InjectCSS instead of browser page reload.
 *      9. Generates .pot file for i18n and l10n.
 *
 * @author Franklin Gitonga
 * @version 1.0.0
 */

/**
 * Configuration.
 *
 * Project Configuration for gulp tasks.
 *
 * In paths you can add <<glob or array of globs>>. Edit the variables as per your project requirements.
 */

// Project related.
var project                 = 'builder'; // Project Name.
var projectURL              = 'builder.dev'; // Project URL. Could be something like localhost:8888.
var productURL              = './'; // Theme/Plugin URL. Leave it like it is, since our gulpfile.js lives in the root folder.

// Translation related.
var text_domain             = 'builder'; // Your textdomain here.
var destFile                = 'builder.pot'; // Name of the transalation file.
var packageName             = 'builder'; // Package name.
var bugReport               = 'https://radiumthemes.com/contact/'; // Where can users report bugs.
var lastTranslator          = 'Franklin Gitonga <frank@radiumthemes.com>'; // Last translator Email ID.
var team                    = 'RadiumThemes <frank@radiumthemes.com>'; // Team's Email ID.
var translatePath           = './languages' // Where to save the translation files.

// Style related.
var CssRC               = './assets/dev/scss/**/*.scss'; // Path to main .scss file.
var StyleDestination    = './assets/css'; // Path to place the compiled CSS file.
// Defualt set to root folder.

// Images related.
var imagesSRC               = './assets/images/raw/**/*.{png,jpg,gif,svg}'; // Source folder of images which should be optimized.
var imagesDestination       = './assets/images/'; // Destination folder of optimized images. Must be different from the imagesSRC folder.

// Watch files paths.
var JSWatchFiles    = './assets/dev/js/**/*.js'; // Path to all vendor JS files.

var projectPHPWatchFiles    = './**/*.php'; // Path to all PHP files.

var build 			= './build/'; // Files that you want to package into a zip go here
var buildInclude 	= [
                    // include common file types
                    '**/*.php',
                    '**/*.html',
                    '**/*.css',
                    '**/*.js',
                    '**/*.svg',
                    '**/*.ttf',
                    '**/*.otf',
                    '**/*.eot',
                    '**/*.woff',
                    '**/*.woff2',

                    // include specific files and folders
                    'screenshot.png',

                    // exclude files and folders
                    '!node_modules/**/*',
                    '!bower_components/**/*',
                    '!style.css.map',
                    '!assets/dev/js/*',
                    '!assets/dev/scss/*'
                ];


// Browsers you care about for autoprefixing.
// Browserlist https        ://github.com/ai/browserslist
const AUTOPREFIXER_BROWSERS = [
    'last 2 version',
    '> 1%',
    'ie >= 9',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4',
    'bb >= 10'
  ];

// STOP Editing Project Variables.

/**
 * Load Plugins.
 *
 * Load gulp plugins and assing them semantic names.
 */
var gulp         = require('gulp'); // Gulp of-course

// CSS related plugins.
var scss         = require('gulp-scss'); // Gulp pluign for Sass compilation.
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files.
var autoprefixer = require('gulp-autoprefixer'); // Autoprefixing magic.
var cmq          = require('gulp-combine-media-queries');

// JS related plugins.
var jshint       = require('gulp-jshint');
var concat       = require('gulp-concat'); // Concatenates JS files
var uglify       = require('gulp-uglify'); // Minifies JS files

// Image realted plugins.
var imagemin     = require('gulp-imagemin'); // Minify PNG, JPEG, GIF and SVG images with imagemin.

// Utility related plugins.
var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var lineec       = require('gulp-line-ending-corrector'); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter       = require('gulp-filter'); // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify       = require('gulp-notify'); // Sends message notification to you
var browserSync  = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload       = browserSync.reload; // For manual browser reload.
var wpPot        = require('gulp-wp-pot'); // For generating the .pot file.
var sort         = require('gulp-sort'); // Recommended to prevent unnecessary changes in pot-file.

var zip          = require('gulp-zip'); // Using to zip up our packaged theme into a tasty zip file that can be installed in WordPress!
var ignore       = require('gulp-ignore'); // Helps with ignoring files and directories in our run tasks
var rimraf       = require('gulp-rimraf'); // Helps with removing files and directories in our run tasks
var cache        = require('gulp-cache');
var browserify   = require('gulp-browserify');

function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}

/**
 * Task: `browser-sync`.
 *
 * Live Reloads, CSS injections, Localhost tunneling.
 *
 * This task does the following:
 *    1. Sets the project URL
 *    2. Sets inject CSS
 *    3. You may define a custom port
 *    4. You may want to stop the browser from openning automatically
 */
gulp.task( 'browser-sync', function() {
  browserSync.init( {

    // For more options
    // @link http://www.browsersync.io/docs/options/

    // Project URL.
    proxy: projectURL,

    // `true` Automatically open the browser with BrowserSync live server.
    // `false` Stop the browser from automatically opening.
    open: true,

    // Inject CSS changes.
    // Commnet it to reload browser for every CSS change.
    injectChanges: true,

    // Use a specific port (instead of the one auto-detected by Browsersync).
    // port: 7000,

  } );
});

/**
 * Task: `CSS`.
 *
 * Compiles Sass, Autoprefixes it and Minifies CSS.
 *
 * This task does the following:
 *    1. Gets the source scss file
 *    2. Compiles Sass to CSS
 *    3. Writes Sourcemaps for it
 *    4. Autoprefixes it and generates style.css
 *    5. Renames the CSS file with suffix .min.css
 *    6. Minifies the CSS file and generates style.min.css
 *    7. Injects CSS or reloads the browser via browserSync
 */
 gulp.task('CSS', function () {
    gulp.src( CssRC )
    .pipe( sourcemaps.init() )
    .pipe( scss( {
      errLogToConsole: true,
      outputStyle: 'compressed',
      //outputStyle: 'compressed',
      // outputStyle: 'nested',
      // outputStyle: 'expanded',
      precision: 10
    } ) )
    .on('error', handleError)
    .pipe( sourcemaps.write( { includeContent: false } ) )
    .pipe( sourcemaps.init( { loadMaps: true } ) )
    .pipe( autoprefixer( AUTOPREFIXER_BROWSERS ) )

    .pipe( sourcemaps.write ( StyleDestination ) )
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( StyleDestination ) )

    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    //.pipe(cmq()) // Combines Media Queries

    .pipe( browserSync.stream() ) // Reloads style.css if that is enqueued.

    .pipe( rename( { suffix: '.min' } ) )
    .pipe( minifycss( {
      maxLineLen: 10
    }))
    .pipe( lineec() ) // Consistent Line Endings for non UNIX systems.
    .pipe( gulp.dest( StyleDestination ) )

    .pipe( filter( '**/*.css' ) ) // Filtering stream to only css files
    .pipe( browserSync.stream() )// Reloads style.min.css if that is enqueued.
    .pipe( notify( { message: 'TASK: "CSS" Completed! 💯', onLast: true } ) )
 });

 gulp.task( 'lintJs', function() {
    gulp.src( ['./assets/dev/js/custom/**/*.js'] )
     .pipe( jshint() )
     .pipe(jshint.reporter('default'));
 });

 /**
  * Task: `vendorJS`.
  *
  * Concatenate and uglify vendor JS scripts.
  *
  * This task does the following:
  *     1. Gets the source folder for JS vendor files
  *     2. Concatenates all the files and generates vendors.js
  *     3. Renames the JS file with suffix .min.js
  *     4. Uglifes/Minifies the JS file and generates vendors.min.js
  */
 gulp.task( 'vendorsJs', function() {

    // js
    gulp.src('./bower_components/imagesloaded/imagesloaded.pkgd.min.js').pipe( gulp.dest('./assets/vendor/js') );
    gulp.src('./bower_components/jquery.easing/js/jquery.easing.min.js').pipe( gulp.dest('./assets/vendor/js') );
    gulp.src('./bower_components/jquery-waypoints/lib/jquery.waypoints.js').pipe( gulp.dest('./assets/vendor/js') );
    gulp.src('./bower_components/jquery-waypoints/lib/shortcuts/inview.js').pipe( gulp.dest('./assets/vendor/js') );
    gulp.src('./bower_components/jquery-waypoints/lib/shortcuts/sticky.js').pipe( gulp.dest('./assets/vendor/js') );
    gulp.src('./bower_components/jquery-hoverIntent/jquery.hoverIntent.js').pipe( gulp.dest('./assets/vendor/js') );
        basename: "jquery.scrollto",
        suffix: '.min'
    }));
    gulp.src('./bower_components/slick-carousel/slick/slick.min.js').pipe( gulp.dest('./assets/vendor/js') );
    gulp.src('./bower_components/select2/dist/js/select2.js').pipe( gulp.dest('./assets/vendor/js') );

});

/**
 * Task: Scripts
 *
 * Look at src/js and concatenate those files, send them to assets/js where we then minimize the concatenated file.
*/
gulp.task('Scripts', function() {

    // Basic usage
    // Single entry point to browserify
    gulp.src('./assets/extensions/ext-frontend.js')
        .pipe( browserify({
          insertGlobals : true,
          debug : true
      })
    ).pipe(gulp.dest('./assets/js/'));

    gulp.src('./assets/extensions/ext-editor.js')
        .pipe( browserify({
          insertGlobals : true,
          debug : true
      })
    ).pipe(gulp.dest('./assets/js/'));

    gulp.src('./assets/extensions/ext-admin.js')
        .pipe( browserify({
          insertGlobals : true,
          debug : true
      })
    ).pipe(gulp.dest('./assets/admin/js/'));

    return gulp.src('./assets/js/custom/**/*.js')
            .pipe( concat('main.js').on("error", handleError) )
            .pipe(gulp.dest('./assets/frontend/js'))
            .pipe(rename( {
                basename: "main",
                suffix: '.min'
            }))
            .pipe(uglify())
            .pipe(gulp.dest('./assets/js/'))
            .pipe(notify({ message: 'TASK: "Scripts" Completed! 💯', onLast: true }));
});

 /**
  * Task: `images`.
  *
  * Minifies PNG, JPEG, GIF and SVG images.
  *
  * This task does the following:
  *     1. Gets the source of images raw folder
  *     2. Minifies PNG, JPEG, GIF and SVG images
  *     3. Generates and saves the optimized images
  *
  * This task will run only once, if you want to run it
  * again, do it with the command `gulp images`.
  */
 gulp.task( 'images', function() {
  gulp.src( imagesSRC )
    .pipe( imagemin( {
          progressive: true,
          optimizationLevel: 3, // 0-7 low-high
          interlaced: true,
          svgoPlugins: [{removeViewBox: false}]
        } ) )
    .pipe(gulp.dest( imagesDestination ))
    .pipe( notify( { message: 'TASK: "images" Completed! 💯', onLast: true } ) );
 });


 /**
  * WP POT Translation File Generator.
  *
  * * This task does the following:
  *     1. Gets the source of all the PHP files
  *     2. Sort files in stream by path or any custom sort comparator
  *     3. Applies wpPot with the variable set at the top of this file
  *     4. Generate a .pot file of i18n that can be used for l10n to build .mo file
  */
 gulp.task( 'translate', function () {
     return gulp.src( projectPHPWatchFiles )
         .pipe(sort())
         .pipe(wpPot( {
             domain        : text_domain,
             destFile      : destFile,
             package       : packageName,
             bugReport     : bugReport,
             lastTranslator: lastTranslator,
             team          : team
         } ))
        .pipe(gulp.dest(translatePath))
        .pipe( notify( { message: 'TASK: "translate" Completed! 💯', onLast: true } ) )

 });


/**
 * Clean gulp cache
*/
gulp.task('clear', function () {
    cache.clearAll();
});

/**
* Clean tasks for zip
*
* Being a little overzealous, but we're cleaning out the build folder, codekit-cache directory and annoying DS_Store files and Also
* clearing out unoptimized image files in zip as those will have been moved and optimized
*/
gulp.task('cleanup', function() {
    return 	gulp.src(['./bower_components', '**/.scss-cache','**/.DS_Store'], { read: false }) // much faster
              .pipe(ignore('node_modules/**')) //Example of a directory to ignore
              .pipe(rimraf({ force: true }))
              .pipe(notify({ message: 'Clean task complete', onLast: true }));
});

gulp.task('cleanupFinal', function() {
    return 	gulp.src(['./bower_components','**/.scss-cache','**/.DS_Store'], { read: false }) // much faster
              .pipe(ignore('node_modules/**')) //Example of a directory to ignore
              .pipe(rimraf({ force: true }))
              .pipe(notify({ message: 'Clean task complete', onLast: true }));
});

/**
 * Build task that moves essential theme files for production-ready sites
 *
 * buildFiles copies all the files in buildInclude to build folder - check variable values at the top
 * buildImages copies all the images from img folder in assets while ignoring images inside raw folder if any
 */
gulp.task('buildFiles', function() {
    return 	gulp.src(buildInclude)
        .pipe(gulp.dest(build))
            .pipe(notify({ message: 'Copy from "buildFiles" Completed! 💯', onLast: true }));
});

/**
 * Zipping build directory for distribution
 *
 * Taking the build folder, which has been cleaned, containing optimized files and zipping it up to send out as an installable theme
*/
gulp.task('buildZip', function () {
   // return 	gulp.src([build+'/**/', './.jshintrc','./.bowerrc','./.gitignore' ])
   return 	gulp.src(build+'/**/')
               .pipe(zip(project+'.zip'))
               .pipe(gulp.dest('./'))
               .pipe(notify({ message: 'Zip task completed! 💯', onLast: true }));
});

 /**
  * Watch Tasks.
  *
  * Watches for file changes and runs specific tasks.
  */
gulp.task( 'default', [ 'Scripts', 'browser-sync'], function () {
    gulp.watch( projectPHPWatchFiles, reload ); // Reload on PHP file changes.
    gulp.watch( CssRC, [ 'CSS'  ] ); // Reload on SCSS file changes.
    gulp.watch( JSWatchFiles, [ 'Scripts' ] ); // Reload on vendorsJs file changes.
 });

 gulp.task( 'bundleRelease', [ 'translate', 'buildFiles', 'buildZip' ], function () {
 });
