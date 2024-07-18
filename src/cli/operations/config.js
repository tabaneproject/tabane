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

module.exports = {
    command: 'config',
    description: 'Configuration Operations',
    options: [
        { flags: '-g, --global', description: 'Change global options.', defaultValue: false }
    ],
    subactions: [
        {
            command: 'init',
            description: 'Initialize or inherit a configuration file for your project or system-wide',
            action () {
                const   UserConfPath  = Paths.TabaneUserConfStore,
                        LocalConfPath = Paths.TabaneLocalConfStore,
                        ProjectPath   = Library.IO.Path.join( Paths.CWD, 'tabane.yaml' );
                const targetPath = Library.IO.FileSystem.existsSync( ProjectPath ) ? LocalConfPath : UserConfPath;
                if ( Library.IO.FileSystem.existsSync( targetPath ) ) {
                    Conhost.warn( `Warning: You already have a configuration file in your ${ targetPath === LocalConfPath ? 'project' : 'system.' }. \n            Aborting procedure.` );
                    process.exit( 121 );
                }
                const targetDir = Library.IO.Path.join( targetPath, '../' );
                if ( !Library.IO.FileSystem.existsSync( targetDir ) )
                    Library.IO.FileSystem.mkdirSync( targetDir, { recursive: true } );
                Library.IO.FileSystem.cpSync( UserConfPath, LocalConfPath );
            }
        },
        {
            command: 'list',
            description: 'List the keys and values in the configuration',
            action () {
                const opts = this.parent._optionValues;
                const   UserConfPath  = Paths.TabaneUserConfStore,
                        LocalConfPath = Paths.TabaneLocalConfStore,
                        ProjectPath   = Library.IO.Path.join( Paths.CWD, 'tabane.yaml' );
                const targetPath = opts.global ? UserConfPath : Library.IO.FileSystem.existsSync( ProjectPath ) ? LocalConfPath : UserConfPath;
                if ( targetPath === LocalConfPath && !Library.IO.FileSystem.existsSync( LocalConfPath ) ) {
                    Conhost.error( `Error: You do not have a configuration file in your project.\n          To initialize a configuration file, run '${ Library.ANSI.green( 'tabane config init' ) }'` );
                    process.exit( 120 );
                }
                const conf = Configuration.listConfig( Library.IO.Path.join( targetPath, '../' ) );
                const confKeys = Object.keys( conf );
                const maxPadLength = confKeys.reduce( ( a, b ) => a.length > b.length ? a : b ).length;
                confKeys.forEach( e => {
                    console.log( Library.ANSI.yellow( ( e ).padEnd( maxPadLength ) ) + '  ->  ' +  Library.ANSI.green( conf[ e ] ) );
                } );
            }
        },
        {
            command: 'edit <key> <value>',
            description: 'Edit a certain key in the configuration',
            action ( key, value ) {
                const opts = this.parent._optionValues;
                const   UserConfPath  = Paths.TabaneUserConfStore,
                        LocalConfPath = Paths.TabaneLocalConfStore,
                        ProjectPath   = Library.IO.Path.join( Paths.CWD, 'tabane.yaml' );
                const targetPath = opts.global ? UserConfPath : Library.IO.FileSystem.existsSync( ProjectPath ) ? LocalConfPath : UserConfPath;
                if ( targetPath === LocalConfPath && !Library.IO.FileSystem.existsSync( LocalConfPath ) ) {
                    Conhost.error( `Error: You do not have a configuration file in your project.\n          To initialize a configuration file, run '${ Library.ANSI.green( 'tabane config init' ) }'` );
                    process.exit( 120 );
                }
                Configuration.setConfig( Library.IO.Path.join( targetPath, '../' ), key, value );
                Conhost.log( `Edited key ${ Library.ANSI.yellow( key ) } in ${ Library.ANSI.magenta( 'global' ) } scope to ${ Library.ANSI.green( value ) }` );
            }
        },
        {
            command: 'delete <key>',
            description: 'Delete a certain key in the configuration',
            action ( key ) {
                const opts = this.parent._optionValues;
                const   UserConfPath  = Paths.TabaneUserConfStore,
                        LocalConfPath = Paths.TabaneLocalConfStore,
                        ProjectPath   = Library.IO.Path.join( Paths.CWD, 'tabane.yaml' );
                const targetPath = opts.global ? UserConfPath : Library.IO.FileSystem.existsSync( ProjectPath ) ? LocalConfPath : UserConfPath;
                if ( targetPath === LocalConfPath && !Library.IO.FileSystem.existsSync( LocalConfPath ) ) {
                    Conhost.error( `Error: You do not have a configuration file in your project.\n          To initialize a configuration file, run '${ Library.ANSI.green( 'tabane config init' ) }'` );
                    process.exit( 120 );
                }
                Configuration.setConfig( Library.IO.Path.join( targetPath, '../' ), key, undefined );
                Conhost.log( `Deleted key ${ Library.ANSI.yellow( key ) } in ${ Library.ANSI.magenta( 'global' ) } scope` );
            }
        }
    ]
}


