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
const Acorn = require( 'acorn' );
const AcornWalk = require( 'acorn-walk' );

module.exports = Toolkit.module( ModuleGlobals => {
    const fss = ModuleGlobals.IO.FileSystem;
    const pth = ModuleGlobals.IO.Path;
    return class SupersetManager {
        constructor ( transitInstance ) {
            this.transit = transitInstance;
            this.supersets = {};
        }
        EnableSuperset ( ...supersets ) {
            const ssctx = this.transit.get.supersets();
            for ( const superset of supersets ) {
                if ( this.supersets[ superset ] ) continue;
                if ( !ssctx[ superset ] )
                    throw new ModuleGlobals.Errors.SupersetNotFoundError( `Requested superset with the name '${ superset }' is not found` );
                this.supersets[ superset ] = ssctx[ superset ];
            }
            return true;
        }
        DisableSuperset ( ...supersets ) {
            for ( const superset of supersets ) {
                if ( !this.supersets[ superset ] ) continue;
                this.supersets[ superset ] = undefined;
            }
            return true;
        }
        GetContext () {
            // Reference this context
            const that = this;

            // Library
            const acorn = Acorn.Parser.extend(
                ...Object.values( this.supersets ).map(
                    e => (
                        e.plugins
                        ? e.plugins.map( x => x( Acorn ) )
                        : undefined
                    )
                ).filter( e => e )
            );

            // Original Functions
            const acornParse = acorn.parse, acornParseExp = acorn.parseExpressionAt;

            // Pretransformed walkers
            const simpleWalkers = {};
            const fullWalkers = [];
            const sections = Object.values( that.supersets );
            sections.forEach( e => {
                if ( e?.walker?.length ) {
                    // This is a simple walker
                    e.walker.forEach( walker => {
                        Object.entries( walker ).forEach( ( [ nodeName, callback ] ) => {
                            if ( !simpleWalkers[ nodeName ] ) return simpleWalkers[ nodeName ] = [ callback ];
                            simpleWalkers[ nodeName ].push( callback );
                        } )
                    } )
                } else {
                    // this is a full walker, directly add it
                    fullWalkers.push( e );
                }
            } );
            let pack = Object.fromEntries(
                Object.entries( simpleWalkers ).map( e => [
                    e[ 0 ],
                    function ( ...args ) {
                        e[ 1 ].forEach( x => x.call( this, ...args ) )
                    }
                ] )
            );

            // Hooked Functions
            acorn.parse = function ( ...args ) {
                const output = acornParse.call( acorn, ...args );
                if ( sections.length > 0 ) AcornWalk.simple( output, pack );
                if ( fullWalkers.length > 0 ) fullWalkers.forEach( e => AcornWalk.fullAncestor( output, e ) );
                return output;
            }
            acorn.parseExpressionAt = function ( ...args ) {
                const output = acornParseExp.call( acorn, ...args );
                if ( sections.length > 0 ) AcornWalk.simple( output, pack );
                if ( fullWalkers.length > 0 ) fullWalkers.forEach( e => AcornWalk.fullAncestor( output, e ) );
                return output;
            }

            // Extras
            acorn.inspectRequires = function ( aAST, mapper ) {
                // Hold a list of require elements.
                const requires = [];

                // Create a walker
                const walker = node => {
                    if (
                        node.callee &&
                        node.callee.type == 'Identifier' &&
                        node.callee.name == 'require' &&
                        node.arguments[ 0 ].type == 'Literal'
                    ) {
                        requires.push( node.arguments[ 0 ].value );
                        node.arguments[ 0 ].value = mapper( node.arguments[ 0 ].value, node );
                    }
                    else if ( node.source ) {
                        requires.push( node.source.value );
                        node.source.value = mapper( node.source.value, node );
                    };
                }

                // After defining a walker, let's use it :3
                AcornWalk.simple( aAST, {
                    CallExpression: walker,
                    ImportDeclaration: walker,
                    ExportAllDeclaration: walker,
                    ExportNamedDeclaration: walker
                } );

                // After inspecting, return all the elements
                return requires;
            }
            acorn.packageTypes = {
                '.js': { type: 'script' },
                '.mjs': { type: 'script' },
                '.json': { type: 'object' },
                ...ModuleGlobals.ITransit.get.extensions()
            };
            acorn.fetchPackage = source => {

                // Make sure that the file exists
                if ( !fss.existsSync( source ) ) {
                    for ( const [ ext, details ] of Object.entries( acorn.packageTypes ) )
                        if ( fss.existsSync( source + ext ) )
                            return { type: details.type, url: source + ext }
                    return { type: false };
                }

                // If it is a directory, do more checks
                const lstat = fss.lstatSync( source );
                if ( lstat.isFile() ) {
                    for ( const [ ext, details ] of Object.entries( acorn.packageTypes ) )
                        if ( source.endsWith( ext ) )
                            return { type: details.type, url: source }
                    return { type: false };
                } else if ( lstat.isDirectory() ) {
                    // We need to gather data from the package.json
                    const ePackag = fss.existsSync( pth.join( source, 'package.json' ) );
                    if ( !ePackag ) {
                        for ( const [ ext, details ] of Object.entries( acorn.packageTypes ) )
                            if ( fss.existsSync( 'index' + ext ) )
                                return { type: details.type, url: 'index' + ext }
                        return { type: false };
                    } else {
                        let pkgjson = {};
                        try {
                            pkgjson = JSON.parse( fss.readFileSync( pth.join( source, 'package.json' ), { encoding: 'utf-8' } ) );
                        } catch (error) { return { type: false } }
                        if ( pkgjson.browser )
                            return { type: 'script', url: pth.join( source, pkgjson.browser ) }
                        if ( pkgjson.main )
                            return { type: 'script', url: pth.join( source, pkgjson.main ) }
                    }
                }
            }

            // Return the instance
            return acorn;
        }
    }
} );
