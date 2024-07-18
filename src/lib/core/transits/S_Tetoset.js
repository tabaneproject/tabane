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
    This is a transformer superset for Tetoset
    to be used in javascript projects that require
    to be bundled or compiled from a Tabane Superset.
*/

function TetosetExtensions () {
    // Here comes the void extensions.
    function VoidFunctionExtension ( node ) {
        if ( node.id === null )
            throw new Error( 'This void extended function does not contain an Identifier.' );
        const identifierCode = ( Math.floor( ( Math.random() * 65535 ) ) ).toString( 16 ).padStart( 4, '0' );
        const funcTemplate = Object.assign( {}, node );
        funcTemplate.type = "FunctionDeclaration";
        funcTemplate.body = {
            type: 'BlockStatement',
            body: [
                {
                    type: 'TryStatement',
                    block: node.body,
                    handler: {
                        type: 'CatchClause',
                        param: {
                            type: 'Identifier',
                            name: '__tetoset_err_' + identifierCode
                        },
                        body: {
                            type: 'BlockStatement',
                            body: [
                                {
                                    type: 'ReturnStatement',
                                    argument: {
                                        type: 'Identifier',
                                        name: '__tetoset_err_' + identifierCode
                                    }
                                }
                            ]
                        }
                    }
                }
            ]
        };
        return funcTemplate;
    }
    function VoidExpressionExtension ( node ) {
        const identifierCode = ( Math.floor( ( Math.random() * 65535 ) ) ).toString( 16 ).padStart( 4, '0' );
        return {
            type: 'CallExpression',
            optional: false,
            arguments: [],
            callee: {
                type: 'FunctionExpression',
                id: null,
                generator: false,
                expression: false,
                async: node?.type === 'AwaitExpression',
                params: [],
                body: {
                    type: 'BlockStatement',
                    body: [
                        {
                            type: 'TryStatement',
                            block: {
                                type: 'BlockStatement',
                                body: [
                                    {
                                        type: 'ReturnStatement',
                                        argument: node
                                    }
                                ]
                            },
                            handler: {
                                type: 'CatchClause',
                                param: {
                                    type: 'Identifier',
                                    name: '__tetoset_err_' + identifierCode
                                },
                                body: {
                                    type: 'BlockStatement',
                                    body: [
                                        {
                                            type: 'ReturnStatement',
                                            argument: {
                                                type: 'Identifier',
                                                name: '__tetoset_err_' + identifierCode
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
    
    // Here comes the Class Extensions
    function ClassInterfaceDeclarationExtension ( node ) {
        const copied = Object.assign( {}, node );
        if ( copied.superClass?.type === 'ObjectExpression' ) {
            if ( copied.superClass.properties.length === 1 ) {
                copied.superClass = {
                    type: 'MemberExpression',
                    computed: false,
                    optional: false,
                    object: copied.superClass.properties[0],
                    property: { type: 'Identifier', name: 'constructor' }
                };
                copied.type = 'ClassExpression';
                return {
                    type: 'VariableDeclaration',
                    kind: 'const',
                    declarations: [
                        {
                            type: 'VariableDeclarator',
                            id: copied.id,
                            init: {
                                type: 'NewExpression',
                                callee: copied,
                                arguments: []
                            }
                        }
                    ]
                }
            }
            copied.superClass = undefined;
            copied.type = 'ClassExpression';
            return {
                type: 'VariableDeclaration',
                kind: 'const',
                declarations: [
                    {
                        type: 'VariableDeclarator',
                        id: copied.id,
                        init: {
                            type: 'NewExpression',
                            callee: copied,
                            arguments: []
                        }
                    }
                ]
            }
        }
        copied.superClass = {
            type: 'MemberExpression',
            computed: false,
            optional: false,
            object: copied.superClass.argument,
            property: { type: 'Identifier', name: 'constructor' }
        };
        return copied;
    }
    
    // Our void extensions can be an expression statement
    // and it usually means we are defining a swallowing
    // function :3
    function ExpressionStatement ( node ) {
        if (
            node.expression.type === 'UnaryExpression'
            && node.expression.operator === 'void'
            && node.expression.prefix === true
            && node.expression.argument.type === 'FunctionExpression'
        ) return Object.redefine( node, VoidFunctionExtension( node.expression.argument ) ?? node );
    }
    function UnaryExpression ( node ) {
        if (
            node.type === 'UnaryExpression'
            && node.operator === 'void'
            && node.prefix === true
            && node.argument?.type === 'UnaryExpression'
            && node.argument?.operator === '~'
            && node.argument?.prefix === true
            && (
                node.argument?.argument?.type === 'CallExpression'
                || node.argument?.argument?.type === 'AwaitExpression'
            )
        ) return Object.redefine( node, VoidExpressionExtension( node.argument?.argument ) ?? node );
    }
    function ClassDeclaration ( node ) {
        if (
            !node.id
            || !node.superClass
            || !( node.superClass.type === 'ObjectExpression' || node.superClass.type === 'UnaryExpression' )
        ) return;
        if (
            node.superClass.type === 'ObjectExpression'
            && node.superClass?.properties?.length > 1
        ) throw new Error( 'To create an interface-ified class, Extending object must contain one or no extension.' );
        if (
            node.superClass.type === 'UnaryExpression'
            && node.superClass?.operator !== '~'
        ) throw new Error( 'To create a class that inherits an interface, you need to use tilde (~) for the unary expression.' );
        return Object.redefine( node, ClassInterfaceDeclarationExtension( node ) ?? node );
    }
    return { ExpressionStatement, UnaryExpression, ClassDeclaration }
}

Transit(
    'TetosetSupersetTransit',
    ITransit => ITransit.set.superset( {
        name: 'tetoset',
        walker: [ TetosetExtensions() ]
    } )
);