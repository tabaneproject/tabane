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
const TabaneDocumentBase = require( './TabaneDocumentBase' );

module.exports = Toolkit.module( ModuleGlobals => {
    return class TabaneSingularDocument extends TabaneDocumentBase {
        constructor ( data, optionExtensions = {}, globals = {} ) {
            // Initialize the base
            super( ModuleGlobals.OptionExtensions );

            // Define the unscopable section and the
            // temporary data variable.
            const unscope = this[ Symbol.unscopables ], tmpdata = this.getData();

            // Check if the action exists, if so inherit
            // it's options.
            if ( !ModuleGlobals.Actions[ data.action ]?.options )
                throw new ModuleGlobals.Errors.TabaneDocumentError( `Given action with the name "${ data.action }" does not exist.` );
            tmpdata.action = data.action;
            Object.assign( tmpdata, ModuleGlobals.Actions[ data.action ].options );

            // Append option extensions to the document
            // options.
            Object.assign( tmpdata, optionExtensions );
            // Perform strict merging
            unscope.data = Object.strict( tmpdata, Object.fromEntries(
                Object.entries( data ).map( ( [ key, val ] ) => {
                    if ( !key || !val || typeof val !== 'string' ) return [ key, val ];
                    return [ key, val.replace( /\$\([\s]*([\w\d]+)[\s]*\)/g, e => {
                        const search = e.slice( 2, -1 ).trim();
                        return globals[ search ]
                            || optionExtensions[ search ]
                            || data[ search ]
                            || e;
                    } ) ]
                } )
            ) );
        }
        perform ( path, ...extras ) {
            let data = this.getData();
            return ModuleGlobals.Actions[ data.action ].action.call( this, path, data, ...extras );
        }
    }
} );
