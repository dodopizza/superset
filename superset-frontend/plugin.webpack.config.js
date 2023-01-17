// DODO-changed
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const rm = require('rimraf');
const parsedArgs = require('yargs').argv;
// const Dotenv = require('dotenv-webpack');
const Dotenv = require('dotenv');
const WebpackManifestPlugin = require('webpack-manifest-plugin');

const {
  PROD_OUTPUT_FOLDER,
  DEV_OUTPUT_FOLDER,
  getHtmlTemplate,
} = require('./webpackUtils/constants');

const { rulesStyles } = require('./webpackUtils/styles');
const { rulesStaticAssets } = require('./webpackUtils/assets');

/**
 * To run local build and to serve it later:
 * 1. yarn build:{env} (make sure the output folder is set to public)
 * 2. yarn serve:{port} (serving build files from public folder) (3000 - dev, 6479 - prod)
 */

/**
 * mode:
 * - development (local dev)
 * - production (prod build)
 * - none (local prod build with manual token input in index.html after build)
 * publicPath:
 * - can be defined in package.json (for production build)
 * - can be empty (for local build)
 * - is different for prod and dev
 * TODO:
 * - move public path from package.json to env file
 */

/**
  Destination params:

 *  env => dev | prod
 * - defines which API to use
 * -- dev -> https://superset.dodois.dev/
 * -- prod -> https://analytics.dodois.io/

 * business => dodopizza | drinkit | doner42
 * - defines the business where plugin is going to be embeded

 * role => officemanager
 * - defines a role in dodois

 * extra => analytics
 * - usually is the name of the tab in dodois

 * singleDashboard => true | false
 * - defines the ability to have JUST 1 dashboard embeded into a page

 * withCommonDashboards => true | false
 * - defines the ability to include the common dashboards

 * withMainMenuHelper => true | false
 * - defines the ability to include the main page "Как работать с аналитикой"
 * 
 * isUnavailable => true | false
 * - defines if the SS dashboard plugin temporarly unavailable

 */
const {
  mode = 'development',
  measure = false,
  publicPath = '',
  port = '3000',
  envFile = '.env',
} = parsedArgs;

const isProd = mode === 'production';

const getPublicPath = isProdMode =>
  isProdMode ? (publicPath ? `${publicPath}/` : '') : '';

// eslint-disable-next-line import/extensions
const packageConfig = require('./package.json');

// input dir
const ROOT_DIR = path.resolve(__dirname, './');
// output dir
const BUILD_DIR = path.resolve(
  __dirname,
  isProd ? PROD_OUTPUT_FOLDER : DEV_OUTPUT_FOLDER,
);

/*
 ** APP VERSION BASE is a base from which the app inherited the code base
 ** (i.e. 1.3 => was inherited from Superset 1.3)
*/
const APP_VERSION_BASE = '1.3';
const date = new Date();
const month = date.getMonth() + 1;
const day = date.getDate();
const hours = date.getHours();
const APP_VERSION = `${APP_VERSION_BASE}.${month}-${day}:${hours}`;

console.group('Params:');
console.log('Parsed Args', parsedArgs);
console.log('______');
console.log('isProd =>', JSON.stringify(isProd));
console.log('input ROOT_DIR =>', JSON.stringify(ROOT_DIR));
console.log('webpack mode =>', JSON.stringify(mode));
console.log('output BUILD_DIR =>', JSON.stringify(BUILD_DIR));
console.log('publicPath =>', JSON.stringify(getPublicPath(isProd)));
console.log('APP_VERSION =>', JSON.stringify(APP_VERSION));
console.log('______');
console.log('');
console.groupEnd();

// clearing the directory
rm(BUILD_DIR, err => {
  if (err) throw err;
});

console.group('Config:');
const envFileParsed = `./${envFile}`;
console.log('envFile =>', envFile);
console.log('envFileParsed =>', envFileParsed);

const envConfig = Dotenv.config({ path: envFileParsed }).parsed;
console.log('envConfig =>', envConfig);

const envKeys = Object.keys(envConfig).reduce((prev, next) => {
  // eslint-disable-next-line no-param-reassign
  prev[`process.env.${next}`] = JSON.stringify(envConfig[next]);
  return prev;
}, {});

const FULL_ENV = {
  ...envKeys,
  'process.env.WEBPACK_MODE': JSON.stringify(mode),
  'process.env.APP_VERSION': JSON.stringify(APP_VERSION),
};

console.log('FULL_ENV =>', FULL_ENV);
console.log('');
console.groupEnd();

const plugins = [
  new WebpackManifestPlugin({
    removeKeyHash: /([a-f0-9]{1,32}\.?)/gi,
  }),

  new webpack.DefinePlugin(FULL_ENV),

  // runs type checking on a separate process to speed up the build
  new ForkTsCheckerWebpackPlugin({
    eslint: true,
    checkSyntacticErrors: true,
    memoryLimit: 4096,
  }),

  new HtmlWebpackPlugin({
    title: 'Superset dashboard plugin',
    minify: false,
    filename: 'index.html',
    meta: {
      charset: 'UTF-8',
      viewport: 'width=device-width, initial-scale=1, shrink-to-fit=no',
    },
    templateContent: ({ htmlWebpackPlugin }) =>
      getHtmlTemplate(htmlWebpackPlugin),
  }),
  new MiniCssExtractPlugin({
    filename: '[name].[hash].css',
    insert(linkTag) {
      const reference = document.querySelector('#some-element');
      if (reference) {
        reference.parentNode.insertBefore(linkTag, reference);
      }
    },
  }),
  new OptimizeCSSAssetsPlugin(),
];

if (!process.env.CI) {
  plugins.push(new webpack.ProgressPlugin());
}

const entry = {
  supersetDashboardPlugin: (ROOT_DIR, '/src/Superstructure/main.tsx'),
};

const output = {
  path: BUILD_DIR,
  publicPath: getPublicPath(isProd),
  filename: '[name].[hash].js',
  library: '[name]',
  libraryTarget: 'this',
};

const resolve = {
  modules: [ROOT_DIR, 'node_modules', ROOT_DIR],
  alias: {
    'react-dom': '@hot-loader/react-dom',
    // Force using absolute import path of some packages in the root node_modules,
    // as they can be dependencies of other packages via `npm link`.
    // Both `@emotion/core` and `@superset-ui/core` remember some globals within
    // module after imported, which will not be available everywhere if two
    // different copies of the same module are imported in different places.
    '@superset-ui/core': path.resolve(
      ROOT_DIR,
      './node_modules/@superset-ui/core',
    ),
    '@superset-ui/chart-controls': path.resolve(
      ROOT_DIR,
      './node_modules/@superset-ui/chart-controls',
    ),
  },
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  symlinks: false,
};

const babelLoader = {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true,
    // disable gzip compression for cache files
    // faster when there are millions of small files
    cacheCompression: false,
    plugins: ['emotion'],
    presets: [
      [
        '@emotion/babel-preset-css-prop',
        {
          autoLabel: 'dev-only',
          labelFormat: '[local]',
        },
      ],
    ],
  },
};

const rulesScripts = [
  {
    test: /\.tsx?$/,
    exclude: [/\.test.tsx?$/],
    use: [
      'thread-loader',
      babelLoader,
      {
        loader: 'ts-loader',
        options: {
          // transpile only in happyPack mode
          // type checking is done via fork-ts-checker-webpack-plugin
          happyPackMode: true,
          transpileOnly: true,
          // must override compiler options here, even though we have set
          // the same options in `tsconfig.json`, because they may still
          // be overriden by `tsconfig.json` in node_modules subdirectories.
          compilerOptions: {
            esModuleInterop: false,
            importHelpers: false,
            module: 'esnext',
            target: 'esnext',
          },
        },
      },
    ],
  },
  {
    test: /\.js?$/,
    // include source code for plugins, but exclude node_modules and test files within them
    exclude: [/superset-ui.*\/node_modules\//, /\.test.js?$/],
    include: [
      new RegExp(`${ROOT_DIR}/src`),
      /superset-ui.*\/src/,
      new RegExp(`${ROOT_DIR}/.storybook`),
    ],
    use: [babelLoader],
  },
  {
    test: /\.jsx?$/,
    // include source code for plugins, but exclude node_modules and test files within them
    exclude: [/superset-ui.*\/node_modules\//, /\.test.jsx?$/],
    include: [
      new RegExp(`${ROOT_DIR}/src`),
      /superset-ui.*\/src/,
      new RegExp(`${ROOT_DIR}/.storybook`),
      /@encodable/,
    ],
    use: [babelLoader],
  },
];

const config = {
  entry,
  output,
  resolve,
  plugins,
  context: ROOT_DIR, // to automatically find tsconfig.json
  module: {
    rules: [
      ...rulesScripts,
      ...rulesStyles(ROOT_DIR, isProd),
      ...rulesStaticAssets(ROOT_DIR),
    ],
  },
  node: {
    fs: 'empty',
  },
  performance: {
    hints: false,
  },
  externals: {
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': true,
  },
  devtool: !isProd ? 'inline-source-map' : false,
  target: 'web',
  stats: 'minimal',
  // example to do it all in 1 css file
  // optimization: {
  //   splitChunks: {
  //     cacheGroups: {
  //       styles: {
  //         name: 'styles',
  //         chunks: 'all',
  //         enforce: true,
  //       },
  //     },
  //   },
  // },
};

if (!isProd) {
  config.devServer = {
    historyApiFallback: true,
    hot: true,
    stats: 'minimal',
    overlay: true,
    port,
    writeToDisk: true,
    contentBase: path.join(process.cwd(), DEV_OUTPUT_FOLDER),
  };

  // make sure to use @emotion/* modules in the root directory
  fs.readdirSync(path.resolve(ROOT_DIR, './node_modules/@emotion'), pkg => {
    config.resolve.alias[pkg] = path.resolve(
      ROOT_DIR,
      './node_modules/@emotion',
      pkg,
    );
  });

  // find all the symlinked plugins and use their source code for imports
  let hasSymlink = false;
  Object.entries(packageConfig.dependencies).forEach(([pkg, version]) => {
    const srcPath = `./node_modules/${pkg}/src`;
    if (/superset-ui/.test(pkg) && fs.existsSync(srcPath)) {
      console.log(
        `[Superset Plugin] Use symlink source for ${pkg} @ ${version}`,
      );
      // only allow exact match so imports like `@superset-ui/plugin-name/lib`
      // and `@superset-ui/plugin-name/esm` can still work.
      config.resolve.alias[`${pkg}$`] = `${pkg}/src`;
      delete config.resolve.alias[pkg];
      hasSymlink = true;
    }
  });

  if (hasSymlink) console.log(''); // pure cosmetic new line
}

// Speed measurement is disabled by default
// Pass flag --measure=true to enable
// e.g. npm run build -- --measure=true
const smp = new SpeedMeasurePlugin({
  disable: !measure,
});

module.exports = smp.wrap(config);
