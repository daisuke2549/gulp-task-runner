let gulp = require('gulp');
let sass = require('gulp-sass'); //Sassコンパイル
let plumber = require('gulp-plumber'); //エラー時の強制終了を防止
let notify = require('gulp-notify'); //エラー発生時にデスクトップ通知する
let sassGlob = require('gulp-sass-glob'); //@importの記述を簡潔にする
let browserSync = require( 'browser-sync' ); //ブラウザ反映
let postcss = require('gulp-postcss'); //autoprefixerとセット
let autoprefixer = require('autoprefixer'); //ベンダープレフィックス付与
let cssdeclsort = require('css-declaration-sorter'); //css並べ替え
// let imagemin = require('gulp-imagemin');
let optipng = require('imagemin-optipng');
let mozjpeg = require('imagemin-mozjpeg');
let ejs = require("gulp-ejs");
let rename = require("gulp-rename"); //.ejsの拡張子を変更
// scssのコンパイル
gulp.task('sass', function() {
return gulp
.src( './src/scss/**/*.scss' )
.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )//エラーチェック
.pipe( sassGlob() )//importの読み込みを簡潔にする
.pipe( sass({
outputStyle: 'expanded' //expanded, nested, campact, compressedから選択
}) )
.pipe( postcss([ autoprefixer(
{
"overrideBrowserslist": ["last 2 versions", "ie >= 11", "Android >= 5"],
cascade: false}
) ]) )
.pipe( postcss([ cssdeclsort({ order: 'alphabetically' }) ]) )//プロパティをソートし直す(アルファベット順)
.pipe(gulp.dest('./src/css'));//コンパイル後の出力先
});
// 保存時のリロード
gulp.task( 'browser-sync', function(done) {
browserSync.init({
//ローカル開発
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
gulp.task("ejs", (done) => {
gulp
.src(["ejs/**/*.ejs", "!" + "ejs/**/_*.ejs"])
.pipe( plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }) )//エラーチェック
.pipe(ejs())
.pipe(rename({extname: ".html"})) //拡張子をhtmlに
.pipe(gulp.dest("./")); //出力先
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
