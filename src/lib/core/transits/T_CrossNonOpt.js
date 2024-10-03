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

Transit(
    'BundleCrossNonOptSubActionTransit',
    ITransit => ITransit.set.subaction( {
        name: 'cross-nonopt',
        parent: 'tbn.bundle',
        type: 'target',
        action ( path, document, ASTCollection ) {
            return {
                "type": "Program",
                "body": [
                    {
                        "type": "ExpressionStatement",
                        "expression": {
                            "type": "UnaryExpression",
                            "operator": "!",
                            "prefix": true,
                            "argument": {
                                "type": "CallExpression",
                                "callee": {
                                    "type": "FunctionExpression",
                                    "id": null,
                                    "expression": false,
                                    "generator": false,
                                    "async": false,
                                    "params": [],
                                    "body": {
                                        "type": "BlockStatement",
                                        "body": [
                                            {
                                                type: "VariableDeclaration",
                                                declarations: [
                                                    {
                                                        type: "VariableDeclarator",
                                                        id: {
                                                            type: "Identifier",
                                                            name: "global_context"
                                                        },
                                                        init: {
                                                            type: "ConditionalExpression",
                                                            test: {
                                                                type: "BinaryExpression",
                                                                left: {
                                                                    type: "UnaryExpression",
                                                                    operator: "typeof",
                                                                    prefix: true,
                                                                    argument: {
                                                                        type: "Identifier",
                                                                        name: "global"
                                                                    }
                                                                },
                                                                operator: "===",
                                                                right: {
                                                                    type: "Literal",
                                                                    value: "undefined",
                                                                    raw: "'undefined'"
                                                                }
                                                            },
                                                            consequent: {
                                                                type: "ConditionalExpression",
                                                                test: {
                                                                    type: "BinaryExpression",
                                                                    left: {
                                                                        type: "UnaryExpression",
                                                                        operator: "typeof",
                                                                        prefix: true,
                                                                        argument: {
                                                                            type: "Identifier",
                                                                            name: "window"
                                                                        }
                                                                    },
                                                                    operator: "===",
                                                                    right: {
                                                                        type: "Literal",
                                                                        value: "undefined",
                                                                        raw: "'undefined'"
                                                                    }
                                                                },
                                                                consequent: {
                                                                    type: "ConditionalExpression",
                                                                    test: {
                                                                        type: "BinaryExpression",
                                                                        left: {
                                                                            type: "UnaryExpression",
                                                                            operator: "typeof",
                                                                            prefix: true,
                                                                            argument: {
                                                                                type: "Identifier",
                                                                                name: "self"
                                                                            }
                                                                        },
                                                                        operator: "===",
                                                                        right: {
                                                                            type: "Literal",
                                                                            value: "undefined",
                                                                            raw: "'undefined'"
                                                                        }
                                                                    },
                                                                    consequent: {
                                                                        type: "ConditionalExpression",
                                                                        test: {
                                                                            type: "BinaryExpression",
                                                                            left: {
                                                                                type: "UnaryExpression",
                                                                                operator: "typeof",
                                                                                prefix: true,
                                                                                argument: {
                                                                                    type: "Identifier",
                                                                                    name: "globalThis"
                                                                                }
                                                                            },
                                                                            operator: "===",
                                                                            right: {
                                                                                type: "Literal",
                                                                                value: "undefined",
                                                                                raw: "'undefined'"
                                                                            }
                                                                        },
                                                                        consequent: {
                                                                            type: "ObjectExpression",
                                                                            properties: []
                                                                        },
                                                                        alternate: {
                                                                            type: "Identifier",
                                                                            name: "globalThis"
                                                                        }
                                                                    },
                                                                    alternate: {
                                                                        type: "Identifier",
                                                                        name: "self"
                                                                    }
                                                                },
                                                                alternate: {
                                                                    type: "Identifier",
                                                                    name: "window"
                                                                }
                                                            },
                                                            alternate: {
                                                                type: "Identifier",
                                                                name: "global"
                                                            }
                                                        }
                                                    }
                                                ],
                                                kind: "const"
                                            },
                                            ...ASTCollection
                                        ]
                                    }
                                },
                                "arguments": [],
                                "optional": false
                            }
                        }
                    }
                ],
                "sourceType": "module"
            }
        }
    } )
);
