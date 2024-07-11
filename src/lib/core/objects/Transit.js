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
    return class Transit {
        constructor () {
            this.subactions = {};
            this.actions = {};
            this.supersets = {};
        }
        
        // Create a Shared Transit Instance for Getter
        instance () {
            const that = this;
            const GetterInstance = {
                subactions ( actionName, actionType ) {
                    const acts = that.subactions[ actionName ]?.[ actionType ];
                    if ( !acts ) return {};
                    return Object.entries( that.subactions[ actionName ]?.[ actionType ] ).map( ( [ k, v ] ) => v );
                },
                actions () {
                    return that.actions;
                },
                supersets () {
                    return that.supersets;
                },
                subaction ( name, actionName, actionType ) {
                    return that.subactions[ actionName ]?.[ actionType ]?.[ name ];
                },
                action ( name ) {
                    return that.actions[ name ];
                },
                superset ( name ) {
                    return that.supersets[ name ];
                }
            };
            const SetterInstance = {
                subaction ( actionModule ) {
                    if ( !that.subactions[ actionModule.parent ] )
                        throw new ModuleGlobals.Errors.SubActionUnknownParentError( `Given action with the name '${ actionModule.parent }' does not exist.` );
                    if ( !that.subactions[ actionModule.parent ][ actionModule.type ] )
                        that.subactions[ actionModule.parent ][ actionModule.type ] = {};
                    if ( that.subactions[ actionModule.parent ][ actionModule.type ][ actionModule.name ] )
                        throw new ModuleGlobals.Errors.SubActionExistsError( `Given sub-action with the name '${ actionModule.name }' already exists.` );
                    that.subactions[ actionModule.parent ][ actionModule.type ][ actionModule.name ] = actionModule;
                    return actionModule;
                },
                subactions ( ...subActions ) {
                    for ( const actionModule of subActions ) {
                        if ( !that.subactions[ actionModule.parent ] )
                            throw new ModuleGlobals.Errors.SubActionUnknownParentError( `Given action with the name '${ actionModule.parent }' does not exist.` );
                        if ( !that.subactions[ actionModule.parent ][ actionModule.type ] )
                            that.subactions[ actionModule.parent ][ actionModule.type ] = {};
                        if ( that.subactions[ actionModule.parent ][ actionModule.type ][ actionModule.name ] )
                            throw new ModuleGlobals.Errors.SubActionExistsError( `Given sub-action with the name '${ actionModule.name }' already exists.` );
                        that.subactions[ actionModule.parent ][ actionModule.type ][ actionModule.name ] = actionModule;
                    }
                    return subActions;
                },
                action ( actionModule ) {
                    if ( that.actions[ actionModule.name ] )
                        throw new ModuleGlobals.Errors.ActionExistsError( `Given action with the name '${ actionModule.name }' already exists.` );
                    that.subactions[ actionModule.name ] = {}
                    return that.actions[ actionModule.name ] = actionModule;
                },
                actions ( ...actionModules ) {
                    for ( const actionModule of actionModules ) {
                        if ( that.actions[ actionModule.name ] )
                            throw new ModuleGlobals.Errors.ActionExistsError( `Given action with the name '${ actionModule.name }' already exists.` );
                        that.subactions[ actionModule.name ] = {}
                        that.actions[ actionModule.name ] = actionModule;
                    }
                    return actionModules;
                },
                superset ( supersetModule ) {
                    if ( that.supersets[ supersetModule.name ] )
                        throw new ModuleGlobals.Errors.SupersetExistsError( `Given superset with the name '${ actionModule.name }' already exists.` );
                    return that.supersets[ supersetModule.name ] = supersetModule;
                },
                supersets ( ...supersetModules ) {
                    for ( const supersetModule of supersetModules ) {
                        if ( that.supersets[ supersetModule.name ] )
                            throw new ModuleGlobals.Errors.SupersetExistsError( `Given superset with the name '${ actionModule.name }' already exists.` );
                        that.supersets[ supersetModule.name ] = supersetModule;
                    }
                    return supersetModules;
                }
            };
            return {
                get: GetterInstance,
                set: SetterInstance
            }
        }
    }
} );