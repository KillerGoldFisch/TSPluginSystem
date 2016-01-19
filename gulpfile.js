
var gulp = require('gulp');
var ts = require('gulp-typescript');
var shell = require('gulp-shell')

gulp.task('build', function () {
	return gulp.src('src/*.ts')
		.pipe(ts({
            module: "commonjs", //"amd", 
            target: 'ES5',
            sourceMap: true,
            removeComments: true,
            preserveConstEnums: true,
			noImplicitAny: true,
			//out: 'pluginsystem.js'
		}))
		.pipe(gulp.dest('build'));
});

gulp.task('test', ['build'] ,function () {
	return gulp.src('src/test/*.ts')
		.pipe(ts({
            module: "commonjs", //"amd", 
            target: 'ES5',
            sourceMap: true,
            removeComments: false,
            preserveConstEnums: true,
			noImplicitAny: true,
			//out: 'test.js'
		}))
		.pipe(gulp.dest('build/test'))
        .pipe(shell(['node <%= file.path %>']));
});

