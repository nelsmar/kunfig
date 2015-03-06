'use strict';

var _ = require('lodash'),
	path = require('path');

// See if the user supplied a environment, if not use the default
var defaultEnv = 'development';
var env = process.env.NODE_ENV || defaultEnv;

function kunfig(dir) {
	if(dir) {
		dir = path.join('../../', dir) + '/';
	} else {
		dir = '../../config/env/'
	}

	this.dir = dir;
	this.configDefault = this.loadEnv('default');
}

kunfig.prototype.configDefault = {};

var config = {};


// This will merge the "all.js" config with our current environment config
kunfig.prototype.loadEnv = function loadEnv(env) {

	// Merge will deep merge any objects.
	// The requested config will over-write any of the configDefault properties
	return _.merge(
		this.configDefault,
		require(this.dir + env) || {}
	);
}

kunfig.prototype.loadConfig = function loadConfig() {

	var config;
	// Attempt to load the requested environment config
	try {
		config = this.loadEnv(env);
	} catch(e) {

		// If we received module not found then the file likely doesn't exist
		if(e.code === 'MODULE_NOT_FOUND') {
			console.error('Unable to find config ' + this.dir + ' ' + env + '.js');
			console.error('Loading default config: "' + defaultEnv + '"" instead');	
			
			// Attempt to load the default config
			try {
				config = this.loadEnv(defaultEnv);
			} catch(e) {

				// If the file wasnt found lets toss an error explaining so
				if(e.code === 'MODULE_NOT_FOUND') {
					throw new Error('Unable to find default config file: ' + this.dir + defaultEnv + '.js');
				} else {

					// Otherwise throw the original error
					throw e;
				}
			}
		} else {

			// If we did nto receive a module not found, toss the original error
			throw e;
		}
	}

	// Return an object that contains a new configPath funciton that generates a new kunfig
	// And merge it with our current config
	return _.merge({
		configPath: function(dir) {
			return new kunfig(dir).loadConfig();
		}}, 
	config);
}

module.exports = new kunfig().loadConfig();