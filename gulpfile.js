const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglifyes');
const rename = require('gulp-rename');
const less = require('gulp-less');
const cleanCss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const livereload = require('gulp-livereload');
const connect = require('gulp-connect');
const open = require('open');
// const pump = require('pump');

//创建一个可以通过控制台执行的任务

//合并并压缩js
gulp.task('minifyjs',function(cb){
    return gulp.src("./app/js/**/*.js") //选择任务需要的文件并 放进gulp自有的内存中
    .pipe(concat('built.js'))           //合并js文件
    .pipe(gulp.dest('./server/js'))     //输出到server的js文件夹中看下
    .pipe(uglify())                    //对合并的文件（副本）进行压缩
    .pipe(rename("built.min.js"))      //改为.min.js的后缀名
    .pipe(gulp.dest('./server/js'))
    .pipe(livereload());
});
//转换less->css
gulp.task('less',function(){
    return gulp.src('./app/less/**/*.less')
    .pipe(less())                      //装换为css
    .pipe(gulp.dest('./app/css'));
});

//合并css并压缩
gulp.task('css',['less'],function(){
    return gulp.src('./app/css/**/*.css')
    .pipe(concat('built.css'))
    .pipe(gulp.dest('./server/css'))
    .pipe(cleanCss({compatibility:'ie8'}))
    .pipe(rename({suffix:'.min'}))
    .pipe(gulp.dest('./server/css'))
    .pipe(livereload());
});
//压缩html
gulp.task('htmlmin',function(){
    return gulp.src('index.html')
    .pipe(htmlmin({collapseWhitespace:true}))
    // .pipe(rename('h.html'))
    .pipe(gulp.dest('./server'))
    .pipe(livereload());
});
//添加监视
gulp.task('watch',['default'],function(){
    livereload.listen();
    gulp.watch('./app/js/**/*.js',['minifyjs']);
    gulp.watch(['./app/css/**/*.css','./app/less/**/*less'],['css','less']);
    gulp.watch(['index.html'],['htmlmin']);
});
//注册服务器任务（全自动）
gulp.task('server',['default'],function(){
    livereload.listen();        //注意这一句话
    connect.server({
        root:'./server/',
        livereload:true,
        port:5000
    });
    open('http://localhost:5000');
    gulp.watch(['./app/js/**/*.js'],['minifyjs']);
    gulp.watch(['./app/css/**/*.css','./app/less/**/*.less'],['css','less']);
    gulp.watch(['index.html'],['htmlmin']);
});
 gulp.task('default',['minifyjs','htmlmin','less','css']);