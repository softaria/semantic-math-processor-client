const path = require('path');  

const isProd = (process.env.NODE_ENV === 'production');
const TerserPlugin = require('terser-webpack-plugin');


function getOptimizations() {
    const optimizations = {};

    if (isProd) {
        optimizations.namedModules = false;
        optimizations.namedChunks = false;
        optimizations.nodeEnv = 'production';
        optimizations.flagIncludedChunks = true;
        optimizations.occurrenceOrder = true;
        optimizations.sideEffects = true;
        optimizations.usedExports = true;
        optimizations.concatenateModules = true;
        optimizations.splitChunks = {};
        optimizations.splitChunks.hidePathInfo = true;
        optimizations.splitChunks.minSize = 30000;
        optimizations.splitChunks.maxAsyncRequests = 5;
        optimizations.splitChunks.maxInitialRequests = 3;
        optimizations.noEmitOnErrors = true;
        optimizations.checkWasmTypes = true;

        optimizations.minimize = true;
        optimizations.minimizer = [new TerserPlugin()];
    }

    return optimizations;
}

module.exports = [{
    name: "semantic-math-processor-client",
    mode: isProd ? 'none' : 'development',

    entry: {
        index: path.join(__dirname, 'src', 'semantic-math-processor-client.ts'),
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'SemanticMathProcessorClient',
        umdNamedDefine: true,
    },
    module: {
        rules: [
            {
                test: /.ts$/,
                exclude: [
                    path.resolve(__dirname, 'node_modules'),
                ],
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    externals: {
        'semantic-math-editor': {
            commonjs: 'semantic-math-editor',
            commonjs2: 'semantic-math-editor',
            amd: 'semantic-math-editor',
            umd: 'semantic-math-editor',
            root: 'SemanticMathEditor'
        }
    },
    
   

    optimization: getOptimizations(),

    resolve: {
        extensions: ['.json', '.ts', '.js', '.css']
    },

    devtool: 'source-map',
    devServer: {
        publicPath: path.join('/dist/')
    }
}];
