// Variables
const themeDirectory = "wp-content/themes/";
const themeName = "evancho_base";
const themeRoot = themeDirectory + themeName;
const files = {
	vendorCssPath: 'app/vendor/scss/**/*.scss',
	scssPath: 'app/scss/**/*.scss',
	vendorJsPath: 'app/vendor/js/**/*.js',
	jsPath: 'app/js/**/*.js'
};

// Initialize Modules
const { src, dest, watch, series, parallel } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
// const replace = require('gulp-replace');

// Vendor Sass
function vendorCssTask(){
	return src(files.vendorCssPath)
		.pipe(sourcemaps.init()) // initialize sourcemaps first
		.pipe(sass()) // compile SCSS to CSS
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
		.pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
		.pipe(dest(themeRoot + '/dist')
		); // put final CSS in dist folder
}

// Style Sass
function scssTask(){
	return src(files.scssPath)
		.pipe(sourcemaps.init()) // initialize sourcemaps first
		.pipe(sass()) // compile SCSS to CSS
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
		.pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
		.pipe(dest(themeRoot + '/dist')
		); // put final CSS in dist folder
}

// Vendor JS
function vendorJsTask(){
	return src([
		files.vendorJsPath
	])
		.pipe(concat('vendor.min.js'))
		.pipe(uglify())
		.pipe(dest(themeRoot + '/dist')
		);
}

// Main JS
function jsTask(){
	return src([
		files.jsPath
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest(themeRoot + '/dist')
		);
}

// Cachebust (TO DO)
// var cbString = new Date().getTime();
// function cacheBustTask(){
// 	return src(['index.html'])
// 		.pipe(replace(/cb=\d+/g, 'cb=' + cbString))
// 		.pipe(dest('.'));
// }

// Watch Task
function watchTask(){
	watch([files.vendorCssPath, files.scssPath, files.vendorJsPath, files.jsPath],
		parallel(vendorCssTask, scssTask, vendorJsTask, jsTask));
}

// Default Gulp Task
exports.default = series(
	parallel(vendorCssTask, scssTask, vendorJsTask, jsTask),
	// cacheBustTask,
	watchTask
);