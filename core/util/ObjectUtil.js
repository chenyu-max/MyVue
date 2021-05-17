/**
 * 获取 模板中 对象表达式的值
 * 如 obj1.obj2.obj3.a  我们可以获取到 a 的值
 * @param obj
 * @param name
 * @returns {undefined|*}
 */
export function getValue(obj, name) {
    if (!obj) {
        return obj;
    }
    let nameList = name.split('.');
    let temp = obj;
    for (let i = 0; i < nameList.length; i++) {
        if (temp[nameList[i]]) {
            temp = temp[nameList[i]];
        } else {
            return undefined;
        }
    }
    return temp;
}

export function setValue(obj, attr, value) {
    if (!obj) {
        return obj;
    }
    let attrList = attr.split(".");
    let temp = obj;
    // 只循环到倒数第二层
    for (let i = 0; i < attrList.length - 1; i++) {
        if (temp[attrList[i]]) {
            temp = temp[attrList[i]];
        } else {
            return;
        }
    }
    // 此时的 temp 已经到达了倒数第二层
    if (temp[attrList[attrList.length - 1]] != null) {
        temp[attrList[attrList.length - 1]] = value;
    }
}

/**
 * 将两对象 合并
 * @param obj1
 * @param obj2
 * @returns {*[]|*|{}|{}}
 */
export function mergeAttr(obj1, obj2) {
    if (obj1 === null) {
        return clone(obj2);
    }
    if (obj2 === null) {
        return clone(obj1);
    }
    let result = {};
    let obj1Attrs = Object.getOwnPropertyNames(obj1);
    for (let i = 0; i < obj1Attrs.length; i++) {
        result[obj1Attrs[i]] = obj1[obj1Attrs[i]];
    }
    let obj2Attrs = Object.getOwnPropertyNames(obj2);
    for (let i = 0; i < obj2Attrs.length; i++) {
        result[obj2Attrs[i]] = obj2[obj2Attrs[i]];
    }
    return result;
}

/**
 * 克隆 对象 或者 数组  或者值
 * @param obj
 * @returns {any[]|*|{}}
 */
function clone(obj) {
    if (obj instanceof Array) {
        return cloneArray(obj);
    } else if (obj instanceof Object) {
        return cloneObject(obj);
    } else {
        // 如果是 原始值，则直接返回
        return obj;
    }
}

// 和三个克隆方法 用到了递归

function cloneObject(obj) {
    let result = {};
    let names = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < names.length; i++) {
        result[names[i]] = clone(obj[names[i]]);
    }
    return result;
}

function cloneArray(obj) {
    let result = new Array(obj.length);
    for (let i = 0; i < obj.length; i++) {
        result[i] = clone(obj[i]);
    }
    return result;
}

function easyClone(obj) {
    // 这种方法有局限性，无法合并代理对象  比如 vm._data
    return JSON.parse(JSON.stringify(obj));
}
