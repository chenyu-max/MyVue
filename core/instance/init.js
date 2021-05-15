let uid = 0;

export function initMixin(Due) {
    Due.prototype._init = function () {
        const vm = this;
        vm.uid = uid++;
        vm._isDue = true;
        // 初始化数据 Data
        // 初始化 create 方法
        // 初始化 methods
        // 初始化 computed
        // 初始化 el 并挂载
    }
}
