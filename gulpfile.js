var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  htmlmin = require('gulp-htmlmin'),
  minify = require('gulp-minify'),
  csso = require('gulp-csso'),
  eslint = require('gulp-eslint'),
  gulpIf = require('gulp-if');

function defaultTask(done) {
  console.log('Please use the following gulp tasks: clean, build');
  done();
}

function clean() {
  return del('./dist', {
    force: true
  });
}

function pages() {
  return gulp.src(['./lib/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist'));
}

function styles() {
  return gulp.src('./lib/styles/*.css')
    .pipe(csso())
    .pipe(gulp.dest('./dist/styles'));
}

function esLint() {
  return gulp.src(['./lib/assets/js/*.js','./lib/scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', function(err) {
      console.log('Run \'gulp-fix\' in terminal to fix these errors'); 
      process.exit(1);
    });
}

function isFixed(file) {
  return file.eslint !== null && file.eslint.fixed;
}

function fix() {
  return gulp.src(['./lib/assets/js/*.js','./lib/scripts/**/*.js'])
    .pipe(eslint({fix:true}))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest(function (file) {
      return file.base;
    })))
    .pipe(eslint.failAfterError());
}

function minifyFiles() {
  return gulp.src('./lib/*.js')
    .pipe(minify({
      ext: {
        min: '.js'
      },
      noSource: true,
    }))
    .pipe(gulp.dest('./dist'));
}

function copyDist() {
  gulp.src('./lib/_locales/**/*').pipe(gulp.dest('./dist/_locales/'));
  gulp.src('./lib/assets/**/*').pipe(gulp.dest('./dist/assets/'));
  return gulp.src('./lib/manifest.json').pipe(gulp.dest('./dist/'));
}

const build = gulp.series(clean, gulp.parallel(pages, styles, esLint, minifyFiles, copyDist));

exports.default = defaultTask;
exports.clean = clean;
exports.pages = pages;
exports.styles = styles;
exports.esLint = esLint;
exports.fix = fix;
exports.minifyFiles = minifyFiles;
exports.copyDist = copyDist;
exports.build = build;
