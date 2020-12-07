const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //分离css
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin'); //压缩图片

const {projectPath} = require("../package.json");
let publicPath = process.env.NODE_ENV === "development" ? 'css' :`//static8.baihe.com/${projectPath}`
// 复用loader
const commonCssLoader = [
  {
    loader: MiniCssExtractPlugin.loader,
    options: {
      publicPath: publicPath,
    },
  },
  'css-loader',
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: [
          [
            "postcss-preset-env",
            {
              // Options
            },
          ],
        ],
      },
    },
  },
];

// 复用loader
const commonJsLoader = [
  {
    loader: 'babel-loader',
    options: {
      presets: [
        [
          '@babel/preset-env',
          {
            useBuiltIns: 'usage',
            corejs: { version: 3 },
            targets: {
              chrome: '50',
              firefox: '50',
              ie:'8',
              safari:'10',
              edge:'10'
            }
          }
        ]
      ],
      plugins: [[
          '@babel/plugin-transform-runtime',
          {
              corejs: { version: 3 } // 指定 runtime-corejs 的版本，目前有 2 3 两个版本
          }
      ]],
      // 开启babel缓存
      // 第二次构建时，会读取之前的缓存
      cacheDirectory: true
    }
  }
];

const rules = [
  {
    oneOf: [
      {
        test: /\.css$/,
        use: [...commonCssLoader]
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          ...commonCssLoader,
          // Compiles Sass to CSS
          {
            loader: "sass-loader",
            options: {
              implementation: require("sass"),
              sassOptions: {
                fiber: false,
                outputStyle: "expanded",
              },
              additionalData: "@import './node_modules/base_mixins/_base_mixins.scss';",
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [...commonCssLoader, 'less-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [...commonJsLoader]
      },
      {
        test: /\.(ts|tsx)?$/,
        use: [
          ...commonJsLoader,
          'ts-loader'
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'image/[name].[ext]',
            },
          },
          {
            loader: ImageMinimizerPlugin.loader,
            options: {
              cache: true,
              filter: (source, sourcePath) => {
                // The `source` argument is a `Buffer` of source file
                // The `sourcePath` argument is an absolute path to source
                if (source.byteLength < 8192) {
                  return false;
                }

                return true;
              },
              minimizerOptions: {
                plugins: [
                  ['gifsicle', { interlaced: true }],
                  ['jpegtran', { progressive: true }],
                  ['optipng', { optimizationLevel: 5 }],
                  [
                    'svgo',
                    {
                      plugins: [
                        {
                          removeViewBox: false,
                        },
                      ],
                    },
                  ],
                ],
              },
            },
          }
        ],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
        options: {
          
        }
      },
      {
        exclude: /\.(css|js|html|ts|sass|scss|less)$/,
        loader: 'file-loader',
      },
    ],  
  }
];

module.exports = rules;