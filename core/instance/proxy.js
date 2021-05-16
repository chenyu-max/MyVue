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

    } else if (obj instanceof Object) { // 判断这个对象是否位对象
        proxyObj = constructorObjectProxy(vm, obj, namespace);
    } else {
        throw new Error('error Only Array and Object');
    }
    return proxyObj;
}

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
                }
            });
            Object.defineProperty(vm, prop, {
                configurable: true,
                get() {
                    return obj[prop];
                },
                set(value) {
                    console.log(getNameSpace(namespace, prop));
                    obj[prop] = value;
                }
            })
            if (obj[prop] instanceof Object) {
                proxyObj[prop] = constructorProxy(vm, obj[prop], getNameSpace(namespace, prop));
            }
        }
    }
    return proxyObj;
}
