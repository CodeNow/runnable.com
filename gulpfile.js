var gulp = require('gulp');
var runSequence = require('run-sequence'); // sequence of tasks
var debug = require('gulp-debug'); // debug
var del = require('del'); // delete dist
var newer = require('gulp-newer'); // checks for file changes
var fileinclude = require('gulp-file-include'); // html
var sass = require('gulp-sass'); // sass
var autoprefixer = require('gulp-autoprefixer'); // autoprefixer
var uglify = require('gulp-uglify'); // uglify
var imagemin = require('gulp-imagemin'); // image optimizer
var ghPages = require('gulp-gh-pages'); // deploy to gh pages
var handlebars = require('gulp-compile-handlebars'); // handlebars
var rename = require('gulp-rename'); // rename files

// file locations
var src = 'src/';
var dist = './dist/';

var htmlDir = src + 'html/**/*.hbs';
var htmlSrc = src + 'html/index.hbs';
var sassDir = src +'styles/**/*.scss';
var sassSrc = src + 'styles/index.scss';
var jsDir = src + 'js/**/*.**';
var imgDir = src + 'images/**/*.+(png|jpg|gif|svg)';
var favIconSrc = src + 'html/favicon.png';

var htmlDist = dist;
var hbsDist = dist + 'handlebars/';
var hbsSrc = hbsDist + '/*';
var sassDist = dist + 'styles/';
var jsDist = dist + 'js/';
var imgDist = dist + 'images/';
var favIconDist = dist;

// delete dist
gulp.task('clean', function() {
  return del.sync('dist');
});

// html files
gulp.task('fileinclude', function() {
  return gulp.src([htmlSrc])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(gulp.dest(hbsDist));
});

gulp.task('handlebars', function() {
  return gulp.src([hbsSrc])
    .pipe(handlebars({
      // We include this for when we use this in Runnable Angular
      apiHost: 'api-staging-codenow.runnableapp.com',
      env: 'staging',
      commitHash: 'NOT_VALID',
      commitTime: 'NOT_VALID'
    }, {
      helpers: {
        if_eq: function(a, b, opts) {
          if(a == b) // Or === depending on your needs
            return opts.fn(this);
          else
            return opts.inverse(this);
        }
      }
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(rename('index.html'))
    .pipe(gulp.dest(htmlDist));
});

// sass
gulp.task('sass', function() {
  return gulp.src(sassSrc)
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

gulp.task('sassCompressed', function() {
  return gulp.src(sassSrc)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest(sassDist));
});

// javascript
gulp.task('javascript', function () {
  return gulp.src(jsDir)
    .pipe(newer(jsDist))
    .pipe(debug({
      title: 'javascript'
    }))
    .pipe(gulp.dest(jsDist));
});

gulp.task('jsCompressed', function() {
  return gulp.src(jsDir)
    .pipe(uglify({
      mangle: false
    }))
    .pipe(debug({
      title: 'jsCompressed'
    }))
    .pipe(gulp.dest(jsDist));
});

// images
gulp.task('images', function () {
  return gulp.src(imgDir)
    .pipe(newer(imgDist))
    .pipe(debug({
      title: 'images'
    }))
    .pipe(gulp.dest(imgDist));
});

// favicon
gulp.task('favicon', function () {
  return gulp.src(favIconSrc)
    .pipe(debug({
      title: 'favicon'
    }))
    .pipe(gulp.dest(favIconDist));
});

// imagemin
gulp.task('imagemin', function() {
  return gulp.src(imgDist + '/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(debug({
      title: 'imagemin'
    }))
    .pipe(gulp.dest(imgDist));
});

// deploy /dist to gh pages
gulp.task('ghPages', function() {
  return gulp.src(dist + '**/*')
    .pipe(ghPages());
});

// build and optimize
gulp.task('build', function(cb) {
  runSequence('clean', 'fileinclude' ,'handlebars', ['sassCompressed', 'jsCompressed', 'images', 'favicon'], 'imagemin', cb);
});

// build and deploy to gh pages
gulp.task('deploy', function(cb) {
  runSequence('build', 'ghPages', cb);
});

// build and watch
gulp.task('default', function(cb) {
  runSequence('clean', 'fileinclude', 'handlebars', ['sass', 'javascript', 'images', 'favicon'], cb);
  gulp.watch(htmlDir, function(){runSequence('fileinclude', 'handlebars');});
  gulp.watch(sassDir, ['sass']);
  gulp.watch(jsDir, ['javascript']);
  gulp.watch(imgDir, ['images']);
});
