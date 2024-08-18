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

const Toolkit = require( '../../shared/toolkit' );

module.exports = Toolkit.module( ModuleGlobals => {
    const   fss = ModuleGlobals.IO.FileSystem,
            pth = ModuleGlobals.IO.Path,
            con = ModuleGlobals.ConsoleHost,
            clr = ModuleGlobals.ANSI;
    return {
        name: 'fs.mkdir',
        options: {
            dir: 'build/release',
            skipOnError: true
        },
        action ( path, document ) {
            // Prepare paths
            const destination = pth.join( path, document.dir );
            
            // Check if the directory exists.
            const fexists = fss.existsSync( destination )
            
            // If skipping is not allowed, then do not
            // continue this procedure to prevent damage.
            if ( !document.skipOnError && fexists ) {
                con.error( `Directory creation operation cannot be done on ${ clr.yellow( document.destination ) } (skipOnError is disabled in project settings)` );
                process.exit( 17 );
            }
            
            // Log it up :3
            let csn = con.log( `Creating ${ clr.yellow( document.dir ) } directory.` ).end;
            if ( fexists ) csn.log( 'Directory exists, skipping.' );
            
            // Perform the copy operation.
            fss.mkdirSync( destination, { recursive: true } );
            
            // Return nothing hehe :3
            return {};
        }
    }
} );