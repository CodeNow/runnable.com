var gulp = require('gulp');
var runSequence = require('run-sequence'); // sequence of tasks
var debug = require('gulp-debug'); // debug
var del = require('del'); // delete dist
var newer = require('gulp-newer'); // checks for file changes
var fileinclude = require('gulp-file-include'); // html
var sass = require('gulp-sass'); // sass
var autoprefixer = require('gulp-autoprefixer'); // autoprefixer
var imagemin = require('gulp-imagemin'); // image optimizer
var ghPages = require('gulp-gh-pages'); // deploy to gh pages

// file locations
var src = 'src/';
var htmlDir = src + 'html/**/*.html';
var htmlSrc = src + 'html/index.html';
var sassDir = src +'styles/**/*.scss';
var sassSrc = src + 'styles/index.scss';
var imgDir = src + 'images/**/*.+(png|jpg|gif|svg)';

var dist = './dist/';
var htmlDist = dist;
var sassDist = dist + 'styles/';
var imgDist = dist + 'images/';

// delete dist
gulp.task('clean', function() {
  return del.sync('dist');
});

// html files
gulp.task('fileinclude', function() {
  gulp.src([htmlSrc])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(gulp.dest(htmlDist));
});

// sass
gulp.task('sass', function() {
  gulp.src(sassSrc)
    .pipe(sass({
        errLogToConsole: true
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(autoprefixer({
        browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(sassDist));
});

// images
gulp.task('imagemin', function () {
  return gulp.src(imgDir)
    .pipe(newer(imgDist))
    .pipe(imagemin({
        svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(debug({
      title: 'imagemin'
    }))
    .pipe(gulp.dest(imgDist));
});

// gh pages
gulp.task('deploy', function() {
  return gulp.src(dist + '**/*')
    .pipe(ghPages());
});

// watches by default
gulp.task('default', function(cb) {
  runSequence('clean', ['fileinclude', 'sass', 'imagemin'], cb);
  gulp.watch(htmlDir, ['fileinclude']);
  gulp.watch(sassDir, ['sass']);
  gulp.watch(imgDir, ['imagemin']);
});
