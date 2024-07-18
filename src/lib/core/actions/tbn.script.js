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
            clr = ModuleGlobals.ANSI,
            vm  = ModuleGlobals.Process.JavascriptVM
    return {
        name: 'tbn.script',
        options: {
            scriptUrl: '',
            environment: {},
            skipOnError: false
        },
        action ( path, document ) {
            con.log( `Executing script ${ clr.yellow( document.scriptUrl ) }` );
            function runScript ( scriptURI ) {
                const modl = { exports: {} };
                const scriptUrl = scriptURI;
                const scriptDir = pth.join( scriptURI, '../' );
                const context = vm.createContext( {
                    ConsoleHost: con,
                    IO: ModuleGlobals.IO,
                    console,
                    Object,
                    CWD: path,
                    module: modl,
                    imports: function ( id ) {
                        return runScript( pth.join( scriptDir, id.endsWith( '.js' ) ? id : id + '.js' ) );
                    },
                    __filename: scriptUrl,
                    __dirname: scriptDir,
                    ...document.environment
                } );
                const script = new vm.Script( fss.readFileSync( scriptUrl, { encoding: 'utf-8' } ), { filename: scriptUrl } );
                script.runInContext( context );
                return modl.exports ?? modl;
            }
            runScript( pth.join( path, document.scriptUrl ) );
            return {};
        }
    }
} );
