const gulp = require('gulp');
const sass = require('gulp-sass');
const header = require('gulp-header');
const cleanCSS = require('gulp-clean-css');
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const pkg = require('./package.json');
const browsersync = require('browser-sync').create();

// Compile SCSS
gulp.task('css:compile', function () {
    return gulp.src('./scss/**/*.scss')
        .pipe(sass.sync({
            outputStyle: 'expanded'
        }).on('error', sass.logError))
        .pipe(gulp.dest('./css'))
});

// Minify CSS
gulp.task('css:minify', gulp.series('css:compile', function () {
    return gulp.src([
            './css/*.css',
            '!./css/*.min.css'
        ])
        .pipe(cleanCSS())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./css'))
        .pipe(browsersync.stream());
}));

// CSS
gulp.task('css', gulp.series(gulp.parallel('css:compile', 'css:minify')));

// Minify JavaScript
gulp.task('js:minify', function () {
    return gulp.src([
            './js/*.js',
            '!./js/*.min.js'
        ])
        .pipe(uglify())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('./js'))
        .pipe(browsersync.stream());
});

// JS
gulp.task('js', gulp.series('js:minify'));

// Default task
gulp.task('default', gulp.series(gulp.parallel('css', 'js')));

// BrowserSync
gulp.task('browserSync', function (done) {
    return browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
});

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

//paths
const paths = {
    html: {
        src: './*.html'
    }
    ,css: {
        src: ['./css/*.css','!./css/*.min.css']
    }
    ,js: {
        src: ['./js/*.js','!./js/*.min.js']
    }
};

//Watch
gulp.task('watch', function() {
    gulp.watch(paths.html.src, gulp.series(browserSyncReload));
    gulp.watch(paths.css.src, gulp.series('css', browserSyncReload));
    gulp.watch(paths.js.src, gulp.series('js', browserSyncReload));
});

// Dev task
gulp.task('dev', gulp.series('css', 'js', gulp.parallel('watch' ,'browserSync')));