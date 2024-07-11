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
            gen = ModuleGlobals.Code.Generator,
            clr = ModuleGlobals.ANSI;
    return {
        name: 'tbn.compile',
        options: {
            environment: {},
            main: 'index.js',
            sourceDir: '',
            outputDir: 'build',
            relaxed: false,
            outscope: {
                enabled: false,
                outputDir: 'libs.tbn/'
            },
            superset: [ 'esconv' ],
            watermark: ''
        },
        action ( path, document, transits ) {
            // Log the operation we are about to perform.
            const featureList = Object.entries( {
                "Superset": !( document.superset.length === 1 && document.superset[ 0 ] === 'esconv' ) || document.superset.length > 1,
                "ESConv": document.superset.includes( 'esconv' ),
                "Outscope": document.outscope?.enabled ?? false
            } ).map( ( [ key, val ] ) => val ? clr.magenta( key ) : undefined ).filter( e => !!e );
            con.log( `Started ${ clr.cyan( 'Compile' ) } Operation.` ).onto( ifc => {
                ifc.next.log( `Path: ${ clr.yellow( path ) }` );
                ifc.end.log( `Features: ${
                    featureList.length > 0 ? featureList.join( ', ' ) : clr.gray( 'None' )
                }` );
            } ); con.newline();
            
            // Define the paths
            const sourcePath   = pth.normalize( document.sourceDir ? pth.join( path, document.sourceDir ) : path );
            const buildPath    = pth.join( path, document.outputDir );
            const coLibPath    = pth.join( sourcePath, document.outscope?.outputDir ?? 'libs.tbn/' );
            const mainFilePath = pth.join( sourcePath, document.main );
            
            if ( !fss.existsSync( mainFilePath ) )
                throw new ModuleGlobals.Errors.MainFileDoesNotExitError( 'Main file does not exist. Aborting.' );
            
            // Use the superset manager
            const superset = new ITabaneLibs.SupersetManager( ITabaneLibs.TransitInterface );
            superset.EnableSuperset( ...document.superset );
            
            // Get the code generator
            const acorn = superset.GetContext();
            
            // Format the watermark
            if ( document.watermark !== '' )
                document.watermark = `/*\n${ document.watermark.trim().split( '\n' ).map( e => '\t' + e ).join( '\n' ) }\n*/\n\n`;
            
            // Create a base log instance
            const bcon = con.log( `${ clr.cyan( 'Compiling' ) } files.` );
            
            // Define a base Acorn configuration
            const aconf = {
                ecmaVersion: 'latest',
                sourceType: 'module',
                allowHashBang: true
            };
            
            // If we are in relaxed mode, don't be strict
            if ( document.relaxed ) {
                aconf.allowReserved = true;
                aconf.allowReturnOutsideFunction = true;
                aconf.allowImportExportEverywhere = true;
                aconf.allowAwaitOutsideFunction = true;
            }
            
            // Parse the entire requirement tree and
            // perform caching to prevent infinite
            // loops
            const conversionCache = {};
            function RecursiveRequireWalk ( rPath, absPath ) {
                // If we have the path in the cache, return it lol
                if ( rPath !== mainFilePath && conversionCache[ rPath ] ) return;
                
                // Write a log that we are currently processing
                // the given file.
                bcon.next.log( `Processing ${ clr.yellow( rPath.replace( sourcePath, '.' ) ) }` );
                
                // Gather the code's AST by given path
                const AST = acorn.parse(
                    fss.readFileSync(
                        rPath,
                        { encoding: 'utf-8' }
                    ), aconf
                );
                
                // Walk through the require/import statements
                acorn.inspectRequires( AST, value => {
                    const absLoc = acorn.fetchPackage( value.startsWith( '/' ) ? value : pth.join( rPath, '../' , value ) );
                    if ( !absLoc.type || ( !absLoc.url.includes( sourcePath ) && !document.outscope?.enabled ) )
                        return value;
                    const copyPath =    !absLoc.url.includes( sourcePath )
                                        ? pth.join( 
                                            coLibPath,
                                            pth.basename( value.endsWith( '.js' ) ? value : value + '.js' )
                                        ) : absLoc.url
                    RecursiveRequireWalk( absLoc.url, copyPath );
                    conversionCache[ absLoc.url ] = true;
                    const newPath = pth.relative( pth.dirname( rPath ), copyPath );
                    return !newPath.startsWith( '.' ) && !newPath.startsWith( '/' ) ? `./${ newPath }` : newPath;
                } );
                
                // After iteration, transform the path
                // if possible and write the changes.
                const copyPath = pth.join( buildPath, ( absPath ?? mainFilePath ).slice( sourcePath.length ) );
                fss.mkdirSync( pth.dirname( copyPath ), { recursive: true } );
                fss.writeFileSync(
                    copyPath,
                    document.watermark + gen.generate( AST, {
                        format: { compact: false },
                        env: document.environment ?? {}
                    } )
                )
            }
            
            // After recursive function definition, run
            // it against the main file.
            RecursiveRequireWalk( mainFilePath );
            
            // Write cute things
            bcon.end.log( 'Compilation is done.' );
            con.newline();
        }
    }
} );