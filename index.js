"use strict";
exports.__esModule = true;
exports.LoadResFile = void 0;
var fs = require("fs");
function TString(str) {
    return str.substr(1, str.length - 2);
}
function TNumber(str) {
    return Number(str);
}
function TBoolean(str) {
    if (str.toLowerCase() == "true")
        return true;
    else if (str.toLowerCase() == "false")
        return false;
    else
        return null;
}
function TData(str) {
    return Load(str);
}
var Type = {
    string: TString,
    number: TNumber,
    boolean: TBoolean,
    data: TData,
    Get: function (type, value) {
        var f = Type[type];
        if (f == undefined)
            return null;
        else
            return f(value);
    }
};
function LoadResFile(filepath) {
    return Load(fs.readFileSync(filepath, 'utf-8'));
}
exports.LoadResFile = LoadResFile;
function Load(res) {
    var data_l = res.split('\n');
    var Mode;
    (function (Mode) {
        Mode[Mode["defineType"] = 0] = "defineType";
        Mode[Mode["defineType_start"] = 1] = "defineType_start";
        Mode[Mode["defineKey"] = 2] = "defineKey";
        Mode[Mode["defineKey_start"] = 3] = "defineKey_start";
        Mode[Mode["defineValue"] = 4] = "defineValue";
        Mode[Mode["defineValue_start"] = 5] = "defineValue_start";
        Mode[Mode["defineValue_start_level"] = 6] = "defineValue_start_level";
    })(Mode || (Mode = {}));
    var mode = Mode.defineType;
    var data = {
        "Get": function (key) {
            var r = data[key];
            return r;
        }
    };
    var obj_type = "";
    var obj_key = "";
    var obj_value = "";
    var name = /\s/gm;
    var level = 0;
    for (var i = 0; i < data_l.length; i++) {
        for (var c = 0; c < data_l[i].length; c++) {
            switch (mode) {
                case Mode.defineType:
                    if (!name.test(data_l[i][c]) && data_l[i][c] != ' ' && data_l[i][c] != ';' && data_l[i][c] != '\r') {
                        mode = Mode.defineType_start;
                        obj_type += data_l[i][c];
                    }
                    break;
                case Mode.defineType_start:
                    if (data_l[i][c] == ' ' || data_l[i][c] == '\n') {
                        mode = Mode.defineKey;
                    }
                    else {
                        obj_type += data_l[i][c];
                    }
                    break;
                case Mode.defineKey:
                    if (data_l[i][c] != ' ' && data_l[i][c] != '\n') {
                        mode = Mode.defineKey_start;
                        obj_key += data_l[i][c];
                    }
                    break;
                case Mode.defineKey_start:
                    if (data_l[i][c] == ' ' || data_l[i][c] == '\n') {
                        mode = Mode.defineValue;
                    }
                    else {
                        obj_key += data_l[i][c];
                    }
                    break;
                case Mode.defineValue:
                    if (data_l[i][c] == '{') {
                        level++;
                        mode = Mode.defineValue_start_level;
                    }
                    else if (!name.test(data_l[i][c])) {
                        mode = Mode.defineValue_start;
                        obj_value += data_l[i][c];
                    }
                    break;
                case Mode.defineValue_start:
                    if (data_l[i][c] == ';') {
                        // console.log(__test(obj_type, obj_key, obj_value))
                        data[obj_key] = Type.Get(obj_type, obj_value);
                        obj_key = '';
                        obj_type = '';
                        obj_value = '';
                        mode = Mode.defineType;
                    }
                    else {
                        obj_value += data_l[i][c];
                    }
                    break;
                case Mode.defineValue_start_level:
                    if (data_l[i][c] == '{') {
                        level++;
                        obj_value += data_l[i][c];
                    }
                    else if (data_l[i][c] == '}') {
                        level--;
                        if (level == 0) {
                            // console.log(__test(obj_type, obj_key, obj_value))
                            data[obj_key] = Type.Get(obj_type, obj_value);
                            obj_key = '';
                            obj_type = '';
                            obj_value = '';
                            mode = Mode.defineType;
                        }
                        else {
                            obj_value += data_l[i][c];
                        }
                    }
                    else {
                        obj_value += data_l[i][c];
                    }
                    break;
            }
        }
    }
    return data;
}
function __test(type, key, value) {
    return "Type : <".concat(type, ">\nKey : \"").concat(key, "\"\nValue : ").concat(value);
}
