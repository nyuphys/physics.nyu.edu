const gulp       = require('gulp'),
      sass       = require('gulp-scss'),
      fconcat    = require('gulp-concat'),
      cssmin     = require('gulp-csso'),
      child      = require('child_process'),

      THEME_NAME = 'sps',
      THEME_DIR  = `web/themes/${THEME_NAME}`;


/**
 * Set up the project; one-time use task
 *
 */
gulp.task('config', () => {
  child.exec('docker pull uknetweb/php-5.4-apache', (error, stdout, stderr) => {
    if (!!error) {
      console.error(`Runtime error: ${error}`);
      return;
    }

    console.log(stdout);
    console.log(stderr);
  });

  gulp.task('default');
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
    .pipe(gulp.dest(THEME_DIR));
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

gulp.task('default', ['twig', 'sass-dev', 'dock']);
gulp.task('production', ['twig', 'sass-prod', 'dock']);
