const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


let config = {
    mode: process.env.NODE_ENV || 'development',
    // entry specified in gulpfile.js
    output: {
        filename: '[name].js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                // commons: {
                //     // use common.js as common chunk
                //     name: 'common',
                //     chunks: "initial",
                //     minChunks: 2,
                //     maxInitialRequests: 5, // The default limit is too small to showcase the effect
                //     minSize: 0, // This is example is too small to create commons chunks
                //     enforce: true,
                // },
                vendor: {
                    test: /node_modules/,
                    minChunks: 2,
                    chunks: "initial",
                    name: "vendor",
                    // priority: 10,
                    // enforce: true
                }
            }
        }
    },
    resolve: {
        alias: {
            // 'swiper$': 'swiper/dist/js/swiper.jquery.js',
        },
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: 'tmp/babel-cache/',
                    }
                }
            },
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            }
        }),
    ],
    performance: {
        hints: false
    },
};

if (process.env.WEBPACK_ENV === 'analyze') {
    let timestamp = Math.floor(Date.now() / 1000); // seconds
    config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        defaultSizes: 'parsed',
        generateStatsFile: true,
        reportFilename: `tmp/webpack-analyzer/report-${timestamp}.html`,
        statsFilename: `tmp/webpack-analyzer/report-${timestamp}.json`,
    }));
}


module.exports = config;
