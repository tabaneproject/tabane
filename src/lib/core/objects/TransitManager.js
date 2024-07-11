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

// Management Class for Scripts
class TransitToolkit {
    constructor ( transitInstance, context = {} ) {
        this.transit = transitInstance;
        this.context = context;
    }
    Transit ( name, transit ) {
        if ( this.context[ name ] )
            throw new ( class TransitExistsError extends Error { constructor() { super( `Transit with the name '${ name }' already exists.` ) } } )();
        this.context[ name ] = transit;
        return transit( this.transit );
    }
}

module.exports = Toolkit.module( ModuleGlobals => {
    return class TransitManager {
        constructor ( transitInstance ) {
            this.transit = transitInstance;
            this.toolkitContext = new TransitToolkit( transitInstance );
        }
        Execute ( settings = {} ) {
            // Get VM Library
            const vm = ModuleGlobals.Process.JavascriptVM;
            
            // Create Context
            const context = vm.createContext( {
                TransitToolkit: this.toolkitContext,
                Transit: this.toolkitContext.Transit.bind( this.toolkitContext ),
                ConsoleHost: ModuleGlobals.ConsoleHost,
                console,
                Object,
                ...( settings?.options?.globals ?? {} )
            } );
            
            // Create Script
            const script = new vm.Script( settings?.code ?? '', { filename: settings?.options?.referenceFilename ?? 'Tabane:TransitInvokationManager' } );
            
            // Run the script;
            return script.runInContext( context );
        }
    }
} );