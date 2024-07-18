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

const ObjNt = require( './utils/objectnotation' );

function parseValue ( val ) {
    return ( { 'true': true, 'false': false } )[ val ]
            ?? ( vax = parseFloat( val ), isNaN( vax ) ? val : vax );
}

class ConfStore {
    constructor ( defaults, ...storeUrls ) {
        this._defaults = defaults;
        this._config = Object.assign( {}, defaults );
        storeUrls.forEach( url => {
            if ( !Library.IO.FileSystem.existsSync( url ) || !Library.IO.FileSystem.existsSync( Library.IO.Path.join( url, 'config.json' ) ) ) return;
            this._config = Object.with( this._config, require( Library.IO.Path.join( url, 'config.json' ) ) );
        } );
    }
    writeDefaults ( storeUrl ) {
        const storePath = Library.IO.Path.join( storeUrl, 'config.json' );
        if ( Library.IO.FileSystem.existsSync( storePath ) ) return;
        if ( !Library.IO.FileSystem.existsSync( storeUrl ) )
            Library.IO.FileSystem.mkdirSync( storeUrl, { recursive: true } );
        Library.IO.FileSystem.writeFileSync( storePath, JSON.stringify( this._defaults ) );
    }
    getConfig ( namespace ) {
        return ObjNt.get( this._config, namespace );
    }
    setConfig ( storeUrl, namespace, value ) {
        const storePath = Library.IO.Path.join( storeUrl, 'config.json' );
        if ( !Library.IO.FileSystem.existsSync( storeUrl ) )
            Library.IO.FileSystem.mkdirSync( storeUrl, { recursive: true } );
        const conf = Library.IO.FileSystem.existsSync( storePath ) ? require( storePath ) : {};
        ObjNt.set( conf, namespace, parseValue( value ) )
        Library.IO.FileSystem.writeFileSync( storePath, JSON.stringify( conf ) );
    }
    listConfig ( storeUrl = null ) {
        let conf = this._config;
        if ( storeUrl ) conf = require( Library.IO.Path.join( storeUrl, 'config.json' ) );
        return ObjNt.list( conf );
    }
}

module.exports = ConfStore;