import {getValue} from "../../util/ObjectUtil.js";

export function checkVOn(vm, vNode) {
    if (vNode.nodeType !== 1) {
        return;
    }
    let attrNames = vNode.elm.getAttributeNames();
    for (let i = 0; i < attrNames.length; i++) {
        if (attrNames[i].indexOf('v-on:') === 0 || attrNames.indexOf('@') === 0) {
            vOn(vm, vNode, attrNames[i].split(':')[1], vNode.elm.getAttribute(attrNames[i]));
        }
    }
}

function vOn(vm, vNode, event, name) {
    let method = getValue(vm._methods, name);
    if (method) {
        vNode.elm.addEventListener(event, proxyExecute(vm, method));
    }
}

function proxyExecute(vm, method) {
    return function () {
        method.call(vm)
    }
}
