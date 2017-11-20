/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import del from 'del';
import flow from 'gulp-flowtype';
import sass from 'gulp-sass';
import cleancss from 'gulp-clean-css';
import postcss from 'gulp-postcss';
import cssnext from 'postcss-cssnext';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';

const paths = {
  allSrcJs: 'src/js/**/*.js',
  srcJs: 'src/js/applications/*.js',
  gulpFile: 'gulpfile.babel.js',
  allPug: 'src/pug/**/*.pug',
  pug: 'src/pug/pages/*.pug',
  html: 'dist',
  allSass: 'src/sass/**/*.scss',
  sass: 'src/sass/applications/*.scss',
  css: 'dist/css/',
  js: 'dist/js',
};

const plumberOption = {
  errorHandler(error) {
    console.log(error.message);
    this.emit('end');
  },
};

gulp.task('clean', () => del([
  paths.js,
]));

gulp.task('build', ['clean', 'pug', 'sass'], () =>
  gulp.src(paths.srcJs)
    .pipe(plumber(plumberOption))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(paths.js)),
);

gulp.task('pug', () =>
  gulp.src(paths.pug)
    .pipe(plumber(plumberOption))
    .pipe(pug({ pretty: true }))
    .pipe(gulp.dest(paths.html)),
);

gulp.task('sass', () => {
  const processors = [
    cssnext(),
  ];
  gulp.src(paths.sass)
    .pipe(plumber(plumberOption))
    .pipe(sass())
    .pipe(postcss(processors))
    .pipe(cleancss())
    .pipe(gulp.dest(paths.css));
});

gulp.task('watch', () => {
  const watchList = [
    paths.allSrcJs,
    paths.allSass,
    paths.allPug,
  ];
  gulp.watch(watchList, ['build', 'reload']);
});

gulp.task('default', ['watch', 'build']);

gulp.task('server', ['default'], () => {
  const serverSetting = {
    server: {
      baseDir: './dist/',
      index: 'index.html',
    },
  };
  browserSync(serverSetting);
});

gulp.task('reload', () =>
  browserSync.reload(),
);
