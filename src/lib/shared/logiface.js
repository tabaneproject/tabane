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

const Colors = {
    black:   ( t ) => { return "\x1b[30m"       + t + "\x1b[0m" },
    red:     ( t ) => { return "\x1b[31m"       + t + "\x1b[0m" },
    green:   ( t ) => { return "\x1b[32m"       + t + "\x1b[0m" },
    yellow:  ( t ) => { return "\x1b[33m"       + t + "\x1b[0m" },
    blue:    ( t ) => { return "\x1b[34m"       + t + "\x1b[0m" },
    magenta: ( t ) => { return "\x1b[35m"       + t + "\x1b[0m" },
    cyan:    ( t ) => { return "\x1b[36m"       + t + "\x1b[0m" },
    white:   ( t ) => { return "\x1b[37m"       + t + "\x1b[0m" },
    gray:    ( t ) => { return "\x1b[38;5;245m" + t + "\x1b[0m" },
    reset:   ( t ) => { return "\x1b[0m"        + t + "\x1b[0m" }
};

const ColorsAreBloat = {
    black:   t => t,
    red:     t => t,
    green:   t => t,
    yellow:  t => t,
    blue:    t => t,
    magenta: t => t,
    cyan:    t => t,
    white:   t => t,
    gray:    t => t,
    reset:   t => t
};

// DEVNOTE: A pretty dirty hack to do byref
//          redefine, wrapping Colors object.
//          i f*cking hate javascript.
const CWrapper = {
    Colors: ColorsAreBloat
};

class ConsoleInterface {
    static idents = {
        next: ' │ ',
        end:  ' ┕ ',
        sta:  '→  '
    }
    static Colors = ColorsAreBloat
    constructor ( silent, ident = "" ) {
        this.silent = silent;
        this.ident = ident;
        this._base = function ( funcname, color, ...args ) {
            const j = args.shift();
            if ( !this.silent || funcname !== 'error' )
                ( typeof funcname === 'function' ? funcname : console[ funcname ] )( CWrapper.Colors[ color ?? 'reset' ]( this.ident == '' ? ConsoleInterface.idents.sta : this.ident ) + j, ...args );
            return {
                next: new ConsoleInterface( this.silent, ( this.ident == '' ? '  ' : this.ident ) + ConsoleInterface.idents.next ),
                end:  new ConsoleInterface( this.silent, ( this.ident == '' ? '  ' : this.ident ) + ConsoleInterface.idents.end  )
            }
        }
    }

    // Interface Functions
    log ( ...args ) { return this._base( 'log', 'reset', ...args ); }
    warn ( ...args ) { return this._base( 'warn', 'yellow', ...args ); }
    error ( ...args ) { return this._base( 'error', 'red', ...args ); }
    verbose ( ...args ) { return this._base( () => process.verbose ? console.log( ...args ) : false, 'reset', ...args ); }
    newline () { if ( !this.silent ) console.log( '' ); }
};

module.exports = {
    Colors: enabled => enabled ? Colors : ColorsAreBloat,
    CWrapper,
    ConsoleInterface
}