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

// Premade Transits for Bundle Require Management
function TabaneBundleRequireTransit ( ASTTools, ASTCollection, ASTMainPointer ) {
    // This is the first section of this transit.
    // This AST is generated using https://astexplorer.net/
    // This is the original code:
    //
    // const __tabane_require = ( function () {
    //     const files = {};
    //     return function (name) {
    //         if ( files[ name ] ) {
    //             let mdl = { exports: {} };
    //             files[ name ]( mdl, mdl.exports );
    //             return mdl.exports.default ?? mdl.exports;
    //         } else throw new Error( 'Required Tabane Module is not found. This shouldn\'t be happening since this is a pretty unexpected behavior. Aborting execution.' );
    //     };
    // } )()
    let section1 = {
        "type": "VariableDeclaration",
        "declarations": [
            {
                "type": "VariableDeclarator",
                "id": {
                    "type": "Identifier",
                    "name": "__tabane_require"
                },
                "init": {
                    "type": "CallExpression",
                    "callee": {
                        "type": "FunctionExpression",
                        "id": null,
                        "expression": false,
                        "generator": false,
                        "async": false,
                        "params": [],
                        "body": {
                            "type": "BlockStatement",
                            "body": [
                                {
                                    "type": "VariableDeclaration",
                                    "declarations": [
                                        {
                                            "type": "VariableDeclarator",
                                            "id": {
                                                "type": "Identifier",
                                                "name": "files"
                                            },
                                            "init": {
                                                "type": "ObjectExpression",
                                                "properties": Object.entries( ASTCollection ).map( ( [ AbsPath, AST ] ) => ASTTools.PropertyNode(
                                                    AST.pointer,
                                                    ASTTools.BundleParcelFunctionNode( AST.contents.body )
                                                ) )
                                            }
                                        }
                                    ],
                                    "kind": "const"
                                },
                                {
                                    "type": "ReturnStatement",
                                    "argument": {
                                        "type": "FunctionExpression",
                                        "id": null,
                                        "expression": false,
                                        "generator": false,
                                        "async": false,
                                        "params": [
                                            {
                                                "type": "Identifier",
                                                "name": "name"
                                            }
                                        ],
                                        "body": {
                                            "type": "BlockStatement",
                                            "body": [
                                                {
                                                    "type": "IfStatement",
                                                    "test": {
                                                        "type": "MemberExpression",
                                                        "object": {
                                                            "type": "Identifier",
                                                            "name": "files"
                                                        },
                                                        "property": {
                                                            "type": "Identifier",
                                                            "name": "name"
                                                        },
                                                        "computed": true,
                                                        "optional": false
                                                    },
                                                    "consequent": {
                                                        "type": "BlockStatement",
                                                        "body": [
                                                            {
                                                                "type": "VariableDeclaration",
                                                                "declarations": [
                                                                    {
                                                                        "type": "VariableDeclarator",
                                                                        "id": {
                                                                            "type": "Identifier",
                                                                            "name": "mdl"
                                                                        },
                                                                        "init": {
                                                                            "type": "ObjectExpression",
                                                                            "properties": [
                                                                                {
                                                                                    "type": "Property",
                                                                                    "method": false,
                                                                                    "shorthand": false,
                                                                                    "computed": false,
                                                                                    "key": {
                                                                                        "type": "Identifier",
                                                                                        "name": "exports"
                                                                                    },
                                                                                    "value": {
                                                                                        "type": "ObjectExpression",
                                                                                        "properties": []
                                                                                    },
                                                                                    "kind": "init"
                                                                                }
                                                                            ]
                                                                        }
                                                                    }
                                                                ],
                                                                "kind": "let"
                                                            },
                                                            {
                                                                "type": "ExpressionStatement",
                                                                "expression": {
                                                                    "type": "CallExpression",
                                                                    "callee": {
                                                                        "type": "MemberExpression",
                                                                        "object": {
                                                                            "type": "Identifier",
                                                                            "name": "files"
                                                                        },
                                                                        "property": {
                                                                            "type": "Identifier",
                                                                            "name": "name"
                                                                        },
                                                                        "computed": true,
                                                                        "optional": false
                                                                    },
                                                                    "arguments": [
                                                                        {
                                                                            "type": "Identifier",
                                                                            "name": "mdl"
                                                                        },
                                                                        {
                                                                            "type": "MemberExpression",
                                                                            "object": {
                                                                                "type": "Identifier",
                                                                                "name": "mdl"
                                                                            },
                                                                            "property": {
                                                                                "type": "Identifier",
                                                                                "name": "exports"
                                                                            },
                                                                            "computed": false,
                                                                            "optional": false
                                                                        }
                                                                    ],
                                                                    "optional": false
                                                                }
                                                            },
                                                            {
                                                                "type": "ReturnStatement",
                                                                "argument": {
                                                                    "type": "LogicalExpression",
                                                                    "left": {
                                                                        "type": "MemberExpression",
                                                                        "object": {
                                                                            "type": "MemberExpression",
                                                                            "object": {
                                                                                "type": "Identifier",
                                                                                "name": "mdl"
                                                                            },
                                                                            "property": {
                                                                                "type": "Identifier",
                                                                                "name": "exports"
                                                                            },
                                                                            "computed": false,
                                                                            "optional": false
                                                                        },
                                                                        "property": {
                                                                            "type": "Identifier",
                                                                            "name": "default"
                                                                        },
                                                                        "computed": false,
                                                                        "optional": false
                                                                    },
                                                                    "operator": "??",
                                                                    "right": {
                                                                        "type": "MemberExpression",
                                                                        "object": {
                                                                            "type": "Identifier",
                                                                            "name": "mdl"
                                                                        },
                                                                        "property": {
                                                                            "type": "Identifier",
                                                                            "name": "exports"
                                                                        },
                                                                        "computed": false,
                                                                        "optional": false
                                                                    }
                                                                }
                                                            }
                                                        ]
                                                    },
                                                    "alternate": {
                                                        "type": "ThrowStatement",
                                                        "argument": {
                                                            "type": "NewExpression",
                                                            "callee": {
                                                                "type": "Identifier",
                                                                "name": "Error"
                                                            },
                                                            "arguments": [
                                                                {
                                                                    "type": "Literal",
                                                                    "value": "Required Tabane Module is not found. This shouldn't be happening since this is a pretty unexpected behavior. Aborting execution.",
                                                                    "raw": "'Required Tabane Module is not found. This shouldn\\'t be happening since this is a pretty unexpected behavior. Aborting execution.'"
                                                                }
                                                            ]
                                                        }
                                                    }
                                                }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "arguments": [],
                    "optional": false
                }
            }
        ],
        "kind": "const"
    },
    section2 = ASTTools.CallNode( '__tabane_require', ASTTools.ConvertType( ASTMainPointer, true ) )
    return [ section1, section2 ];
}

// Here is the actual module we are going to return
module.exports = Toolkit.module( ModuleGlobals => {
    const   fss = ModuleGlobals.IO.FileSystem,
            pth = ModuleGlobals.IO.Path,
            con = ModuleGlobals.ConsoleHost,
            gen = ModuleGlobals.Code.Generator,
            clr = ModuleGlobals.ANSI;
    return {
        name: 'tbn.bundle',
        options: {
            environment: {},
            sourceDir: '',
            main: 'index.js',
            watermark: '',
            target: 'cross-nonopt',
            outputDir: 'build',
            outputFile: 'bundle.js',
            traceHide: null,
            compact: true,
            relaxed: false,
            superset: [ 'esconv' ],
            transitsOrder: []
        },
        action ( path, document, transits ) {
            // Make sure we have ESConv, we don't wanna f*ck
            // up our bundles, right?
            if ( document.superset.indexOf( 'esconv' ) === -1 )
                document.superset.push( 'esconv' );
            
            // Log the operation we are about to perform.
            const featureList = Object.entries( {
                "Superset": document.superset.length > 1,
                "ESConv (Required)": document.superset.includes( 'esconv' ),
                "Compact": document.compact,
                "Hide Source": !!document.traceHide
            } ).map( ( [ key, val ] ) => val ? clr.magenta( key ) : undefined ).filter( e => !!e );
            con.log( `Started ${ clr.cyan( 'Bundle' ) } Operation.` ).onto( ifc => {
                ifc.next.log( `Path: ${ clr.yellow( path ) }` );
                ifc.end.log( `Features: ${
                    featureList.length > 0 ? featureList.join( ', ' ) : clr.gray( 'None' )
                }` );
            } ); con.newline();
            
            // Define the paths
            const sourcePath   = document.sourceDir ? pth.join( path, document.sourceDir ) : path;
            const buildPath    = pth.join( path, document.outputDir );
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
            const bcon = con.log( `${ clr.cyan( 'Bundling' ) } files.` );
            
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
            let bundleASTCollection = {},
                bundleASTCounter    = 0;
            function RecursiveRequireWalk ( rPath ) {
                // If we have the path in the cache, return it lol
                if ( path !== mainFilePath && bundleASTCollection[ path ] ) return;
                
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
                acorn.inspectRequires( AST, ( value, node ) => {
                    const absLoc = acorn.fetchPackage( value.startsWith( '/' ) ? value : pth.join( rPath, '../' , value ) );
                    if ( !absLoc?.type )
                        return value;
                    node.callee.name = '__tabane_require';
                    if ( bundleASTCollection[ absLoc.url ] )
                        return bundleASTCollection[ absLoc.url ].pointer;
                    bundleASTCollection[ absLoc.url ] = {
                        pointer: "" + ( ++bundleASTCounter ),
                        contents: RecursiveRequireWalk( absLoc.url )
                    };
                    return bundleASTCollection[ absLoc.url ].pointer;
                } );
                
                // After iteration, add your stuff to the Obf Array
                if ( rPath == mainFilePath ) bundleASTCollection[ rPath ] = {
                    pointer: 'main',
                    contents: AST
                }; else return AST;
            }
            
            // After recursive function definition, run
            // it against the main file.
            RecursiveRequireWalk( mainFilePath );
            bcon.end.log( 'Bundle Reservation is done.' );
            
            // Perform Transits and pack the syntax tree
            if ( document.transitsOrder.length > 0 ) con.newline();
            const fcon = document.transitsOrder.length > 0 ? con.log( `Started ${ clr.magenta( 'transit' ) } operations.` ) : {};
            const transitOutputs = document.transitsOrder.map( name => {
                const act = transits.get.subaction( name, 'tbn.bundle', 'packing' )?.action;
                if ( !act ) return;
                fcon.next.log( `Performing ${ clr.magenta( name ) }.` );
                return act( path, document, bundleASTCollection );
            } );
            const requireOutputs = TabaneBundleRequireTransit(
                ModuleGlobals.Code.AST,
                bundleASTCollection,
                bundleASTCollection[ mainFilePath ].pointer
            );
            if ( document.transitsOrder.length > 0 ) fcon.end.log( 'Performed all transit operations.' );
            
            // Pack everything up now :3
            con.newline();
            con.log( `Packing up the ${ clr.magenta( 'Syntax Tree' ) }.` );
            let generated = transits.get.subaction( document.target, 'tbn.bundle', 'target' )?.action(
                path, document, [
                    requireOutputs[ 0 ],
                    ...transitOutputs,
                    requireOutputs[ 1 ]
                ]
            );
            
            // Get compact or the beautiful version of the
            // generated code.
            if ( document.compact ) {
                con.log( `Uglifying and optimizing the output.` );
                const esmangle = require( 'esmangle' );
                try {
                    generated = esmangle.mangle( esmangle.optimize( generated, null ) );
                } catch (error) {
                    console.error(error);
                }
            }
            
            // Generate the output
            con.log( `Generating Javascript Code.` );
            const output = gen.generate( generated, {
                format: { compact: document.compact },
                env: document.environment
            } );
            
            // Create the build dir if it doesn't exists
            if ( !fss.existsSync( buildPath ) )
                fss.mkdirSync( buildPath, { recursive: true } );
            
            // Create a sourcemap suffix to hide traceback
            const mapSuffix = document.traceHide ? '\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,' + Buffer.from( JSON.stringify(
                {
                    version: 3,
                    file: document.outputFile,
                    sources: document.traceHide ? [ ( document.traceHide == true ? document.tag ?? 'Unknown' : document.traceHide ) ]: [],
                    names: [ "" ],
                    mappings: ";;;;AAAA;AAAA;"
                }
            ) ).toString( 'base64' ) : '';
            
            // Write cute things
            con.log( `Writing Output to ${ clr.yellow( document.outputFile ) }.` );
            fss.writeFileSync( pth.join( buildPath, document.outputFile ), document.watermark + output + mapSuffix );

            con.log( 'Bundling is done.' );
            con.newline();
        }
    }
} );