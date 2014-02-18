// include gulp
var gulp = require('gulp'); 
 
// include plug-ins
var jshint = require('gulp-jshint')
, changed = require('gulp-changed')
, imagemin = require('gulp-imagemin')
, uglify = require('gulp-uglify')
, minifyCSS = require('gulp-minify-css')
, compass = require('gulp-compass')
, livereload = require('gulp-livereload')
  plumber = require('gulp-plumber');


var paths = {
  scripts: './js/*.js',
  images: './images/**/*',
  sass: './scss/**/*'
};


// JS hint task
gulp.task('scripts', function() {
  gulp.src('./js/index.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// minify new images
gulp.task('images', function() {
  var imgSrc = './images/**/*',
      imgDst = './build/images';
  gulp.src(imgSrc)
    .pipe(changed(imgDst))
    .pipe(imagemin())
    .pipe(gulp.dest(imgDst));
});


// Styles
gulp.task('styles', function() {
  return gulp.src('./scss/**/*')
    .pipe(plumber())
    .pipe(compass({
        sass: './scss',
        css: './css'
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./css'))
    .pipe(livereload());
});


// Rerun the task when a file changes
gulp.task('watch', function () {
  var server = livereload();
  gulp.watch('*.html', function(evt) {
      server.changed(evt.path);
  });
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch(paths.sass, ['styles']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['scripts', 'images', 'styles', 'watch']);
