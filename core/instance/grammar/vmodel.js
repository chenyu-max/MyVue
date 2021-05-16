import {setValue} from "../../util/ObjectUtil.js";

export function vmodel(vm, elm, data) {
    elm.onchange = function (event) {
        setValue(vm._data, data, elm.value); // Due 对象   该元素绑定的属性   该元素的 新value
    }
}
