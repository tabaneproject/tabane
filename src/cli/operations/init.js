/*
    Tabane, Javascript Project Manager
    Open-Source, BSD-2-Clause License
    
    Tabane is a Modularized Javascript Project Manager
    with built-in superset to boost your Javascript
    Experience. You can; bundle up your project
    for Web use, Compile your codes written in Tabane
    Super-set or perform certain file operations.
    
    Copyright (C) 2024 Botaro Shinomiya <citrizon@waifu.club>
    Copyright (C) 2024 OSCILLIX <oscillixonline@gmail.com>
    Copyright (C) 2024 Bluskript <bluskript@gmail.com>
    
    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions are met:
    
    *   Redistributions of source code must retain the above copyright
        notice, this list of conditions and the following disclaimer.
    *   Redistributions in binary form must reproduce the above copyright
        notice, this list of conditions and the following disclaimer in the
        documentation and/or other materials provided with the distribution.
    
    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
    AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
    ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
    DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
    (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
    LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
    ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
    (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
    THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE. 
*/

const inquirer = require( '@inquirer/prompts' );
const fs = Library.IO.FileSystem;
const path = Library.IO.Path;
const yaml = Library.IO.YAML;

module.exports = {
    command: 'init',
    description: 'create a configuration file',
    async action () {
        // Get current working directory and define
        // the configuration locations
        const cwd = process.cwd();
        const tbConfPath = path.join( cwd, 'tabane.yaml' );
        
        // Check if the file exists and make sure it's
        // in a correct format
        let operationExists = true;
        if ( !fs.existsSync( tbConfPath ) ) operationExists = false;
        
        // Get configuration details
        let document = {};
        try {
            document = yaml.parse( fs.readFileSync( tbConfPath, { encoding: 'utf-8' } ) );
            if ( !document.default ) {
                Conhost.warn( 'Configuration file \'tabane.yaml\' is most likely malformed, Init operation will continue.' );
                operationExists = false;
            }
        } catch ( error ) {
            // It means that it is in invalid format,
            // so evaporate the current garbage thing.
            operationExists = false;
        }
        
        // If the configuration is valid, then we
        // don't re-init the entire thing
        if ( operationExists ) {
            Conhost.warn( 'Hey, the configuration file already exists! Check https://github.com/tabaneproject/tabane/wiki for more info.' );
            process.exit( 2 );
        }

        // Ask the document type to the user
        const docType = await inquirer.select( {
            message: 'Select the operation mode',
            choices: [
                {
                    name: 'Single-Action Mode',
                    value: 0,
                    description: 'This operation mode will only perform one action.'
                },
                {
                    name: 'Multi-Action Mode',
                    value: 1,
                    description: 'This operation mode will perform multiple actions.'
                }
            ]
        } );
        
        // Write the yaml file
        document = {
            default: ( docType === 0 ? { action: 'tbn.compile' } : { actions: [ { action: 'tbn.compile' } ] } )
        }
        fs.writeFileSync( tbConfPath, '# This is a default tabane configuration file.\n# Check https://github.com/tabaneproject/tabane/wiki for more info.\n\n' + yaml.stringify( document ) );
        Conhost.log( 'Done! Check https://github.com/tabaneproject/tabane/wiki for more info.' );
    }
}