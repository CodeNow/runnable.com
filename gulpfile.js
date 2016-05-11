var autoprefixer = require('gulp-autoprefixer');
var awspublish = require('gulp-awspublish');
var debug = require('gulp-debug');
var del = require('del');
var exec = require('child_process').exec;
var fileinclude = require('gulp-file-include');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var handlebars = require('gulp-compile-handlebars');
var imagemin = require('gulp-imagemin');
var minifyInline = require('gulp-minify-inline');
var newer = require('gulp-newer');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver');

// urls
var apiUrl = process.env.API_URL;
var angularUrl = process.env.ANGULAR_URL;

// file locations
var src = 'src/';
var dist = './dist/';

var htmlDir = src + 'html/**/*.hbs';
var htmlSrc = src + 'html/*.hbs';
var sassDir = src +'styles/**/*.scss';
var sassSrc = src + 'styles/index.scss';
var jsDir = src + 'js/**/*.**';
var imgDir = src + 'images/**/*.+(png|jpg|gif|svg)';
var favIconSrc = src + 'html/favicon.png';

var htmlDist = dist;
var sassDist = dist + 'styles/';
var jsDist = dist + 'js/';
var imgDist = dist + 'images/';
var favIconDist = dist;

// git commit/hash
var commitTime;
gulp.task('getCommitTime', function (cb) {
  exec('git log -1 --format=%cd', {cwd: __dirname}, function (err, stdout, stderr) {
    commitTime = stdout.split('\n').join('');
    cb();
  });
});

var commitHash;
gulp.task('getCommitHash', function (cb) {
  exec('git rev-parse HEAD', {cwd: __dirname}, function (err, stdout, stderr) {
    commitHash = stdout.split('\n').join('');
    cb();
  });
});

// delete dist
gulp.task('clean', function() {
  return del.sync('dist');
});

// html files
gulp.task('html', function() {
  return gulp.src(htmlSrc)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(handlebars({
      // We include this for when we use this in Runnable Angular
      apiUrl: apiUrl,
      env: process.env.NODE_ENV,
      commitHash: commitHash,
      commitTime: commitTime,
      angularUrl: angularUrl,
      loginUrl: apiUrl + '/auth/github?redirect=' + angularUrl + '/?auth'
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
    .pipe(rename({
      extname: '.html'
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(gulp.dest(htmlDist));
});

// sass
gulp.task('sass', function() {
  return gulp.src(sassSrc)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      remove: false
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(gulp.dest(sassDist));
});

gulp.task('sass:build', function() {
  return gulp.src(sassSrc)
    .pipe(sass({
      errLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(gulp.dest(sassDist));
});

// javascript
gulp.task('js', function () {
  return gulp.src(jsDir)
    .pipe(newer(jsDist))
    .pipe(debug({
      title: 'js'
    }))
    .pipe(gulp.dest(jsDist));
});

// minifier
gulp.task('minify', function() {
  gulp.src(dist + '**/*.html')
    .pipe(minifyInline({
      jsSelector: 'script[ugly]'
    }))
    .pipe(gulp.dest(dist));
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

gulp.task('s3', function() {
  // create a new publisher using S3 options
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
  var publisher = awspublish.create({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    params: {
      Bucket: process.env.AWS_BUCKET
    }
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=' + (60 * 5) + ', no-transform, public'
  };

  return  gulp.src(dist + '**/*')
    // gzip, Set Content-Encoding headers
    .pipe(awspublish.gzip())

    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
    .pipe(publisher.publish(headers))

    // Delete files in the bucket that aren't in the local folder
    .pipe(publisher.sync())

    // create a cache file to speed up consecutive uploads
    .pipe(publisher.cache())

    // print upload updates to console
    .pipe(awspublish.reporter());
});

// build and optimize
gulp.task('build', function(cb) {
  runSequence('getCommitTime', 'getCommitHash', 'clean', 'html', 'js', ['sass:build', 'images', 'favicon', 'minify'], 'imagemin', cb);
});

// build and deploy to gh pages
gulp.task('deploy:gh', function(cb) {
  runSequence('build', 'ghPages', cb);
});

// dev build and deploy to gh pages
gulp.task('deploy:gh:dev', function(cb) {
  runSequence('clean', 'html', 'js', ['sass', 'images', 'favicon'], 'ghPages', cb);
});

// build and deploy to amazon s3
gulp.task('deploy:s3', function(cb) {
  runSequence('build', 's3', cb);
});

// local webserver
gulp.task('server', function() {
  gulp.src(dist)
    .pipe(webserver());
});

// dev build and watch
gulp.task('default', function(cb) {
  runSequence('clean', 'html', 'js', ['sass', 'images', 'favicon'], 'server', cb);
  gulp.watch(htmlDir, ['html']);
  gulp.watch(sassDir, ['sass']);
  gulp.watch(jsDir, function(){runSequence('html', 'js');});
  gulp.watch(imgDir, ['images']);
});