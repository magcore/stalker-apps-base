#!/usr/bin/env node

'use strict';


var exec = require('child_process').exec,
    fs   = require('fs');


exec('npm outdated', {cwd: process.cwd()}, function ( error, stdout, stderr ) {
    var packageJson = require('../package.json'),
        packages = stdout.split('\n');

    packages.shift();
    packages.pop();


    packages.forEach(function ( str ) {
        var module;

        str = str.replace(/( ){2,}/g, ' ').split(' ');

        module = {
            name: str[0],
            current: str[1],
            wanted: str[2],
            latest: str[3],
            location: str[4]
        };

        packageJson.dependencies[module.name] = module.latest;
        console.log('update package ' + module.name);
    });

    fs.writeFile('package.json', JSON.stringify(packageJson), function ( error ) {
        if ( error ) {
            process.exit(1);
        } else {
            console.log('unpublish');
            exec('npm unpublish -f', {cwd: process.cwd()}, function ( error ) {
                if ( error ) {
                    process.exit(1);
                } else {
                    console.log('publish');
                    exec('npm publish', {cwd: process.cwd()}, function ( error ) {
                        if ( error ) {
                            process.exit(1);
                        }
                    });
                }
            });
        }
    });
});
