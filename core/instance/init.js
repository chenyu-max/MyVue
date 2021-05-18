import {constructorProxy} from "./proxy.js";
import {mount} from "./mount.js";

let uid = 0;

export function initMixin(Due) {
    Due.prototype._init = function (options) {
        const vm = this;
        vm.uid = uid++;
        vm._isDue = true;
        // 初始化数据 Data
        if (options && options.data) {
            vm._data = constructorProxy(vm, options.data, "");
        }
        // 初始化 create 方法
        if (options && options.created) {
            vm._created = options.created;
        }
        // 初始化 methods
        if (options && options.methods) {
            vm._methods = options.methods;
            for (let temp in options.methods) {
                vm[temp] = options.methods[temp];
            }
        }
        // 初始化 computed
        if (options && options.computed) {
            vm._computed = options.computed;
        }
        // 初始化 el 并挂载
        if (options && options.el) {
            let rootDom = document.getElementById(options.el);
            mount(vm, rootDom);
        }
    }
}
