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

/*
    This is a transformer superset for ESConv
    to be used in javascript projects that require
    to be bundled or compiled from a Tabane Superset.
*/

function ESConvImportTransformer () {
    function ImportDeclaration ( node ) {
        // Create the base call
        const requireCallExp = Library.Code.AST.CallNode( 'require', node.source );

        // Syntax: import 'lib' ->
        if ( node.specifiers.length === 0 )
            return Object.redefine( node, requireCallExp );
        
        // Other Syntaxes
        switch ( node.specifiers[ 0 ].type ) {
            // Syntax: import lib from 'lib' ->
            case 'ImportDefaultSpecifier': return Object.redefine( node, {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [ {
                    type: 'VariableDeclarator',
                    id: node.specifiers[ 0 ].local,
                    init: {
                        type: 'MemberExpression',
                        object: requireCallExp,
                        computed: false,
                        optional: true,
                        property: {
                            type: 'Identifier',
                            name: 'default'
                        }
                    }
                } ]
            } );
            // Syntax: import * as lib from 'lib' ->
            case 'ImportNamespaceSpecifier': return Object.redefine( node, {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [ {
                    type: 'VariableDeclarator',
                    id: node.specifiers[ 0 ].local,
                    init: requireCallExp
                } ]
            } );
            // Syntax: import { lib as myLib } from 'lib' ->
            case 'ImportSpecifier': return Object.redefine( node, {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [ {
                    type: 'VariableDeclarator',
                    id: {
                        type: 'ObjectPattern',
                        properties: node.specifiers.map( specifier => (
                            {
                                type: "Property",
                                method: false,
                                shorthand: ( specifier.imported.name === specifier.local.name ),
                                computed: false,
                                key: specifier.imported,
                                kind: "init",
                                value: specifier.local
                            }
                        ) ),
                    },
                    init: requireCallExp
                } ]
            } );
        }
    }
    
    // Return it
    return { ImportDeclaration }
}

function ESConvExportTransformer () {
    function ExportDefaultDeclaration ( node ) {
        return Object.redefine( node, {
            type: 'ExpressionStatement',
            expression: {
                type: 'AssignmentExpression',
                operator: '=',
                left: {
                    type: 'MemberExpression',
                    computed: false,
                    optional: false,
                    object: { type: 'Identifier', name: 'exports' },
                    property: { type: 'Identifier', name: 'default' }
                },
                right: node.declaration
            }
        } );
    }
    function ExportNamedDeclaration ( node ) {
        if ( node.declaration ) {
            if ( node.declaration.type === 'VariableDeclaration' ) return Object.redefine( node, {
                type: 'ExpressionStatement',
                expression: node.declaration.declarations.length > 1 ? {
                    type: 'SequenceExpression',
                    expressions: node.declaration.declarations.map( decl => ( {
                        type: 'AssignmentExpression',
                        operator: '=',
                        left: {
                            type: 'MemberExpression',
                            computed: false,
                            optional: false,
                            object: { type: 'Identifier', name: 'exports' },
                            property: decl.id
                        },
                        right: decl.init
                    } ) )
                } : {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'MemberExpression',
                        computed: false,
                        optional: false,
                        object: { type: 'Identifier', name: 'exports' },
                        property: node.declaration.declarations[0].id
                    },
                    right: node.declaration.declarations[0].init
                }
            } );
            if ( node.declaration.type === 'FunctionDeclaration' || node.declaration.type === 'ClassDeclaration' ) return Object.redefine( node, {
                type: 'ExpressionStatement',
                expression: {
                    type: 'AssignmentExpression',
                    operator: '=',
                    left: {
                        type: 'MemberExpression',
                        computed: false,
                        optional: false,
                        object: { type: 'Identifier', name: 'exports' },
                        property: node.declaration.id
                    },
                    right: node.declaration
                }
            } );
        }
    }
    function ExportAllDeclaration ( node ) {
        return Object.redefine( node, {
            type: 'ExpressionStatement',
            expression: {
                type: 'CallExpression',
                arguments: [
                    { type: 'Identifier', name: 'exports' },
                    Library.Code.AST.CallNode( 'require', node.source )
                ],
                callee: {
                    type: 'MemberExpression',
                    computed: false,
                    optional: false,
                    object: { type: 'Identifier', name: 'Object' },
                    property: { type: 'Identifier', name: 'assign' }
                }
            }
        } );
    }
    
    // Return it
    return { ExportDefaultDeclaration, ExportNamedDeclaration, ExportAllDeclaration }
}

Transit(
    'ESConvSupersetTransit',
    ITransit => ITransit.set.superset( {
        name: 'esconv',
        walker: [ ESConvImportTransformer(), ESConvExportTransformer() ]
    } )
);