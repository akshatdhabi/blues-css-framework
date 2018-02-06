/*jshint esversion: 6 */
const gulp = require('gulp');
const browsersync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const postcss = require('gulp-postcss');
const mediaq = require("css-mqpacker");
const cssnano = require('gulp-cssnano');

//Image min task
gulp.task('imagemin', function() {
  gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
});
// Compile sass
gulp.task('sass', function() {
  return gulp.src(['src/scss/*.scss'])
    //Throw error
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('src/css'))
    .pipe(browsersync.stream());
});
//prefix css
// pack media queries and pipe to dist
gulp.task('css', function() {
  var plugins = [
    mediaq()
  ];
  return gulp.src('src/css/*.css')
    .pipe(autoprefixer({
      browsers: ['last 5 version']
    }))
    .pipe(postcss(plugins))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'));
});

//Minify and concat javascript
gulp.task('concat', function() {
  gulp.src('src/scripts/*.js')
    .pipe(uglify())
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
});
//copy HTML and Fonts to dist folder
gulp.task('copy', function() {
  gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
  gulp.src('src/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

//Serve
gulp.task('serve', ['sass'], function() {
  browsersync.init({
    server: './dist'
  });
  gulp.watch('src/scripts/*.js', ['concat']);
  gulp.watch('src/scss/*.scss', ['sass']);
  gulp.watch('src/css/*.css', ['css']);
  gulp.watch('src/images/*', ['imagemin']);
  gulp.watch('src/*.html', ['copy']);
  gulp.watch('src/fonts/*', ['copy']);
  gulp.watch(['dist/*.html']).on('change', browsersync.reload);
  gulp.watch(['dist/images/*']).on('change', browsersync.reload);
  gulp.watch(['dist/js/*.js']).on('change', browsersync.reload);
  gulp.watch(['dist/css/*.css']).on('change', browsersync.reload);

});

//Default tast for gulp
gulp.task('default', ['sass', 'css', 'imagemin', 'concat', 'copy', 'serve']);