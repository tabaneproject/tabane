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

const Toolkit = require( './toolkit' );

module.exports = Toolkit.module( ModuleGlobals => {
    class ObjectExtensions {
        static RecursiveAssignment ( target, source ) {
            for ( let i = 1; i < arguments.length; ++i ) {
                if ( source = arguments[ i ] ) {
                    Object.keys( source ).forEach( function( sourceKey ) {
                        if ( "object" === typeof source[ sourceKey ] )
                            target[ sourceKey ] = ObjectExtensions.RecursiveAssignment( target[ sourceKey ] || {}, source[ sourceKey ] );
                        else if ( Array.isArray( source ) )
                            target = source;
                        else
                            target[ sourceKey ] = source[ sourceKey ];
                    } );
                }
            }
            return target;
        }
        static with ( target, source ) {
            const object = Object.assign( {}, target );
            if ( typeof source == 'object' ) return ObjectExtensions.RecursiveAssignment( object, source );
            else if ( typeof source == 'function' ) sourceobj.call( object, object );
            else if ( typeof source == 'undefined' || null === source ) return object;
            else if ( source instanceof Array && object instanceof Array ) return [ ...object, ...source ];
            return object;
        }
        static strict ( object, source ) {
            if ( !source ) return object;
            for ( const key of Object.keys( source ) ) {
                if ( typeof object[ key ] === 'undefined' && object[ key ] !== null ) {
                    throw new ModuleGlobals.Errors.TypeError( `Object does not contain the source key '${ key }'` );
                } else if ( object[ key ] !== null && typeof object[ key ] !== typeof object[ key ] )
                    throw new ModuleGlobals.Errors.TypeError( `Given key is in '${ source[ key ].constructor.name }' type but requested type is '${ object[ key ].constructor.name }'` );
            }
            return ObjectExtensions.with( object, source );
        }
        static redefine ( object, source ) {
            Object.keys( object ).forEach( e => delete object[ e ] );
            Object.keys( source ).forEach( e => object[ e ] = source[ e ] );
        }
    }
    class OperationExtensions {
        static swallow ( ...args ) {
            try {
                return this.call( this, ...args );
            } catch (error) {
                if ( process.debug ) 
                    console.error( 'Swallowed operation has returned an error, Not tainted. Here\'s the stack:\n' + error.stack );
                return error;
            }
        }
    }
    
    Object.strict   = ObjectExtensions.strict;
    Object.redefine = ObjectExtensions.redefine;
    Object.with     = ObjectExtensions.with;
    Function.prototype.swallow = OperationExtensions.swallow;
} );