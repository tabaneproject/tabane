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
    return class TabaneProjectDocument {
        constructor ( data, presets = {}, optionExtensions = {} ) {
            // Setup Action list
            this.actions = [];
            
            // Check if globals are being used in singledoc
            // mode.
            if ( !data.actions && data.global )
                throw new ModuleGlobals.Errors.TabaneDocumentParseError( 'You cannot use globals in a singular document.', data, 'TabaneProjectDocument.js' );
            
            // If there is actions property, we are in 
            // multidoc mode. Otherwise we are in
            // singledoc mode.
            if ( data.actions ) {
                let options = Object.strict( {
                    global: {},
                    actions: [],
                    ...optionExtensions
                }, data );
                options.actions.forEach( option => {
                    if ( typeof option === "string" ) {
                        const subProject = new TabaneProjectDocument( presets[ option ] );
                        return this.actions.push( ...subProject.actions );
                    }
                    this.actions.push( new ModuleGlobals.TabaneSingularDocument( Object.with( options.global, option ), optionExtensions ) )
                } );
            } else {
                // We are in SingleDoc mode.
                this.actions.push( new ModuleGlobals.TabaneSingularDocument( data, optionExtensions ) );
            }
        }
        perform ( path, ...extras ) {
            // Create a project documents output
            // array list.
            let actionYield = [];
            
            // Iterate through actions
            for ( const action of this.actions ) {
                let projectOutput = action.perform( path, ModuleGlobals.ITransit, ...extras );
                actionYield.push( projectOutput );
            }
            
            // Return the action array output
            ModuleGlobals.ConsoleHost.log( 'All Done.' );
            return actionYield;
        }
    }
} );