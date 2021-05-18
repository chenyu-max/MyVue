import {renderData} from "./render.js";
import {rebuild} from "./mount.js";
import {getValue} from "../util/ObjectUtil.js";

/**
 * 我们要知道哪个属性被修改了，才能对页面上的内容进行更新
 * 我们必须先能够捕获修改的事件
 * 所以我们需要代理的方式来实现监听属性的修改
 * @param vm            表示 Due对象
 * @param obj           表示要代理的对象
 * @param namespace
 */
export function constructorProxy(vm, obj, namespace) {
    // 递归
    let proxyObj = null;
    if (obj instanceof Array) { // 判断这个对象是否位数组
        proxyObj = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            proxyObj[i] = constructorProxy(vm, obj[i], namespace);
        }
        proxyObj = proxyArr(vm, obj, namespace);
    } else if (obj instanceof Object) { // 判断这个对象是否位对象
        proxyObj = constructorObjectProxy(vm, obj, namespace);
    } else {
        throw new Error('error Only Array and Object');
    }
    return proxyObj;
}

/**
 * 获得当前需要代理的对象的 namespace
 * @param nowNameSpace  现在的namespace
 * @param nowProp       现在的属性
 * @returns {string|*}  返回新的namespace
 */
function getNameSpace(nowNameSpace, nowProp) {
    if (nowNameSpace === '' || nowNameSpace === null) {
        return nowProp;
    } else if (nowProp === '' || nowProp === null) {
        return nowNameSpace;
    } else {
        return nowNameSpace + '.' + nowProp;
    }
}

function constructorObjectProxy(vm, obj, namespace) {
    let proxyObj = {};

    for (let prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            Object.defineProperty(proxyObj, prop, {
                configurable: true,
                get() {
                    return obj[prop];
                },
                set(value) {
                    obj[prop] = value;
                    renderData(vm, getNameSpace(namespace, prop));
                }
            });
            Object.defineProperty(vm, prop, {
                configurable: true,
                get() {
                    return obj[prop];
                },
                set(value) {
                    obj[prop] = value;
                    let val = getValue(vm._data, getNameSpace(namespace, prop));
                    if (val instanceof Array) {
                        rebuild(vm, getNameSpace(namespace, prop));
                        renderData(vm, getNameSpace(namespace, prop));
                    } else {
                        renderData(vm, getNameSpace(namespace, prop));
                    }

                }
            })
            if (obj[prop] instanceof Object) {
                proxyObj[prop] = constructorProxy(vm, obj[prop], getNameSpace(namespace, prop));
            }
        }
    }
    return proxyObj;
}

// 将 Array 的 prototype 取出
const arrayProto = Array.prototype;

/**
 * 对 数组的函数操作进行代理
 * @param obj       代理到哪个对象身上
 * @param func      哪个函数需要代理
 * @param namespace
 * @param vm
 */
function defArrayFunc(obj, func, namespace, vm) {
    Object.defineProperty(obj, func, {
        enumerable: true,
        configurable: true,
        value: function (...args) {
            let original = arrayProto[func];
            const result = original.apply(this, args);
            rebuild(vm, getNameSpace(namespace, ""));
            renderData(vm, getNameSpace(namespace, ""));
            return result;
        },
    })
}

/**
 * 对数组进行代理操作
 * @param vm        vm对象
 * @param arr       需要代理的数组
 * @param namespace
 * @returns {*}
 */
function proxyArr(vm, arr, namespace) {
    let obj = {
        eleType: 'Array',
        toString: function () {
            let result = '';
            for (let i = 0; i < arr.length; i++) {
                result += arr[i] + ", ";
            }
            return result.substring(0, result.length - 2); // -2 是把逗号和空格去掉
        },
        push() {
        },
        pop() {
        },
        shift() {
        },
        unshift() {
        },
    };
    defArrayFunc.call(vm, obj, 'push', namespace, vm);
    defArrayFunc.call(vm, obj, 'pop', namespace, vm);
    defArrayFunc.call(vm, obj, 'shift', namespace, vm);
    defArrayFunc.call(vm, obj, 'unshift', namespace, vm);
    arr.__proto__ = obj;
    return arr;
}
