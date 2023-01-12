import * as fs from 'fs';

function TString(str: string) {
    return str.substr(1, str.length - 2);
}

function TNumber(str: string) {
    return Number(str);
}

function TBoolean(str: string) {
    if (str.toLowerCase() == "true") return true;
    else if (str.toLowerCase() == "false") return false;
    else return null;
}

function TData(str: string) {
    return Load(str);
}

const Type = {
    string: TString,
    number: TNumber,
    boolean: TBoolean,
    data: TData,
    Get(type: string, value: string) {
        let f = Type[type];
        if (f == undefined) return null;
        else return f(value);
    }
}

function LoadResFile(filepath: string) {
    return Load(fs.readFileSync(filepath, 'utf-8'))
}
function Load(res: string) {
    let data_l = res.split('\n');
    enum Mode {
        defineType, defineType_start, defineKey, defineKey_start, defineValue, defineValue_start, defineValue_start_level
    }
    let mode = Mode.defineType

    let data = {
        "Get": function<T>(key:string) {
            return <T>data[key];
        }
    };

    let obj_type: string = "";
    let obj_key: string = "";
    let obj_value: string = "";

    let name = /\s/gm

    let level = 0;

    for (let i = 0; i < data_l.length; i++) {
        for (let c = 0; c < data_l[i].length; c++) {
            switch (mode) {
                case Mode.defineType:
                    if (!name.test(data_l[i][c]) && data_l[i][c] != ' ' && data_l[i][c] != ';' && data_l[i][c] != '\r') {
                        mode = Mode.defineType_start
                        obj_type += data_l[i][c];
                    }
                    break;
                case Mode.defineType_start:
                    if (data_l[i][c] == ' ' || data_l[i][c] == '\n') {
                        mode = Mode.defineKey
                    } else {
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
                    } else {
                        obj_key += data_l[i][c];
                    }
                    break;
                case Mode.defineValue:
                    if (data_l[i][c] == '{') {
                        level++;
                        mode = Mode.defineValue_start_level;
                    } else if (!name.test(data_l[i][c])) {
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
                    } else {
                        obj_value += data_l[i][c];
                    }
                    break;
                case Mode.defineValue_start_level:
                    if (data_l[i][c] == '{') {
                        level++;
                        obj_value += data_l[i][c];
                    } else if (data_l[i][c] == '}') {
                        level--;
                        if (level == 0) {
                            // console.log(__test(obj_type, obj_key, obj_value))
                            data[obj_key] = Type.Get(obj_type, obj_value);
                            obj_key = '';
                            obj_type = '';
                            obj_value = '';
                            mode = Mode.defineType;
                        } else {
                            obj_value += data_l[i][c];
                        }
                    } else {
                        obj_value += data_l[i][c];
                    }
                    break;
            }
        }
    }
    return data;
}

function __test(type: string, key: string, value: string) {
    return `Type : <${type}>
Key : "${key}"
Value : ${value}`
}


export { LoadResFile }
