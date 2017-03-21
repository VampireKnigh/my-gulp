var gulp = require('gulp');
var changed = require('gulp-changed');
var less = require('gulp-less');
var minify = require('gulp-minify');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');//使用uglify引擎压缩JS文件。
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');//图片压缩
var pngquant = require('imagemin-pngquant');//图片深度压缩
var concat = require('gulp-concat');//文件合并
var webserver = require('gulp-webserver');
var livereload = require('gulp-livereload');
var clean = require('gulp-clean');

var srcPath = {
    html:'src',
    css:'src/css',
    script:'src/js',
    image:'src/images'
};
var destPath = {
    html:'dist',
    css:'dist/css',
    script:'dist/js',
    image:'dist/images'
};
/* = 开发环境( Ddevelop Task )
 -------------------------------------------------------------- */
//html处理
gulp.task('html',function(){
    return gulp.src(srcPath.html+'/**/*.html')
        .pipe(changed(destPath.html))
        .pipe(gulp.dest(destPath.html));
});
//样式处理
gulp.task('less',function(){
    return gulp.src(srcPath.css+'/**/*.less')
        .pipe(changed(srcPath.css))
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(minify())
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest(destPath.css));
});
//js文件压缩&&重命名
gulp.task('script',function(){
    return gulp.src([srcPath.script+'/*.js','!'+srcPath.script+'/*.min.js'])// 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
        .pipe(changed(destPath.script))
        .pipe(sourcemaps.init())
        .pipe(rename({suffix:'.min'}))
        .pipe(uglify({preserveComments:'some'}))// 使用uglify进行压缩，并保留部分注释
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest( destPath.script ));
});
//图片压缩
gulp.task('images',function(){
    return gulp.src(srcPath.image+'**/*.{png,gif,jpg,svg}')
        .pipe(changed(destPath.image))
        .pipe(imagemin({
            progressive:true,// 无损压缩JPG图片
            svgoPlugins: [{removeViewBox: false}], // 不要移除svg的viewbox属性
            use: [pngquant()] // 深度压缩PNG
        }))
        .pipe(gulp.dest(destPath.image))
});
//文件合并
gulp.task('concat',function(){
    return gulp.src(srcPath.script+'/*.min.js')
        .pipe(concat('libs.js'))
        .pipe(rename({suffix:'.min'}))
        .pipe(gulp.dest(destPath.script))
});
// 本地服务器
gulp.task('webserver',function(){
    gulp.src(destPath.html)
        .pipe(webserver({
            livereload:true,
            open:true// 服务器启动时自动打开网页
        }))
});
// 监听任务
gulp.task('watch',function(){
    // 监听 html
    gulp.watch( srcPath.html+'/**/*.html' , ['html'])
    // 监听 scss
    gulp.watch( srcPath.css+'/*.scss' , ['sass']);
    // 监听 images
    gulp.watch( srcPath.image+'/**/*' , ['images']);
    // 监听 js
    gulp.watch( [srcPath.script+'/*.js','!'+srcPath.script+'/*.min.js'] , ['script']);
});
// 默认任务
gulp.task('default',['webserver','watch']);

/* = 发布环境( Release Task )
 -------------------------------------------------------------- */
// 清理文件
gulp.task('clean', function() {
    return gulp.src( [destPath.css+'/maps',destPath.script+'/maps'], {read: false} ) // 清理maps文件
        .pipe(clean());
});

// 脚本压缩&重命名
gulp.task('scriptRelease', function() {
    return gulp.src( [srcPath.script+'/*.js','!'+srcPath.script+'/*.min.js'] ) // 指明源文件路径、并进行文件匹配，排除 .min.js 后缀的文件
        .pipe(rename({ suffix: '.min' })) // 重命名
        .pipe(uglify({ preserveComments:'some' })) // 使用uglify进行压缩，并保留部分注释
        .pipe(gulp.dest( destPath.script )); // 输出路径
});
// 打包发布
gulp.task('release', ['clean'], function(){ // 开始任务前会先执行[clean]任务
    return gulp.start('sassRelease','scriptRelease','images'); // 等[clean]任务执行完毕后再执行其他任务
});

/* = 帮助提示( Help )
 -------------------------------------------------------------- */
gulp.task('help',function () {
    console.log('----------------- 开发环境 -----------------');
    console.log('gulp default		开发环境（默认任务）');
    console.log('gulp html		HTML处理');
    console.log('gulp less		样式处理');
    console.log('gulp script		JS文件压缩&重命名');
    console.log('gulp images		图片压缩');
    console.log('gulp concat		文件合并');
    console.log('---------------- 发布环境 -----------------');
    console.log('gulp release		打包发布');
    console.log('gulp clean		清理文件');
    console.log('gulp scriptRelease	脚本压缩&重命名');
    console.log('---------------------------------------------');
});