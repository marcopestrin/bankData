var gulp = require('gulp'),
    sass = require('gulp-sass');
    minifycss = require('gulp-minify-css'); /*da integrare!!!*/

var sassConfig = {
	inputDirectory: 'public/src/global.scss',
	outputDirectory: 'public/stylesheets',
	options: {
		outputStyle: 'expanded'
	}
}

gulp.task('build-css', function() {
	return gulp
		.src(sassConfig.inputDirectory)
		.pipe(sass(sassConfig.options).on('error', sass.logError))
		.pipe(gulp.dest(sassConfig.outputDirectory));
});

gulp.task('watch', function() {
	gulp.watch('public/src/global.scss', ['build-css']);
});

gulp.task('default', ['build-css']);
