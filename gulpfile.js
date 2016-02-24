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
var handlebars = require('gulp-compile-handlebars'); // handlebars
var rename = require('gulp-rename'); // rename files
var awspublish = require('gulp-awspublish');

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
gulp.task('html', function() {
  return gulp.src(htmlSrc)
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .on('error', function(err){
      console.log(err.message);
    })
    .pipe(gulp.dest(hbsDist));
});

// hbs files
gulp.task('hbs', function() {
  return gulp.src(hbsSrc)
    .pipe(handlebars({
      // We include this for when we use this in Runnable Angular
      apiHost: 'https://api-staging-codenow.runnableapp.com',
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

gulp.task('publish', function() {
  // create a new publisher using S3 options
  // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
  var publisher = awspublish.create({
    Bucket: 'runnable.io',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  });

  // define custom headers
  var headers = {
    'Cache-Control': 'max-age=' + (60 * 5) + ', no-transform, public'
  };

  return  gulp.src(dist + '**/*')
    // gzip, Set Content-Encoding headers and add .gz extension
    .pipe(awspublish.gzip({ ext: '.gz' }))

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
  runSequence('clean', 'html', 'hbs', ['sassCompressed', 'images', 'favicon'], 'imagemin', cb);
});

// build and deploy to gh pages
gulp.task('deploy', function(cb) {
  runSequence('build', 'ghPages', cb);
});

gulp.task('deploy:prod', function(cb) {
  runSequence('build', 'publish', cb);
});

// build and watch
gulp.task('default', function(cb) {
  runSequence('clean', 'html', 'hbs', ['sass', 'images', 'favicon'], cb);
  gulp.watch(htmlDir, function(){runSequence('html', 'hbs');});
  gulp.watch(sassDir, ['sass']);
  gulp.watch(jsDir, ['javascript']);
  gulp.watch(imgDir, ['images']);
});
