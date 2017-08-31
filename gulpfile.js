const gulp       = require('gulp'),
      pump       = require('pump'),
      sass       = require('gulp-scss'),
      fconcat    = require('gulp-concat'),
      clean      = require('gulp-clean'),
      cssmin     = require('gulp-csso'),
      child      = require('child_process'),
      sequence   = require('gulp-sequence').use(gulp),
      uglify     = require('gulp-uglify'),
      babel      = require('gulp-babel'),

      THEME_NAME = 'sps',
      THEME_DIR  = `web/themes/${THEME_NAME}`,
      BUILD_DIR  = '.build';

/**
 * Clear out the previous build folder
 *
 */
gulp.task('clean', () => {
  gulp.src(BUILD_DIR, {read: false})
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
gulp.task('sass-dev', () => {
  return gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(fconcat('style.min.css'))
    .pipe(cssmin({restructure: false}))
    .pipe(gulp.dest(`${BUILD_DIR}/css`));
});

/**
 * Compile the SASS files to CSS and completely minify
 *
 */
gulp.task('sass-prod', () => {
  return gulp.src('src/sass/*.scss')
    .pipe(sass())
    .pipe(fconcat('style.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(`${BUILD_DIR}/css`));
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

gulp.task('compress-regular', (callback) => {
  pump([
    gulp.src(['src/js/**/*.js', '!src/js/front-page/*.js']),
    babel({
      presets: ['env']
    }),
    uglify(),
    gulp.dest(`${BUILD_DIR}/js/normal`)
  ], callback);
});

gulp.task('compress-front', (callback) => {
  pump([
    gulp.src(['src/js/front-page/*.js']),
    babel({
      presets: ['env']
    }),
    uglify(),
    gulp.dest(`${BUILD_DIR}/js/front`)
  ], callback);
});

gulp.task('compress-regular-dev', (callback) => {
  pump([
    gulp.src(['src/js/**/*.js', '!src/js/front-page/*.js']),
    babel({
      presets: ['env']
    }),
    gulp.dest(`${BUILD_DIR}/js/normal`)
  ], callback);
});

gulp.task('compress-front-dev', (callback) => {
  pump([
    gulp.src(['src/js/front-page/*.js']),
    babel({
      presets: ['env']
    }),
    gulp.dest(`${BUILD_DIR}/js/front`)
  ], callback);
});

gulp.task('js-bundle-regular', () => {
  return gulp.src([`${BUILD_DIR}/js/vendor/*.js`, `${BUILD_DIR}/js/normal/*.js`])
  .pipe(fconcat('main.min.js'))
  .pipe(gulp.dest(`${THEME_DIR}/js`));
});

gulp.task('js-bundle-front', () => {
  return gulp.src([`${BUILD_DIR}/js/front/*.js`])
    .pipe(fconcat('front.min.js'))
    .pipe(gulp.dest(`${THEME_DIR}/js`));
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
gulp.task('css-bundle-dev', () => {
  return gulp.src(`${BUILD_DIR}/css/*.css`)
    .pipe(fconcat('style.min.css'))
    .pipe(cssmin({restructure: false}))
    .pipe(gulp.dest(THEME_DIR));
});

/**
 * Bundle CSS assets together and put into theme directory; production mode
 *
 */
gulp.task('css-bundle-prod', () => {
  return gulp.src(`${BUILD_DIR}/css/*.css`)
    .pipe(fconcat('style.min.css'))
    .pipe(cssmin())
    .pipe(gulp.dest(THEME_DIR));
});

/**
 * Auto-build the project on file save; uses the 'development' environment,
 * not the production environment
 *
 */
gulp.task('watch', () => {
  gulp.watch('src/twig/**/*', ['default']);
  gulp.watch('src/sass/**/*', ['watch-sass']);
  gulp.watch('src/js/**/*', ['watch-js']);
  console.log('Keeping an eye on the project files...');
});

// CSS specific combined tasks
gulp.task('css-dev', (callback) => {
  sequence(['sass-dev', 'vendor-css-build'], 'css-bundle-dev')(callback);
});

gulp.task('css-prod', (callback) => {
  sequence(['sass-prod', 'vendor-css-build'], 'css-bundle-prod')(callback);
});

// Build JS
gulp.task('js-dev', (callback) => {
  sequence(['compress-front-dev', 'compress-regular-dev', 'vendor-js-build'], ['js-bundle-front', 'js-bundle-regular'])(callback);
});

gulp.task('js-prod', (callback) => {
  sequence(['compress-front', 'compress-regular', 'vendor-js-build'], ['js-bundle-front', 'js-bundle-regular'])(callback);
});

// Watch events
gulp.task('watch-js', (callback) => {
  sequence(['js-dev'], 'clean')(callback);
});

gulp.task('watch-sass', (callback) => {
  sequence(['css-dev'], 'clean')(callback);
});

// Prefered executables
gulp.task('default', (callback) => {
  sequence(['twig', 'img-assets', 'css-dev', 'js-dev', 'vendor-font-build'], 'clean')(callback);
});

gulp.task('production', (callback) => {
  sequence(['twig', 'img-assets', 'css-prod', 'js-prod', 'vendor-font-build'], 'clean')(callback);
});
