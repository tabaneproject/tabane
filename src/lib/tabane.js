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

const Toolkit = require( './shared/toolkit' );
const Errors = require( './shared/errors' );
const Console = require( './shared/logiface' );
const Package = require( '../../package.json' );
const AST = require( './shared/ast' );

// Extra Utilities that require Toolkit.
const Extensions = require( './shared/extensions' ).module( { Errors } );

// Library Pack
const Library = {
    Errors,
    ANSI: Console.Colors( false ),
    IO: {
        FileSystem: require( 'fs' ),
        Path: require( 'path' ),
        YAML: require( 'yaml' )
    },
    Process: {
        ChildProcess: require( 'child_process' ),
        JavascriptVM: require( 'vm' )
    },
    Code: {
        AST,
        Generator: require( '@tabaneproject/ecmagen' )
    }
}

class Tabane {
    constructor ( ConsoleHost = new Console.ConsoleInterface( true ), Transits = [] ) {
        // Setup a transit interface
        const Transit = require( './core/objects/Transit' ).module( { ConsoleHost, ...Library } );
        const ITransit = ( new Transit() ).instance();

        // Setup Superset Base Class
        const SupersetManager = require( './core/objects/SupersetManager' ).module( { ConsoleHost, ...Library } )
        
        // Setup a transit management interface
        const TransitManager = require( './core/objects/TransitManager' ).module( { ConsoleHost, ...Library } );
        const ITransitManager = new TransitManager( ITransit );
        
        // Gather up built-in actions
        ITransit.set.actions( ...[
            './core/actions/fs.clean.dir',
            './core/actions/fs.copy',
            './core/actions/fs.touch',
            './core/actions/fs.rm',
            './core/actions/os.shell',
            './core/actions/tbn.compile',
            './core/actions/tbn.bundle'
        ].map( modStr => {
            let mod = require( modStr ).module( { ConsoleHost, ...Library, Package } );
            return mod
        } ) );
        
        // Gather up built-in transits
        [
            './core/transits/S_ESConv',
            './core/transits/S_Tetoset',
            './core/transits/T_CrossNonOpt'
        ].map( modStr => {
            // Execute a sample transit
            ITransitManager.Execute( {
                code: Library.IO.FileSystem.readFileSync( require.resolve( modStr ), { encoding: 'utf-8' } ),
                options: {
                    globals: { Library }
                }
            } );
        } );
        
        // Import extra transits given by the constructor
        Transits.forEach( tran => ITransitManager.Execute( {
            code: tran,
            options: {
                globals: { Library }
            }
        } ) );
        
        // Import Document Classes
        const   TabaneDocumentBase = require( './core/objects/TabaneDocumentBase' ),
                TabaneSingularDocument = require( './core/objects/TabaneSingularDocument' ).module( { Errors, Actions: ITransit.get.actions() } );
        const DocumentModels = {
            TabaneDocumentBase,
            TabaneSingularDocument,
            TabaneProjectDocument: require( './core/objects/TabaneProjectDocument' ).module( { Errors, ConsoleHost, TabaneDocumentBase, TabaneSingularDocument, ITransit } )
        }
        
        // Let's export everything :3
        this.Libraries = {
            ConsoleHost,
            SupersetManager,
            DocumentModels,
            Models: {
                Transit
            },
            TransitInterface: ITransit
        }
    }
}

module.exports = {
    Errors,
    Console,
    Toolkit,
    Library,
    Tabane,
    Package
}