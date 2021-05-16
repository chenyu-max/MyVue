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
