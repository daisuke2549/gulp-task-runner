let gulp = require('gulp');
let sass = require('gulp-sass')(require('sass'));
let plumber = require('gulp-plumber'); //エラー時の強制終了を防止
let notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
let sassGlob = require('gulp-sass-glob'); //@importの記述を簡潔にする
let browserSync = require( 'browser-sync' ); //ブラウザを自動的にリロード
let autoprefixer = require('gulp-autoprefixer'); //ベンダープレフィックスをつける
let ejs = require("gulp-ejs");
let rename = require("gulp-rename"); //.ejsの拡張子を変更
let { src, dest, series, parallel, watch } = require("gulp");
const imagemin = require('gulp-imagemin');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const changed = require('gulp-changed');

startPath: '/index.html'
// scssのコンパイル
gulp.task('sass', function() {
return gulp
.src( './src/scss/style.scss' )
.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )//エラーチェック
.pipe( sassGlob() )//importの読み込みを簡潔にする
.pipe( sass({
outputStyle: 'compressed' //expanded, nested, campact, compressedから選択
}) )
.pipe(autoprefixer()) //prefix
.pipe(gulp.dest('./src/css'));//コンパイル後の出力先
});
gulp.task( 'browser-sync', function(done) {
browserSync.init({
server: {
baseDir: "./",
index: "index.html"
}
});
done();
});
gulp.task( 'bs-reload', function(done) {
browserSync.reload();
done();
});
// 監視
gulp.task( 'watch', function(done) {
gulp.watch( './src/scss/**/*.scss', gulp.task('sass') ); //sassが更新されたらgulp sassを実行
gulp.watch('./src/scss/**/*.scss', gulp.task('bs-reload')); //sassが更新されたらbs-reloadを実行
gulp.watch( './src/js/*.js', gulp.task('bs-reload') ); //jsが更新されたらbs-relaodを実行
gulp.watch('./ejs/**/*.ejs',gulp.task('ejs') ) ; //ejsが更新されたらgulp-ejsを実行
gulp.watch('./ejs/**/*.ejs',gulp.task('bs-reload') ) ; //ejsが更新されたらbs-reloadを実行
});
// default
gulp.task('default', gulp.series(gulp.parallel('browser-sync', 'watch')));

gulp.task("ejs", function (done) {
  return gulp
    .src(["./*.ejs"])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("./"));
  done();
});
gulp.task('imagemin', function () {
  return gulp
    .src('./src/img/base/*.+(png|jpg|jpeg|gif|svg)')
    .pipe(imagemin()) //imageを最適化
    .pipe(gulp.dest('./src/img/'));
});
