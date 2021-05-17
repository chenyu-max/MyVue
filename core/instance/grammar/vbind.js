import {getValue} from "../../util/ObjectUtil.js";

export function checkVBind(vm, vNode) {
    if (vNode.nodeType !== 1) {
        return;
    }
    let attrNames = vNode.elm.getAttributeNames();
    for (let i = 0; i < attrNames.length; i++) {
        if (attrNames[i].indexOf('v-bind:') === 0 || attrNames[i].indexOf(':') === 0) {
            vBind(vm, vNode, attrNames[i], vNode.elm.getAttribute(attrNames[i]));
        }
    }
}


function vBind(vm, vNode, name, value) {
    let key = name.split(':')[1];
    let val = getValue(vm._data, value);
    vNode.elm.setAttribute(key, val);
}
