var gulp = require('gulp');
var jsdoc = require("gulp-jsdoc");
var gutil = require("gulp-util");
var jsdoc2md = require("gulp-jsdoc-to-markdown");
var rename = require("gulp-rename");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var ngannotate = require('gulp-ng-annotate');
var stripDebug = require('gulp-strip-debug');
var karma = require('gulp-karma');

gulp.task('js', ['test'], function () {
    gulp.src('./src/*.js')
        .pipe(concat('angular-restclient.js'))
        .pipe(ngannotate())
        .pipe(gulp.dest('./dist'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(stripDebug())
        .pipe(uglify())
        .pipe(gulp.dest('./dist'))
});

gulp.task('doc-html', function () {
    gulp.src("./src/*.js")
        .pipe(jsdoc('./doc/html'))
});

gulp.task("doc-md", function(){
    return gulp.src("src/*.js")
        .pipe(jsdoc2md())
        .on("error", function(err){
            gutil.log(gutil.colors.red("jsdoc2md failed"), err.message)
        })
        .pipe(rename(function(path){
            path.extname = ".md";
        }))
        .pipe(gulp.dest("./doc/md"));
});

gulp.task('doc', ['test'], function() {
    gulp.start('doc-html', 'doc-md');
});

gulp.task('test', function() {
    return gulp.src([
        'node_modules/angular/angular.js',
        'node_modules/angular-mocks/angular-mocks.js',
        'node_modules/angular-resource/angular-resource.js',
        'src/angular-restclient.js',

        'test/TestModel.js',
        'test/**/*Spec.js'
    ])
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }))
        .on('error', function(err) {
            throw err;
        });
});

gulp.task('build', function() {
    gulp.start('test', 'js', 'doc')
});