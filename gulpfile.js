import gulp from 'gulp';
import del from 'del';
import htmlmin from 'gulp-htmlmin';
import minify from 'gulp-minify';
import csso from 'gulp-csso';
import eslint from 'gulp-eslint';
import gulpIf from 'gulp-if';


const clean = () => {
  return del('./dist', { force: true });
};

const pages = () => {
  return gulp.src(['./lib/views/*.html'])
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true
    }))
    .pipe(gulp.dest('./dist/views'));
};

const styles = () => {
  return gulp.src('./lib/styles/*.css')
    .pipe(csso())
    .pipe(gulp.dest('./dist/styles'));
};

const esLint = () => {
  return gulp.src(['./lib/assets/js/*.js', './lib/scripts/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
    .on('error', function (err) {
      console.log('Run \'gulp -- fix\' in terminal to fix these errors');
      process.exit();
    });
};

const fix = () => {
  return gulp.src(['./lib/assets/js/*.js', './lib/scripts/**/*.js'])
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(gulpIf(isFixed, gulp.dest(function (file) {
      return file.base;
    })))
    .pipe(eslint.failAfterError());
};

const minifyScripts = () => {
  return gulp.src('./lib/scripts/**/*.js')
    .pipe(minify({
      ext: {
        min: '.js'
      },
      noSource: true,
    }))
    .pipe(gulp.dest('./dist/scripts'));
};

const copyDist = () => {
  gulp.src('./lib/_locales/**/*').pipe(gulp.dest('./dist/_locales/'));
  gulp.src('./lib/common/*').pipe(gulp.dest('./dist/common/'));
  gulp.src('./lib/assets/**/*').pipe(gulp.dest('./dist/assets/'));
  gulp.src('./lib/scripts/content/dii/**/*').pipe(gulp.dest('./dist/scripts/content/dii/'));
  return gulp.src('./lib/manifest.json').pipe(gulp.dest('./dist/'));
};


const defaultTask = (done) => {
  console.log('Please use the following gulp tasks: clean, build');
  done();
};


function isFixed(file) {
  return file.eslint !== null && file.eslint.fixed;
}


const buildTask = gulp.series(
  clean,
  gulp.parallel(pages, styles),
  esLint,
  gulp.parallel(minifyScripts, copyDist)
);


export {
  defaultTask as default,
  clean,
  pages,
  styles,
  esLint,
  fix,
  minifyScripts,
  copyDist,
  buildTask as build
};
