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
