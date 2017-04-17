// Gulp Modules
var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    eslint = require('gulp-eslint'),
    babel = require('gulp-babel'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    beautify = require('gulp-beautify'),
    rename = require('gulp-rename'),
    newer = require('gulp-newer'),
    imageMin = require('gulp-imagemin'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    gulpif = require('gulp-if'),
    gutil = require('gulp-util'),
    beep = require('beepbeep'),
    notify = require('gulp-notify'),
    connectSSI = require('connect-ssi'),
    bower = require('gulp-bower');

var paths = {
    //  Point cssSrc to the top file for your Less or Sass
    cssSrc: 'css/scss/site.scss',
    // Point cssParts to the partial files called from your topfile
    cssParts: 'css/scss/*/**',
    js: 'js/src/*.js',
    images: 'img/src/**',
    imagesDist: 'img/dist/*.*',
    html: './*.html',
    shtml: './*.shtml',
    root: './',
},
  dests = {
      css: 'css/',
      cssMaps: 'maps',
      js: 'js/dist/',
      images: 'img/dist/',
      bowerDir: './bower_components'
  },
  options = {
    // set production to false for unminified CSS/JS
    production: false,
    // Set to false to prevent Babel from running, please see package.json for eslint config changes when removing es6 support
    es6: true,
    autoprefix: 'last 3 versions',
    imagemin: { optimizationLevel: 3, progressive: true, interlaced: true},
    uglify: { mangle: false },
    beautify: { indent_size: 4, indent_char: " " }
};

var onError = function(err) {
  var displayErr = gutil.colors.red(err.message);
  beep([0, 0, 0]);
  notify().write(err.message);
  gutil.log(displayErr);
  this.emit('end');
};

gulp.task('bower', function() {
  return bower().pipe(gulp.dest(dests.bowerDir));
});

gulp.task('connect', function() {
  connect.server({
    root: paths.root,
    middleware: function() {
      return [
      require('connect-livereload')(),
      connectSSI({
        baseDir: __dirname
      })
      ];
    },
  });
});

gulp.task('css', function() {
  gulp.src(paths.cssSrc)
  .pipe(plumber({ errorHandler: onError }))
  .pipe(sourcemaps.init())
  .pipe(gulpif('*.scss', sass()))
  .pipe(gulpif('*.less', less()))
  .pipe(autoprefixer(options.autoprefix))
  .pipe(gulpif(options.production, rename({suffix: '.min'})))
  .pipe(gulpif(options.production, cssnano()))
  .pipe(sourcemaps.write(dests.cssMaps))
  .pipe(plumber.stop())
  .pipe(gulp.dest(dests.css))
  .pipe(connect.reload());
});

gulp.task('lint', function() {
  gulp.src(paths.js)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('scripts', ['lint'], function() {
  gulp.src(paths.js)
  .pipe(plumber({ errorHandler: onError }))
  .pipe(gulpif(options["es6"], babel({
      presets: ['es2015']
    })))
  .pipe(concat('all.js'))
  .pipe(gulpif(options.production, rename({suffix: '.min'})))
  .pipe(gulpif(options.production, uglify( options.uglify ), beautify( options.beautify )))
  .pipe(gulp.dest(dests.js))
  .pipe(connect.reload());
});

gulp.task('imageOptimize', function() {
  gulp.src(paths.images)
  .pipe(plumber({ errorHandler: onError }))
  .pipe(newer(dests.images))
  .pipe(imageMin(options.imagemin))
  .pipe(gulp.dest(dests.images));
});

gulp.task('imageReload', ['imageOptimize'], function() {
  gulp.src(paths.imagesDist)
  .pipe(connect.reload());
});

gulp.task('html', function(){
  gulp.src([paths.html, paths.shtml])
    .pipe(connect.reload());
});

gulp.task('shtml', function() {
  gulp.src(paths.shtml).pipe(connect.reload());
});

gulp.task('watch:scripts', function() {
  gulp.watch(paths.js, ['scripts']);
});

gulp.task('watch:images', function() {
  gulp.watch(paths.images, ['imageReload']);
});

gulp.task('watch:html', function(){
  gulp.watch([paths.html, paths.shtml], ['html'])
});

gulp.task('watch:shtml', function() {
  gulp.watch(paths.shtml, ['shtml']);
});

gulp.task('watch:css', ['css'], function(){
  gulp.watch(paths.cssParts, ['css']);
});

gulp.task('default', ['bower', 'watch:css', 'connect', 'watch:html', 'watch:shtml', 'watch:scripts', 'watch:images']);
