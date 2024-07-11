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

function ConvertType ( item, enforceString = false ) {
    if ( item.type ) return item;
    switch ( typeof item ) {
        case 'string':
            if ( enforceString || /([\r\n\ ]+)/g.test( item ) ) return {
                type: 'Literal',
                value: item
            }; else return {
                type: 'Identifier',
                name: item
            } 
        case 'number': case 'bigint': case 'boolean': return {
            type: 'Literal',
            value: item
        }
        default: return undefined
    }
}

module.exports = {
    ConvertType,
    CallNode: ( callee, ...argAST ) => ( {
        type: "CallExpression",
        callee: ConvertType( callee ),
        arguments: [ ...argAST ],
        optional: false
    } ),
    PropertyNode: ( key, val ) => ( {
        type: 'Property',
        method: false,
        shorthand: false,
        computed: false,
        key: ConvertType( key ),
        value: val,
        kind: 'init'
    } ),
    BundleParcelFunctionNode: body => (
        {
            "type": "FunctionExpression",
            "start": 4,
            "end": 30,
            "id": null,
            "expression": false,
            "generator": false,
            "async": false,
            "params": [
                {
                    "type": "Identifier",
                    "start": 13,
                    "end": 19,
                    "name": "module"
                },
                {
                    "type": "Identifier",
                    "start": 20,
                    "end": 27,
                    "name": "exports"
                }
            ],
            "body": {
                "type": "BlockStatement",
                "start": 28,
                "end": 30,
                "body": body
            }
        }
    )
}