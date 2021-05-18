import {getValue, getEnvAttr} from "../../util/ObjectUtil.js";
import {generateCode, isTrue} from "../../util/code.js";

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
    if (/^{[\w\W]+}$/.test(value)) {
        let str = value.substring(1, value.length - 1).trim();
        let expressionList = str.split(',');
        let result = analysisExpression(vm, vNode, expressionList);
        vNode.elm.setAttribute(key, result);
    } else {
        let val = getValue(vm._data, value);
        vNode.elm.setAttribute(key, val);
    }
}

/**
 * 解析表达式
 * @param vm
 * @param vNode
 * @param expressionList
 */
function analysisExpression(vm, vNode, expressionList) {
    // 获取当前环境的变量
    let attr = getEnvAttr(vm, vNode);
    // 判断表达式是否成立
    let envCode = generateCode(attr);
    let result = "";
    for (let i = 0; i < expressionList.length; i++) {
        let site = expressionList[i].indexOf(":");
        if (site > -1) {
            if (isTrue(expressionList[i].substring(site + 1, expressionList[i].length), envCode)) {
                result += expressionList[i].substring(0, site) + ",";
            }
        } else {
            result += expressionList[i] + ",";
        }
    }
    if (result.length > 0) {
        result = result.substring(0, result.length - 1);
    }
    return result;
    // 拼组result
}
