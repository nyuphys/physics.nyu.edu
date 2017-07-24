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
 * Set up the project; one-time use task
 *
 */
gulp.task('pull-apache', () => {
  child.exec('docker pull uknetweb/php-5.4-apache', (error, stdout, stderr) => {
    if (!!error) {
      console.error(`Runtime error: ${error}`);
      return;
    }

    console.log(stdout);
    console.log(stderr);
  });
});

/**
 * Sets up the docker container with the latest build
 *
 */
gulp.task('dock', () => {
  child.exec('docker build -t sps .', (error, stdout, stderr) => {
    if (!!error) {
      console.error(`Runtime error: ${error}`);
      return;
    }

    console.log(stdout);
    console.log(stderr);
  });
});

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
  var watcher = gulp.watch('src/**/*', ['default']);
  console.log('Keeping an eye on the project files...');

  watcher.on('change', (e) => {
    console.log(`Rendering new file: ${e.path}`);
  });
});

// CSS specific combined tasks
gulp.task('css-dev', sequence(['sass-dev', 'vendor-css-build'], 'css-bundle-dev'));
gulp.task('css-prod', sequence(['sass-prod', 'vendor-css-build'], 'css-bundle-prod'));

// Prefered executables
gulp.task('default', sequence(['twig', 'css-dev'], 'clean'));
gulp.task('config', sequence(['pull-apache', 'dock'], 'default'));
gulp.task('production', sequence(['twig', 'css-prod'], 'clean'));
