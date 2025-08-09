const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    // main options from here
    entry: './src/app/index.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true, // clean the directory dist before build
    },
    mode: 'development',
    // to here

    devtool: 'eval-cheap-module-source-map',
    // 'eval-cheap-module-source-map' is the fastest
    // inline-source-map is better for rare buGs
    devServer: {
        // open: true, /*auto open the browser*/
        port: 3000,
        hot: true, // hmr
        historyApiFallback: true, // for SPA routing
    },
    optimization: {
        splitChunks: {
            chunks: 'all', // puts shared libraries into a separate file
            // p.s separate - отдельный
        },
    },
    module: {
        rules: [
            {
                // ability to understand js/jsx/ts/tsx extensions
                // in names of files
                test: /\.[jt]sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ],
                    },
                },
            },
            {
                // css rules
                test: /\.module\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {modules: true, importLoaders: 1},
                    },
                ],
            },
            {
                test: /\.css$/,
                exclude: /\.module\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            {
                // png and fonts support
                test: /\.(png|jpe?g|gif|svg)$/,
                type: 'asset/resource',
            },
        ],
    },
    resolve: {
        // to avoid specifying the extension in imports
        // p.s extension - расширение
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    plugins: [
        // in production do css file
        new MiniCssExtractPlugin({filename: '[name].[contenthash].css'}),
        // do life easier with automatic <script> and <link> in main html file
        new HtmlWebpackPlugin({
            template: './src/app/index.html',
            favicon: path.resolve(__dirname, 'src/app/favicon.ico'),
        }),
    ],
};
