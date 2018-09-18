//require('@babel/polyfill');
const path = require('path');
const webpack = require('webpack');

const { VueLoaderPlugin } = require('vue-loader')
module.exports = {
	 entry : './src/main.js'
	,output : {
		 path		: __dirname +  '/dist/'
		,filename	: 'lib/js/bundle.js'
	}
	,devtool : 'source-map'
	,module : {
		rules : [
			 {
				test: /\.(png|jpg|gif|svg)$/,
      loader: 'file-loader',
      options: {
        name: '[name].[ext]?[hash]'
      }
            
        },
			{
				 test	: /\.vue$/
				,loader	: 'vue-loader'
 				,options: {
					loaders : {
					}
				}
			} 
			,{
                 test    : /\.css$/
                ,use    : ['style-loader', 'css-loader']
            }
		]
	}
	,plugins : [
    new VueLoaderPlugin()
	]
	,resolve : {
		alias : {
			 'vue'			: 'vue/dist/vue.js'
		//	,'vue-router'	: 'vue-router/dist/vue-router.js'
		}
	}	
}
