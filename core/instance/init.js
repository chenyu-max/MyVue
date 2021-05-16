import {constructorProxy} from "./proxy.js";

let uid = 0;

export function initMixin(Due) {
    Due.prototype._init = function (options) {
        const vm = this;
        vm.uid = uid++;
        vm._isDue = true;
        if (options && options.data) {
            vm._data = constructorProxy(vm, options.data, "");
        }
        // 初始化数据 Data
        // 初始化 create 方法
        // 初始化 methods
        // 初始化 computed
        // 初始化 el 并挂载
    }
}
