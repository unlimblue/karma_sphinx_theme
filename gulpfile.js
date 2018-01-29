var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var runSequence = require('run-sequence');

// postcss
var autoprefixer = require('autoprefixer');
var discardempty = require('postcss-discard-empty');
var discardcomments = require('postcss-discard-comments');

var config = {
    publicDir: 'karma_sphinx_theme/static',
    scssDir: 'scss',
    autoprefixer: {
        browsers: [
            'Chrome >= 35',
            'Firefox >= 38',
            'Edge >= 12',
            'Explorer >= 10',
            'iOS >= 8',
            'Safari >= 8',
            'Android 2.3',
            'Android >= 4',
            'Opera >= 12'
        ],
        "cascade": false
    },
    sass: {
        "includePaths": [
            'node_modules'
        ]
    },
    cssmin: {},
    fontello: {
        config: 'scss/config.json',
        options: {
            host: 'http://fontello.com',
            font: 'fonts',
            css: 'module',
            assetsOnly: true
        }
    }
};

gulp.task('scss', function() {
    return gulp.src(config.scssDir + '/karma.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass(config.sass))
    .pipe($.postcss([
        discardcomments(),
        discardempty(),
        autoprefixer(config.autoprefixer)
    ]))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(config.publicDir + '/css'));
});

gulp.task('fontello', function () {
    return gulp.src(config.fontello.config)
    .pipe($.fontello(config.fontello.options))
    .pipe($.rename(function(path) {
        if (path.extname === '.css') {
            path.basename = '_' + path.basename;
            path.extname = '.scss'
        }
    }))
    .pipe(gulp.dest(config.scssDir))
});

gulp.task('fontello_dist_fonts', function () {
    return gulp.src(config.scssDir + '/fonts/*')
    .pipe(gulp.dest(config.publicDir + '/fonts'))
});

gulp.task('min', function () {
  return gulp.src(config.publicDir + '/css/karma.css')
    .pipe($.cssmin(config.cssmin))
    .pipe($.rename({suffix: '.min'}))
    .pipe(gulp.dest(config.publicDir + '/css'))
    .pipe($.livereload());
});

gulp.task('default', function(cb) {
    runSequence('scss', 'min', 'fontello_dist_fonts', cb);
});

gulp.task('watch', ['default'], function (){
    $.livereload.listen();
    gulp.watch(
        [
            config.scssDir + '/*.scss',
            config.scssDir + '/**/*.scss'
        ],
        ['default']);
});