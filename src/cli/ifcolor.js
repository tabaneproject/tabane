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

/**
 * Truncate string if longer that the specified length
 *
 * @param {String} str
 * @param {Number} [length]
 * @return {String}
 */
function strTruncate(str, length = 100) {
	let dots = str.length > length ? "..." : "";
	return str.substring(0, length) + dots;
}

module.exports = function CommanderANSIColorPatchHook ( Command, C ) {
    Command.prototype.padWidth = function () {
        let opt = 0;
        this.options.forEach( e => {
            if ( e.flags.length > opt ) opt = e.flags.length;
        } );
        this.commands.forEach( e => {
            if ( e.name.length > opt ) opt = e.name.length;
        } );
        return opt + 1;
    };
    Command.prototype.optionHelp = function () {
        let width = this.padWidth();
        return this.options.map(function (option) {
            return C.green(option.flags.padEnd(width)) + "  " + option.description +
                ((option.bool && option.defaultValue !== undefined) ? " (default: " + JSON.stringify(option.defaultValue) + ")" : "");
        }).concat([C.green("-h, --help".padEnd(width)) + "  " + "output usage information"])
            .join("\n");
    };
    Command.prototype.commandHelp = function () {
        if (!this.commands.length) return "";
        let commands = this.commands;
        let width = this.padWidth();
        return [
            C.yellow("Available commands:"),
            commands.map(function(cmd) {
                let desc = cmd._description ? "  " + strTruncate(cmd._description) : "";
                return (desc ? C.green(cmd._name.split(/ +/)[0].padEnd(width)) : C.green(cmd._name)) + desc;
            }).join("\n").replace(/^/gm, "  "),
            ""
        ].join("\n");
    };
    Command.prototype.helpInformation = function () {
        let desc = [];
        if (this._description) {
            desc = [
                this._description,
                ""
            ];
            let argsDescription = this._argsDescription;
            if (argsDescription && this._args.length) {
                let width = this.padWidth();
                desc.push(C.yellow("Arguments:"));
                desc.push("");
                this._args.forEach(function (arg) {
                    desc.push("  " + arg.name.padEnd(width) + "  " + argsDescription[arg.name]);
                });
                desc.push("");
            }
        }
        let cmdName = this._name;
        let parentName = this.parent?._name;
        if (this._alias) {
            cmdName = cmdName + "|" + this._alias;
        }
        let usage = [
            C.yellow("Usage: ") + ( parentName ? parentName + ' ' : '' ) + cmdName + " " + C.gray(this.usage()),
            ""
        ];
        let cmds = [];
        let commandHelp = this.commandHelp();
        if (commandHelp) cmds = [commandHelp];
        let options = [
            C.yellow("Options:"),
            "" + this.optionHelp().replace(/^/gm, "  "),
            ""
        ];
        return [""]
            .concat(usage)
            .concat(desc)
            .concat(options)
            .concat(cmds)
            .concat("")
            .join("\n");
    };
}