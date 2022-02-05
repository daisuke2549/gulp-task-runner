let gulp = require('gulp');
let sass = require('gulp-sass')(require('sass'));
let plumber = require('gulp-plumber'); //エラー時の強制終了を防止
let notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
let sassGlob = require('gulp-sass-glob'); //@importの記述を簡潔にする
let browserSync = require( 'browser-sync' ); //ブラウザを自動的にリロード
let autoprefixer = require('gulp-autoprefixer'); //ベンダープレフィックスをつける
let cssdeclsort = require('css-declaration-sorter'); //css並べ替え
// let imagemin = require('gulp-imagemin');
let optipng = require('imagemin-optipng');
let mozjpeg = require('imagemin-mozjpeg');
let ejs = require("gulp-ejs");
let rename = require("gulp-rename"); //.ejsの拡張子を変更

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
//圧縮率の定義
let imageminOption = [
optipng({ optimizationLevel: 5 }),
mozjpeg({ quality: 85 }),
// imagemin.gifsicle({
// interlaced: false,
// optimizationLevel: 1,
// colors: 256
// }),
// imagemin.mozjpeg(),
// imagemin.optipng(),
// imagemin.svgo()
];
// 画像の圧縮
// $ gulp imageminで./src/img/base/フォルダ内の画像を圧縮し./src/img/フォルダへ
// .gifが入っているとエラーが出る
gulp.task('imagemin', function () {
return gulp
.src('./src/img/base/*.{png,jpg,gif,svg}')
.pipe(imagemin(imageminOption))
.pipe(gulp.dest('./src/img'));
});



gulp.task("ejs", function (done) {
  return gulp
    .src(["./*.ejs"])
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({ extname: ".html" }))
    .pipe(gulp.dest("./"));
  done();
});
