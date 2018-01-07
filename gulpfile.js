const gulp     = require('gulp'),
    sass       = require('gulp-scss'),
    fconcat    = require('gulp-concat'),
    clean      = require('gulp-clean'),
    cssmin     = require('gulp-csso'),
    child      = require('child_process'),
    sequence   = require('gulp-sequence').use(gulp),
    uglify     = require('gulp-uglify'),
    babel      = require('gulp-babel'),
    browserify = require('browserify'),
    source     = require('vinyl-source-stream'),
    buffer     = require('vinyl-buffer'),
    rename     = require('gulp-rename'),
    sourcemaps = require('gulp-sourcemaps'),

    THEME_NAME = 'sps',
    THEME_DIR  = `web/themes/${THEME_NAME}`,
    BUILD_DIR  = '.build';

function isDevelopment() {
    return process.env.NODE_ENV === 'development';
}

/**
 * Clear out the previous build folder
 *
 */
gulp.task('clean', () => {
    return gulp.src(BUILD_DIR, {read: false})
        .pipe(clean({force: true}));
});


/**
 * Move all the twig templates into the theme folder
 *
 */
gulp.task('twig', () => {
    return gulp.src('src/twig/*.twig')
        .pipe(gulp.dest(THEME_DIR));
});

/**
 * Move all image assets (JPG, PNG, and SVG) into the theme directory
 *
 */
gulp.task('img-assets', () => {
    return gulp.src(['assets/*.jpg', 'assets/*.png', 'assets/*.svg'])
        .pipe(gulp.dest(`${THEME_DIR}/img`));
});


/**
 * Compile the SASS files to CSS, but don't completely restructure
 * in order to bug squash
 *
 */
gulp.task('sass-build', () => {
    if (isDevelopment()) {
        return gulp.src('src/sass/*.scss')
            .pipe(sass())
            .pipe(fconcat('style.min.css'))
            .pipe(cssmin({restructure: false}))
            .pipe(gulp.dest(`${BUILD_DIR}/css`));
    } else {
        return gulp.src('src/sass/*.scss')
            .pipe(sass())
            .pipe(fconcat('style.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest(`${BUILD_DIR}/css`));
    }
});

/**
 * Move vendor CSS assets to temp build
 *
 */
gulp.task('vendor-css-build', () => {
    return gulp.src('vendor/css/*.css')
        .pipe(gulp.dest(`${BUILD_DIR}/css`));
});

gulp.task('vendor-js-build', () => {
     return gulp.src('vendor/js/*.js')
         .pipe(gulp.dest(`${BUILD_DIR}/js/vendor`)); 
});

gulp.task('main-es6-es5', (callback) => {
    return gulp.src(['src/js/**/*.js', '!src/js/front-page/*.js'])
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest(`${BUILD_DIR}/js/normal`));
});

/**
 * ALL APP HANDLING IS AFTER THIS
 *
 */

gulp.task('app-es6-commonjs', () => {
    return gulp.src(['src/js/front-page/*.js'])
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest(`${BUILD_DIR}/js/temp`));
});

gulp.task('front-bundle', () => {
    let bundleStream = browserify(`${BUILD_DIR}/js/temp/about.js`).bundle();

    if (isDevelopment()) {
        return bundleStream
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(rename('bundle.js'))
            .pipe(gulp.dest(`${BUILD_DIR}/js/front`));
    } else {
        return bundleStream
            .pipe(source('bundle.js'))
            .pipe(buffer())
            .pipe(uglify())
            .pipe(rename('bundle.js'))
            .pipe(gulp.dest(`${BUILD_DIR}/js/front`));
    }
});

gulp.task('js-bundle-regular', () => {
    return gulp.src([`${BUILD_DIR}/js/vendor/*.js`, `${BUILD_DIR}/js/normal/*.js`])
        .pipe(sourcemaps.init({largeFile: true}))
        .pipe(fconcat('main.min.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write('../maps'))
        //.pipe(sourcemaps.write('./maps', {
            //sourceMappingURL: function(file) {
                //return `http://localhost:8010/themes/sps/js/maps/` + file.relative + '.map';
            //}
        //}))
        .pipe(gulp.dest(`${THEME_DIR}/js`));
});

gulp.task('js-bundle-front', () => {
    if (isDevelopment()) {
        return gulp.src([`${BUILD_DIR}/js/front/*.js`])
            .pipe(fconcat('front.min.js'))
            .pipe(gulp.dest(`${THEME_DIR}/js`));
    } else {
        return gulp.src([`${BUILD_DIR}/js/front/*.js`])
            .pipe(fconcat('front.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(`${THEME_DIR}/js`));
    }
});

/**
 * Move vendor fonts to theme directory
 *
 */
gulp.task('vendor-font-build', () => {
    return gulp.src(['vendor/fonts/*.eot',
        'vendor/fonts/*.svg',
        'vendor/fonts/*.ttf',
        'vendor/fonts/*.woff',
        'vendor/fonts/*.woff2',
        'vendor/fonts/*.otf'])
        .pipe(gulp.dest(`${THEME_DIR}/fonts`));
});

/**
 * Bundle CSS assets together and put into theme directory; development mode
 *
 */
gulp.task('css-bundle', () => {
    if (isDevelopment()) {
        return gulp.src(`${BUILD_DIR}/css/*.css`)
            .pipe(fconcat('style.min.css'))
            .pipe(cssmin({restructure: false}))
            .pipe(gulp.dest(THEME_DIR));
    } else {
        return gulp.src(`${BUILD_DIR}/css/*.css`)
            .pipe(fconcat('style.min.css'))
            .pipe(cssmin())
            .pipe(gulp.dest(THEME_DIR));
    }
});

// CSS specific combined tasks
gulp.task('build-css', (cb) => {
    sequence(['sass-build', 'vendor-css-build'], 'css-bundle')(cb);
});

// Build JS
gulp.task('build-app', (cb) => {
    sequence(['app-es6-commonjs'], 'front-bundle')(cb);
});

gulp.task('build-js', (cb) => {
    sequence(['main-es6-es5', 'build-app', 'vendor-js-build'], ['js-bundle-front', 'js-bundle-regular'])(cb);
});

gulp.task('build-js-app', (cb) => {
    sequence(['build-app'], ['js-bundle-front'])(cb);
});

// Watch events
gulp.task('watch', () => {
    gulp.watch('src/twig/**/*', ['default']);
    gulp.watch('src/sass/**/*', ['watch-sass']);
    gulp.watch(['src/js/**/*', '!src/js/front-page/*'], ['watch-js']);
    gulp.watch(['src/js/front-page/*'], ['watch-js-app']);
    console.log('Keeping an eye on the project files...');
});

gulp.task('watch-js', (callback) => {
    sequence(['build-js'], 'clean')(callback);
});

gulp.task('watch-js-app', (cb) => {
    sequence(['build-js-app'], 'clean')(cb);
});

gulp.task('watch-sass', (callback) => {
    sequence(['build-css'], 'clean')(callback);
});

// Prefered executables
gulp.task('default', (callback) => {
    sequence(['twig', 'img-assets', 'build-css', 'build-js', 'vendor-font-build'], 'clean')(callback);
});
