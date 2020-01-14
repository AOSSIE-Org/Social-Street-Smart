var gulp = require('gulp'),
  del = require('del'),
  rename = require('gulp-rename'),
  runSequence = require('run-sequence'),
  htmlmin = require('gulp-htmlmin'),
  minify = require('gulp-minify'),
  csso = require('gulp-csso'),
  eslint = require('gulp-eslint'),
  gulpIf = require('gulp-if')
  ;

gulp.task('default', function() {
  console.log('Please use the following gulp tasks: clean, build');
});

gulp.task('clean', function() {
  return del('./dist', {
    force: true
  });
});

gulp.task('pages', function() {
  return gulp.src(['./lib/views/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist/views'));
});

gulp.task('styles', function () {
  return gulp.src('./lib/styles/*.css')
    .pipe(csso())
    .pipe(gulp.dest('./dist/styles'));
});

gulp.task('esLint',()=>{
  gulp.src(['./lib/assets/js/*.js','./lib/scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', function(err) {
      console.log('Run \'gulp-fix\' in terminal to fix these errors'); 
      process.exit();
    });
});

function isFixed(file) {
  return file.eslint !== null && file.eslint.fixed;
}

gulp.task('fix', function () {
  return gulp.src(['./lib/assets/js/*.js','./lib/scripts/**/*.js'])
    .pipe(eslint({fix:true}))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest(function (file) {
      return file.base;
    })))
    .pipe(eslint.failAfterError());
});

gulp.task('minify', function () {
  return gulp.src('./lib/scripts/**/*.js')
    .pipe(minify({
      ext: {
        min: '.js'
      },
      noSource: true,
    }))
    .pipe(gulp.dest('./dist/scripts'));
});

gulp.task('copy-dist', function () {
  gulp.src('./lib/_locales/**/*').pipe(gulp.dest('./dist/_locales/'));
  gulp.src('./lib/common/*').pipe(gulp.dest('./dist/common/'));
  gulp.src('./lib/assets/**/*').pipe(gulp.dest('./dist/assets/'));
  return gulp.src('./lib/manifest.json').pipe(gulp.dest('./dist/'));
});

gulp.task('build', function() {
  runSequence('clean', 'pages', 'styles', 'esLint', 'minify', 'copy-dist');
});
