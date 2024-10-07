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

const fs = Library.IO.FileSystem;
const path = Library.IO.Path;
const yaml = Library.IO.YAML;

module.exports = {
    command: 'make [preset]',
    description: 'run actions based on preset name',
    action ( preset = 'default' ) {
        const opts = this.parent._optionValues;

        // Get current working directory and define
        // the configuration locations
        const cwd = process.cwd();
        const tbConfPath = path.join( cwd, 'tabane.yaml' );

        // Here's a list of blacklisted preset names that
        // are reserved by the Tabane CLI
        const blacklistedPresetNames = {
            '': new Error( 'Given preset name is reserved for global definitions. Please use a different preset name than an empty string' )
        };

        // Check if we're dealing with a blacklisted preset
        // name, and if so throw their errors
        if ( blacklistedPresetNames[ preset ] ) {
            if ( opts.debug )
                throw blacklistedPresetNames[ preset ];
            Conhost.error( blacklistedPresetNames[ preset ].message ?? 'An error has occurred and I have no idea what happened. Aborting process.' );
            process.exit( 29 );
        }

        // Check if the file exists and make sure it's
        // in a correct format
        let document = {};
        if (
            !fs.existsSync( tbConfPath ) ||
            (
                () => {
                    try {
                        document = yaml.parse( fs.readFileSync( tbConfPath, { encoding: 'utf-8' } ) );
                        return false;
                    } catch (error) {
                        return true;
                    }
                }
            )()
        ) {
            Conhost.error( 'Project file (tabane.yaml) doesn\'t exist,\n   You might want to try using \'tabane init\'\n   Aborting.' );
            process.exit( 3 );
        }

        // Check if preset exists. If not, abort the process.
        if ( !document[ preset ] ) {
            Conhost.error( `Preset with the name '${ preset }' does not exists. Available presets in this project are ${ Object.entries( document ).map( e => "'" + e[ 0 ] + "'" ).join( ', ' ) }. Aborting.` );
            process.exit( 12 );
        }

        // Create the document
        let IDocument = {};
        if ( opts.debug )
            IDocument = new ITabane.Libraries.DocumentModels.TabaneProjectDocument( document[ preset ], document, null, document[ '' ] );
        else {
            try {
                IDocument = new ITabane.Libraries.DocumentModels.TabaneProjectDocument( document[ preset ], document, null, document[ '' ] );
            } catch (error) {
                Conhost.error( error.message ?? 'An error has occurred and I have no idea what happened. Aborting process.' );
                process.exit( 24 );
            }
        }

        // Log the make preset and perform operations
        Conhost.log( `Make Preset: ${ Library.ANSI.gray( preset ) }` );
        if ( opts.debug )
            return IDocument.perform( cwd );
        try {
            IDocument.perform( cwd );
        } catch (error) {
            Conhost.error( 'Error:', error.message ?? 'An error has occurred and I have no idea what happened. Aborting process.' );
            process.exit( 29 );
        }
    }
}
