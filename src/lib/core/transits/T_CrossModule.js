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
    'BundleCrossModuleSubActionTransit',
    ITransit => {
        ITransit.set.option( { tag: null } );
        ITransit.set.subaction( {
            name: 'cross-module',
            parent: 'tbn.bundle',
            type: 'target',
            action ( path, document, ASTCollection ) {
                return {
                    type: "Program",
                    body: [
                        {
                            type: "ExpressionStatement",
                            expression: {
                                type: "UnaryExpression",
                                operator: "!",
                                prefix: true,
                                argument: {
                                    type: "CallExpression",
                                    callee: {
                                        type: "FunctionExpression",
                                        id: null,
                                        expression: false,
                                        generator: false,
                                        async: false,
                                        params: [],
                                        body: {
                                            type: "BlockStatement",
                                            body: [
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
                                                {
                                                    type: "VariableDeclaration",
                                                    declarations: [
                                                        {
                                                            type: "VariableDeclarator",
                                                            id: {
                                                                type: "Identifier",
                                                                name: "__tabane_cross_module"
                                                            },
                                                            init: {
                                                                type: "FunctionExpression",
                                                                id: null,
                                                                expression: false,
                                                                generator: false,
                                                                async: false,
                                                                params: [
                                                                    {
                                                                        type: "Identifier",
                                                                        name: "global"
                                                                    }
                                                                ],
                                                                body: {
                                                                    type: "BlockStatement",
                                                                    body: ASTCollection
                                                                }
                                                            }
                                                        }
                                                    ],
                                                    kind: "const"
                                                },
                                                {
                                                    type: "IfStatement",
                                                    test: {
                                                        type: "LogicalExpression",
                                                        left: {
                                                            type: "BinaryExpression",
                                                            left: {
                                                                type: "UnaryExpression",
                                                                operator: "typeof",
                                                                prefix: true,
                                                                argument: {
                                                                    type: "Identifier",
                                                                    name: "define"
                                                                }
                                                            },
                                                            operator: "===",
                                                            right: {
                                                                type: "Literal",
                                                                value: "function",
                                                                raw: "'function'"
                                                            }
                                                        },
                                                        operator: "&&",
                                                        right: {
                                                            type: "MemberExpression",
                                                            object: {
                                                                type: "Identifier",
                                                                name: "define"
                                                            },
                                                            property: {
                                                                type: "Identifier",
                                                                name: "amd"
                                                            },
                                                            computed: false,
                                                            optional: false
                                                        }
                                                    },
                                                    consequent: {
                                                        type: "ExpressionStatement",
                                                        expression: {
                                                            type: "CallExpression",
                                                            callee: {
                                                                type: "Identifier",
                                                                name: "define"
                                                            },
                                                            arguments: [
                                                                {
                                                                    type: "CallExpression",
                                                                    callee: {
                                                                        type: "MemberExpression",
                                                                        object: {
                                                                            type: "Identifier",
                                                                            name: "__tabane_cross_module"
                                                                        },
                                                                        property: {
                                                                            type: "Identifier",
                                                                            name: "bind"
                                                                        },
                                                                        computed: false,
                                                                        optional: false
                                                                    },
                                                                    arguments: [
                                                                        {
                                                                            type: "ThisExpression",
                                                                        },
                                                                        {
                                                                            type: "Identifier",
                                                                            name: "global_context"
                                                                        }
                                                                    ],
                                                                    optional: false
                                                                }
                                                            ],
                                                            optional: false
                                                        }
                                                    },
                                                    alternate: {
                                                        type: "IfStatement",
                                                        test: {
                                                            type: "BinaryExpression",
                                                            left: {
                                                                type: "UnaryExpression",
                                                                operator: "typeof",
                                                                prefix: true,
                                                                argument: {
                                                                    type: "Identifier",
                                                                    name: "exports"
                                                                }
                                                            },
                                                            operator: "!==",
                                                            right: {
                                                                type: "Literal",
                                                                value: "undefined",
                                                                raw: "'undefined'"
                                                            }
                                                        },
                                                        consequent: {
                                                            type: "ExpressionStatement",
                                                            expression: {
                                                                type: "AssignmentExpression",
                                                                operator: "=",
                                                                left: {
                                                                    type: "Identifier",
                                                                    name: "exports"
                                                                },
                                                                right: {
                                                                    type: "AssignmentExpression",
                                                                    operator: "=",
                                                                    left: {
                                                                        type: "MemberExpression",
                                                                        object: {
                                                                            type: "Identifier",
                                                                            name: "module"
                                                                        },
                                                                        property: {
                                                                            type: "Identifier",
                                                                            name: "exports"
                                                                        },
                                                                        computed: false,
                                                                        optional: false
                                                                    },
                                                                    right: {
                                                                        type: "CallExpression",
                                                                        callee: {
                                                                            type: "Identifier",
                                                                            name: "__tabane_cross_module"
                                                                        },
                                                                        arguments: [
                                                                            {
                                                                                type: "Identifier",
                                                                                name: "global_context"
                                                                            }
                                                                        ],
                                                                        optional: false
                                                                    }
                                                                }
                                                            }
                                                        },
                                                        alternate: document.tag ? {
                                                            type: "ExpressionStatement",
                                                            expression: {
                                                                type: "AssignmentExpression",
                                                                operator: "=",
                                                                left: {
                                                                    type: "MemberExpression",
                                                                    object: {
                                                                        type: "Identifier",
                                                                        name: "global_context"
                                                                    },
                                                                    property: {
                                                                        type: "Literal",
                                                                        value: document.tag,
                                                                        raw: "'" + document.tag + "'"
                                                                    },
                                                                    computed: true,
                                                                    optional: false
                                                                },
                                                                right: {
                                                                    type: "CallExpression",
                                                                    callee: {
                                                                        type: "Identifier",
                                                                        name: "__tabane_cross_module"
                                                                    },
                                                                    arguments: [
                                                                        {
                                                                            type: "Identifier",
                                                                            name: "global_context"
                                                                        }
                                                                    ],
                                                                    optional: false
                                                                }
                                                            }
                                                        } : undefined
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    arguments: [],
                                    optional: false
                                }
                            }
                        }
                    ],
                    sourceType: "module"
                }
            }
        } );
    }
);