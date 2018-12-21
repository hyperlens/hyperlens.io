// common
const gulp = require('gulp');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const log = require('fancy-log');
const beeper = require('beeper');
// templates
const nunjucks = require('gulp-nunjucks-render');
const cacheBust = require('gulp-cache-bust');
const data = require('gulp-data');
const htmlmin = require('gulp-htmlmin');
// js
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const named = require('vinyl-named');
// css
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const postcssNormalize = require('postcss-normalize');
const autoprefixer = require('autoprefixer');
const cleanCss = require('gulp-clean-css');
// images
const del = require('del');
const path = require('path');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const webp = require('imagemin-webp');


let paths = {
    src: {
        less: 'less/*.less',
        js: 'js/*.js',
        img: ['img/**/*.{png,jpg,gif,svg}'],
        imgWebp: ['img/**/*.{png,jpg}'],
        templatesDir: ['templates/', 'img/'],
        templatesFiles: 'templates/*.njk',
    },
    dest: {
        css: 'public/css/',
        js: 'public/js',
        img: 'public/img/',
        html: 'public/',
    },
    watch: {
        less: 'less/**/*.less',
        js: 'js/**/*.js',
        templates: ['templates/**/*.njk', 'lang/*.js'],
    },
    cache: {
        tmpDir: 'tmp/',
        cacheDirName: 'gulp-cache',
    },
};


// LESS
gulp.task('less', function () {
    return gulp.src(paths.src.less)
        .pipe(plumber({errorHandler: onError}))
        .pipe(less())
        .pipe(postcss([
            autoprefixer({cascade: false}),
            postcssNormalize({forceImport: true}),
        ]))
        .pipe(cleanCss({
            level: {
                1: {},
                2: {
                    // removeUnusedAtRules: true,
                },
            }
        }))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.dest.css));
});


// JS
gulp.task('js', function() {
    return gulp.src(paths.src.js)
        .pipe(plumber({errorHandler: onError}))
        .pipe(named())
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.dest.js));
});


// TEMPLATES
gulp.task('templates', function () {
    return gulp.src(paths.src.templatesFiles)
        .pipe(plumber({errorHandler: onError}))
        .pipe(named())
        .pipe(data(function getDataForFile(file) {
            return {
                __filePath__: file.relative,
                __fileName__: file.named,
            };
        }))
        .pipe(nunjucks({
            path: paths.src.templatesDir,
            ext: '.html',
            data: {},
        }))
        .pipe(htmlmin({ collapseWhitespace: true, conservativeCollapse: true }))
        .pipe(gulp.dest(paths.dest.html));
});

// CACHE BUST
gulp.task('cache-bust', ['templates', 'less', 'js'], cacheBustTask);
gulp.task('cache-bust:templates', ['templates'], cacheBustTask);
gulp.task('cache-bust:less', ['less'], cacheBustTask);
gulp.task('cache-bust:js', ['js'], cacheBustTask);

function cacheBustTask() {
    gulp.src(paths.dest.html + '**/*.html')
        .pipe(cacheBust())
        .pipe(gulp.dest(paths.dest.html))
}



// IMG
gulp.task('imagemin', ['imagemin:default', 'imagemin:webp']);
gulp.task('imagemin:default', function () {
    return gulp.src(paths.src.img)
        .pipe(plumber({errorHandler: onError}))
        .pipe(cache(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                mozjpeg({quality: 85}),
                imagemin.jpegtran({progressive: true}),
                pngquant(),
                // imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({plugins: [{removeViewBox: false}]})
            ], {
                verbose: true
            }), {
                fileCache: new cache.Cache(paths.cache),
                name: 'default',
            }))
        .pipe(gulp.dest(paths.dest.img));
});
gulp.task('imagemin:webp', function () {
    return gulp.src(paths.src.imgWebp)
        .pipe(plumber({errorHandler: onError}))
        .pipe(cache(
            imagemin([
                webp({
                    quality: 85,
                    method: 5,
                }),
            ], {
                verbose: true
            }), {
                fileCache: new cache.Cache(paths.cache),
                name: 'webp',
            }))
        .pipe(rename({ extname: '.webp' }))
        .pipe(gulp.dest(paths.dest.img));
});
gulp.task('imagemin:clean', ['imagemin:clean-dest', 'imagemin:clean-cache']);
gulp.task('imagemin:clean-dest', function() {
    return del.sync(paths.dest.img);
});
gulp.task('imagemin:clean-cache', function() {
    return del.sync([
        paths.cache.tmpDir + '/' + paths.cache.cacheDirName + '/default',
    ]);
});



// Полная сборка с вотчем
gulp.task('default', ['less', 'js', 'templates', 'imagemin', 'cache-bust'], function() {
    gulp.watch(paths.watch.less, ['less', 'cache-bust:less']);
    gulp.watch(paths.watch.js, ['js', 'cache-bust:js']);
    gulp.watch(paths.watch.templates, ['templates', 'cache-bust:templates']);
    gulp.watch(paths.src.img, ['imagemin']).on('change', function(event) {
        if (event.type === 'deleted') {
            del(paths.dest.img + path.basename(event.path));
        }
    });
    setTimeout(function () {
        log('Watching ...');
    });
});
// Полная сборка без вотча
gulp.task('once', ['less', 'js', 'templates', 'imagemin', 'cache-bust']);




// Ошибки
let onError = function(error) {
    log([
        (error.name + ' in ' + error.plugin).bold.red,
        '',
        error.message,
        ''
    ].join('\n'));
    beeper();
    this.emit('end');
};


