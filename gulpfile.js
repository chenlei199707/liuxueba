'use strict';
var gulp = require('gulp'),
    runSequence = require('run-sequence'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    plugins = require('gulp-load-plugins')(),
    livereload = require('gulp-livereload');
var gutil = require('gulp-util');

//watchfy擴展
// var watchify = require('watchify');
// var browserify = require('browserify');
// var buffer = require('vinyl-buffer');
// var source = require('vinyl-source-stream');
// var sourcemaps = require('gulp-sourcemaps');
// var gutil = require('gulp-util');
// // watchify.args,
// var opts = {
//     entries: './src/js/main.js',
//     debug: !evi
// };

var evi = plugins.environments.production() === true;
var paramter = {
    port: 327109,
    host: 'localhost',
    basePath: '',
    start: !evi,
    quiet: true
};

/**********************************  配置開始  ***************************************************/

gulp.task('source', function () {
    var sources = gulp.src('./node_modules/livereload-js/dist/livereload.js')
        .pipe(gulp.dest(''));
    return sources
});

//less編譯文件
gulp.task('less', function () {
    var processors = [
        autoprefixer({
            browsers: ['last 3 version'],
            cascade: false,
            remove: false
        })
    ];
    return gulp.src(['less/*.less'])
        // .pipe(plugins.concat('main.less'))
        .pipe(plugins.less().on('error', gutil.log))
        // .pipe(plugins.less())
        .pipe(postcss(processors))
        .pipe(plugins.cssbeautify())
        // .pipe(gulp.dest('css/'))
        // .pipe(plugins.rename({
        //     suffix: '.min'
        // }))
        // .pipe(plugins.minifyCss({
        //     compatibility: 'ie6'
        // }))
        .pipe(gulp.dest('css/'))
    // .pipe(livereload(paramter))
});

//sass编译合并
gulp.task('sass', function () {
    var processors = [
        autoprefixer({
            browsers: ['last 3 version'],
            cascade: false,
            remove: false
        })
    ];

    return gulp.src(['src/css/main.scss'])
        .pipe(plugins.concat('main.scss'))
        .pipe(plugins.sass().on('error', plugins.sass.logError))
        .pipe(postcss([]))
        .pipe(plugins.cssbeautify())
        .pipe(gulp.dest('src/css/'))
        // .pipe(plugins.rename({
        //     suffix: '.min'
        // }))
        // .pipe(plugins.minifyCss({
        //     compatibility: 'ie7'
        // }))
        // .pipe(gulp.dest('src/css/'))
        // .pipe(gulp.dest('src/rev/css'));
});

//開發库复制
gulp.task('static', function () {
    return gulp.src(['src/{apache,img,css,build,swf,data}/**'])
        .pipe(gulp.dest('dist'))
        .pipe(plugins.revClient())
        .pipe(plugins.revClient.manifest())
        .pipe(gulp.dest('src/rev'));
});

//js合并压缩
gulp.task('js', function () {
    return gulp.src(['src/js/main.js'])
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('src/js'))
    // .pipe(livereload(paramter))
});

//js库复制
gulp.task('js:vendor', function () {
    var vendor = [
        'src/js/template/template-web.js',
        'src/js/template/jquery-1.10.2.js',
        'src/js/template/underscore.js',
        'src/js/template/backbone.js',
        'src/js/template/swfobject.js',
        'src/js/template/fastclick.js',
        // 'src/js/template/jquery.nanoscroller.js'
        // 'src/js/template/jquery.unslider.js',
        // 'src/js/swiper/swiper-3.4.2.jquery.min.js',
        // 'src/js/template/hls.js',
        // 'src/js/webloader/webuploader.js'
    ]
    return gulp.src(vendor)
        .pipe(plugins.concat('vendor.js'))
        .pipe(plugins.rename({
            suffix: '.min'
        }))
        .pipe(plugins.uglify({ ie8: true }))
        .pipe(gulp.dest('src/build/vendor'));
});

//images复制
gulp.task('images', function () {
    return gulp.src('src/img/**/*{jpg,png,gif}')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('src/img'))
});

//觀察代碼進行變化
gulp.task('watch', function () {
    // livereload.listen();
    gulp.watch('less/**/*.less', ['less']);
});

//CSS里更新引入文件版本号
gulp.task('rev:css', function () {
    return gulp.src(['src/rev/**/*.json', 'dist/css/**/*.css'])
        .pipe(plugins.revCollectorClient())
        .pipe(gulp.dest('dist/css/'));
});

//頁面里更新引入文件版本号
gulp.task('rev:php', function () {
    return gulp.src(['src/rev/**/*.json', 'src/templates/**/*.php'])
        .pipe(plugins.revCollectorClient())
        .pipe(gulp.dest(''))
});

//頁面里更新引入文件版本号
gulp.task('rev:js', function () {
    return gulp.src(['src/rev/**/*.json', 'dist/build/**/*.js'])
        .pipe(plugins.revCollectorClient({
            'src/': 'dist/'
        }))
        .pipe(gulp.dest('dist/build/'))
});

//頁面里更新引入文件版本号
gulp.task('rev:data', function () {
    return gulp.src(['src/rev/**/*.json', 'dist/data/**/*'])
        .pipe(plugins.revCollectorClient({
            'src/': 'dist/'
        }))
        .pipe(gulp.dest('dist/data/'))
});

//生產版本hash號
gulp.task('manifest', function () {
    gulp.src(['dist/**/*'], {
        base: './dist/apache'
    })
        .pipe(plugins.manifest({
            hash: true,
            preferOnline: true,
            network: ['*'],
            filename: 'manifest.appcache',
            exclude: 'apache.manifest'
        }))
        .pipe(gulp.dest('./dist/apache'));
});

/**********************************  配置執行  ***************************************************/

gulp.task('default', function () {
    runSequence(
        'source',
        'images', 'less',
        'watch'
        // 'js:vendor', 'js:watchfy',
        // 'watch',
        // 'js:hot'
    )
});