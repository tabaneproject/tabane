#!/usr/bin/env node

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

const { Tabane, Console, Package, Library } = require( '../lib/tabane' );
const { program, Command } = require( 'commander' );
const ConfigurationStore = require( './confstore' );
const TransitsStore = require( './transtore' );
const ifacepatch  = require( './ifcolor' );
const { homedir } = require( 'os' );

// Define some paths :3
const HomeDir = homedir(), CWD = process.cwd();

const Paths = {
    TabaneUserConfStore: Library.IO.Path.join( HomeDir, '.tabane' ),
    TabaneLocalConfStore: Library.IO.Path.join( CWD, '.tabane' )
};

// Prepare Configurations
global.Library = Library;
global.Configuration = new ConfigurationStore(
    {
        tty: {
            color: true,
            quiet: false
        }
    },
    Paths.TabaneUserConfStore,
    Paths.TabaneLocalConfStore
);

global.Transits = new TransitsStore(
    Library.IO.Path.join( Paths.TabaneUserConfStore,  'transits' ),
    Library.IO.Path.join( Paths.TabaneLocalConfStore, 'transits' )
)

// Create a Console Host
const Conhost = new Console.ConsoleInterface( Configuration.getConfig( 'tty.quiet' ) );

// Create Tabane Interface.
const ITabane = new Tabane( Conhost, Transits.transits );

// Make certain properties global since no one will be
// using the command line interface as a library
global.ITabane = ITabane;
global.Conhost = Conhost;
global.ITabaneLibs = ITabane.Libraries;

// Define certain utilities on-to-go
Object.prototype.onto = function ( f ) { f( this, this ); return this };

// Create a color setter for changing
// console dynamics based on ANSI support
global.ColorsEnable = bool => {
    const col = Console.Colors( bool );
    Console.CWrapper.Colors = col;
    Object.assign( Library.ANSI, col );
};

// Patch Commander Library
ColorsEnable( !process.argv.includes( '--no-color' ) && Configuration.getConfig( 'tty.color' ) );
ifacepatch( Command, Console.CWrapper.Colors );

// Get operations
const operations = [
    require( './operations/make' ),
    require( './operations/init' ),
    require( './operations/run' )
];

// Define the program
program
    .name( Package.name.split( '/' ).pop() )
    .description( Package.description )
    .version( Package.version )
    .option( '--no-color', 'Disable colors' );

// Append the commands to the program
for ( const operation of operations ) {
    const cmd = program.command( operation.command ).description( operation.description ?? '<no information given>' );
    if ( operation.action ) cmd.action( operation.action );
}

// Parse the program
program.parse();