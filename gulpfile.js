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
var projectURL              = 'qazana.test'; // Project URL. Could be something like localhost:8888.

// Translation related.
var text_domain             = 'qazana'; // Your textdomain here.
var destFile                = 'qazana-en_US.pot'; // Name of the transalation file.
var packageName             = 'qazana'; // Package name.
var bugReport               = 'https://radiumthemes.com/contact/'; // Where can users report bugs.
var lastTranslator          = 'Franklin Gitonga <frank@radiumthemes.com>'; // Last translator Email ID.
var team                    = 'RadiumThemes <frank@radiumthemes.com>'; // Team's Email ID.
var translatePath           = './languages' // Where to save the translation files.

// Style related.
var ExtenstioncssRC     = "./includes/extensions/**/*.scss"; // Path to extensions .scss file.

// Defualt set to root folder.

var projectPHPWatchFiles    = './**/*.php'; // Path to all PHP files.

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
var gulp = require("gulp"); // Gulp of-course

// CSS related plugins.
var sass = require("gulp-sass"); // Gulp pluign for Sass compilation.
var autoprefixer = require("gulp-autoprefixer"); // Autoprefixing magic.
var cleanCSS = require("gulp-clean-css"); // Minify CSS and merge combine matching media queries into one media query definition.

// Utility related plugins.
var rename = require("gulp-rename"); // Renames files E.g. style.css -> style.min.css
var lineec = require("gulp-line-ending-corrector"); // Consistent Line Endings for non UNIX systems. Gulp Plugin for Line Ending Corrector (A utility that makes sure your files have consistent line endings)
var filter = require("gulp-filter"); // Enables you to work on a subset of the original files by filtering them using globbing.
var sourcemaps = require("gulp-sourcemaps"); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)
var notify = require("gulp-notify"); // Sends message notification to you
var browserSync = require("browser-sync").create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.
var reload = browserSync.reload; // For manual browser reload.
var wpPot = require("gulp-wp-pot"); // For generating the .pot file.
var sort = require("gulp-sort"); // Recommended to prevent unnecessary changes in pot-file.

var gutil = require("gulp-util");

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

gulp.task("extensionscss", function() {
    return (gulp
        .src(ExtenstioncssRC, { base: "." })
        .pipe(
            sass({
                includePaths: [
                    "assets/dev/scss"
                ],
                errLogToConsole: true,
                outputStyle: "compressed",
                //outputStyle: 'compressed',
                // outputStyle: 'nested',
                // outputStyle: 'expanded',
                precision: 10
            })
        )
        .on("error", gutil.log)
        .pipe(sourcemaps.write({ includeContent: false }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe(sourcemaps.write("./"))
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest("./"))
        .pipe(filter("**/*.css")) // Filtering stream to only css files
        .pipe(
            cleanCSS({
                level: {
                    1: {
                        all: false // sets all default values to 'false'
                    },
                    2: {
                        all: false, // sets all default values to 'false'
                        mergeMedia: true // combine only media queries
                    }
                }
            })
        ) // Merge Media Queries only for .min.css version.
        .pipe(browserSync.stream()) // Reloads style.css if that is enqueued.
        .pipe(rename({ suffix: ".min" }))
        .pipe(
            cleanCSS({
                level: 2 // full minification
            })
        )
        .pipe(lineec()) // Consistent Line Endings for non UNIX systems.
        .pipe(gulp.dest("./"))
        .pipe(filter("**/*.css")) // Filtering stream to only css files
        .pipe(browserSync.stream()) ); // Reloads style.min.css if that is enqueued.
});

/**
 * Watch Tasks.
 *
 * Watches for file changes and runs specific tasks.
 */
gulp.task(
    "default",
    ["extensionscss", "browser-sync"],
    function() {
      gulp.watch(projectPHPWatchFiles, reload); // Reload on PHP file changes.
      gulp.watch(ExtenstioncssRC, ["extensionscss"]); // Reload on SCSS file changes.
    }
  );
  
  /**
   * Watch Tasks.
   *
   * Watches for file changes and runs specific tasks.
   */
  gulp.task("buildFrontend", ["browser-sync"], function() {
    gulp.watch(projectPHPWatchFiles, reload); // Reload on PHP file changes.
    gulp.watch(ExtenstioncssRC, ["extensionscss"]); // Reload on SCSS file changes.
  });
  
  gulp.task("css", ["extensionscss", "browser-sync"], function() {
    gulp.watch(ExtenstioncssRC, ["extensionscss"]); // Reload on SCSS file changes.
  });
  
  gulp.task(
    "bundleRelease",
    ["translate", "images", "buildFiles", "buildZip"],
    function() {}
  );

 /**
  * WP POT Translation File Generator.
  *
  * * This task does the following:
  *     1. Gets the source of all the PHP files
  *     2. Sort files in stream by path or any custom sort comparator
  *     3. Applies wpPot with the variable set at the top of this file
  *     4. Generate a .pot file of i18n that can be used for l10n to build .mo file
  */
 gulp.task( 'i18n', function () {
    return gulp.src( projectPHPWatchFiles )
        .pipe(sort())
        .pipe(wpPot( {
            domain        : text_domain,
            package       : packageName,
            bugReport     : bugReport,
            lastTranslator: lastTranslator,
            team          : team
        } ))
       .pipe(gulp.dest(translatePath + '/' + destFile ))
       .pipe( notify( { message: 'TASK: "translate" Completed! 💯', onLast: true } ) )

});
  
