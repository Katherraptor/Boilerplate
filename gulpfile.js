// Gulp Modules
var gulp = require('gulp'),
    less = require('gulp-less'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    newer = require('gulp-newer'),
    imageMin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    gulpif = require('gulp-if'),
    notify = require('gulp-notify');

// Gulp Paths -- set production to false for unminified CSS/JS
var production = true,
    cssTopFile = 'css/scss/site.scss',
    cssPartials = 'css/scss/*/**',
    cssDestination = 'css/',
    cssMapsDestination = 'maps',
    jsFiles = 'js/partials/*.js',
    jsDestination = 'js/',
    images = 'img/raw/**',
    imagesDestination = 'img/';

gulp.task('connect', function() {
  connect.server({
    root: './',
    livereload: true
  });
});

gulp.task('css', function() {
  gulp.src(cssTopFile)
  .pipe(plumber())
  .pipe(sourcemaps.init())
  .pipe(gulpif('*.scss', sass().on('error', sass.logError)))
  .pipe(gulpif('*.less', less()))
  .pipe(autoprefixer("last 3 versions"))
  .pipe(gulpif(production, rename({suffix: '.min'})))
  .pipe(gulpif(production, cssnano()))
  .pipe(sourcemaps.write(cssMapsDestination))
  .pipe(plumber.stop())
  .pipe(gulp.dest(cssDestination))
  .pipe(livereload());
});

gulp.task('scripts', function() {
  gulp.src(jsFiles)
  .pipe(jshint())
  .pipe(jshint.reporter(stylish))
  .pipe(plumber())
  .pipe(concat('all.js'))
  .pipe(gulpif(production, rename({suffix: '.min'})))
  .pipe(gulpif(production, uglify()))
  .pipe(gulp.dest(jsDestination))
  .pipe(livereload());
});

gulp.task('imageOptimize', function() {
  gulp.src(images)
  .pipe(newer(imagesDestination))
  .pipe(imageMin({
    optimizationLevel: 3,
    progressive: true,
    interlaced: true}))
  .pipe(gulp.dest(imagesDestination))
  .pipe(livereload());
});

gulp.task('html', function(){
  gulp.src('./*.html')
    .pipe(livereload());
});

gulp.task('watch:scripts', function() {
  gulp.watch(jsFiles, ['scripts']);
});

gulp.task('watch:images', function() {
  gulp.watch(images, ['imageOptimize']);
});

gulp.task('watch:html', function(){
  gulp.watch(['./*.html'], ['html'])
});

gulp.task('watch:css', ['css'], function(){
  livereload.listen();
  gulp.watch(cssPartials, ['css']);
});

gulp.task('default', ['watch:css', 'connect', 'watch:html', 'watch:scripts', 'watch:images']);
