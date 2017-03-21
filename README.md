# my-gulp

一个用了一大堆模块的项目
```
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
```

学习各种gulp插件的使用
