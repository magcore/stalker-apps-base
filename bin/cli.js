#!/usr/bin/env node

/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';


var appHost = require('ip').address(),
    fs      = require('fs'),
    path    = require('path'),
    port    = process.argv[2] || 3000,
    methods = {
         config: function () {
             var configJson = {
                    options: {
                         pluginsPath: 'http://' + appHost + ':' + port + '/node_modules/',
                         stalkerHost: 'http://dev.sandbox.lpo.priv:80/',
                         appsPackagesPath: 'http://' + appHost + ':' + port + '/node_modules/',
                         stalkerApiPath: '/stalker_portal/api/v3/',
                         stalkerAuthPath: '/stalker_portal/auth/token.php',
                         stalkerLoaderPath: '/stalker_portal/c/',
                         stalkerApiHost: 'http://dev.sandbox.lpo.priv:80/stalker_portal/api/v3/',
                         stalkerAuthHost: 'http://dev.sandbox.lpo.priv:80/stalker_portal/auth/token.php',
                         sap: 'http://dev.sandbox.lpo.priv:80/stalker_portal/server/api/sap.php',
                         pingTimeout: 120000
                     },
                     themes: {
                     },
                     apps: [
                     ]
                 },
                 corePackageName;

             fs.readdir(path.join(process.cwd(), 'node_modules'), function ( error, items ) {
                 if ( !error ) {
                     items = items.filter(function ( dir ) {
                         return dir.indexOf('magcore') !== -1;
                     })
                     items.forEach(function ( item ) {
                         var packageJson = require(path.join(process.cwd(), 'node_modules', item, 'package.json'));

                         if ( packageJson.config && packageJson.config.type ) {
                             switch ( packageJson.config.type ) {
                                 case 'plugin':
                                     break;

                                 case 'theme':
                                     configJson.themes[packageJson.config.name] = 'http://' + appHost + ':' + port + '/node_modules/' + packageJson.name + '/';
                                     break;

                                 case 'core':
                                     corePackageName = packageJson.name;
                                     break;

                                 default:
                                     packageJson.config.dependencies = {};
                                     Object.keys(packageJson.dependencies).forEach(function ( name ) {
                                         packageJson.config.dependencies[name] = '';
                                     });
                                     packageJson.config.uris = packageJson.config.uris || {};
                                     packageJson.config.uris.entry = packageJson.config.uris.entry || 'index.html';
                                     packageJson.config.url = 'http://' + appHost + ':' + port + '/node_modules/' + packageJson.name + '/'
                                         + packageJson.config.uris.app + '/' + packageJson.config.uris.entry;
                                     packageJson.config.uris.app = 'http://' + appHost + ':' + port + '/node_modules/' + packageJson.name + '/'
                                         + packageJson.config.uris.app;
                                     configJson.apps.push(packageJson.config)
                                     break;

                             }
                         }
                     });

                     fs.writeFile(path.join(process.cwd(), 'node_modules', 'magcore-core', 'app', 'config.json'), JSON.stringify(configJson));
                     console.log('npm run run %port% and open ' + 'http://' + appHost + ':' + port + '/node_modules/magcore-core/app/index.html');
                 }
             });
         }
    };



methods.config();
