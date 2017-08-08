const gulp       = require('gulp'),
      sass       = require('gulp-scss'),
      fconcat    = require('gulp-concat'),
      clean      = require('gulp-clean'),
      cssmin     = require('gulp-csso'),
      child      = require('child_process'),
      sequence   = require('gulp-sequence').use(gulp),

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
  gulp.watch('src/**/*', ['default']);
  console.log('Keeping an eye on the project files...');
});

// CSS specific combined tasks
gulp.task('css-dev', (callback) => {
  sequence(['sass-dev', 'vendor-css-build'], 'css-bundle-dev')(callback);
});

gulp.task('css-prod', (callback) => {
  sequence(['sass-prod', 'vendor-css-build'], 'css-bundle-prod')(callback);
});

// Prefered executables
gulp.task('default', (callback) => {
  sequence(['twig', 'img-assets', 'css-dev', 'vendor-font-build'], 'clean')(callback);
});

gulp.task('production', (callback) => {
  sequence(['twig', 'img-assets', 'css-prod', 'vendor-font-build'], 'clean')(callback);
});
