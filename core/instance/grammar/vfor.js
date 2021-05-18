import VNode from "../../vdom/vnode.js";
import {getValue} from "../../util/ObjectUtil.js";

export function vforInit(vm, elm, parent, instruction) {
    let virtualNode = new VNode(elm.nodeName, elm, [], "", getVirtualNodeData(instruction)[2], parent, 0);
    virtualNode.instructions = instruction;
    parent.elm.removeChild(elm);
    parent.elm.appendChild(document.createTextNode(""));
    let result = analysisInstruction(vm, instruction, elm, parent);
    return virtualNode;
}

/**
 * 获取v-for指令内的数据内容
 * @param instructions
 * @returns {string[]}
 */
function getVirtualNodeData(instructions) {
    let insSet = instructions.trim().split(" ");
    if (insSet.length !== 3 || insSet[1] !== 'in' && insSet[1] !== 'of') {
        throw new Error('v-for error');
    }
    return insSet;
}

/**
 * 分析 v-for 指令中的内容
 * @param vm
 * @param instruction
 * @param elm
 * @param parent
 * @returns {*[]}
 */
function analysisInstruction(vm, instruction, elm, parent) {
    let insSet = getVirtualNodeData(instruction);
    let dataSet = getValue(vm._data, insSet[2]);
    if (!dataSet) {
        throw new Error(`Can't find value for ${insSet[2]}`);
    }
    let resultSet = [];
    for (let i = 0; i < dataSet.length; i++) {
        let tempDom = document.createElement(elm.nodeName);
        tempDom.innerHTML = elm.innerHTML;
        let env = analysisKV(insSet[0], dataSet[i], i); // 获取局部变量
        tempDom.setAttribute('env', JSON.stringify(env));  // 将变量设置到dom 中去
        parent.elm.appendChild(tempDom);
        resultSet.push(tempDom);
    }
    return resultSet;
}

/**
 * 设置 env  即 设置了局部变量
 * @param instructions
 * @param value
 * @param index
 * @returns {{}}
 */
function analysisKV(instructions, value, index) {
    if (/([a-zA-Z0-9_$]+)/.test(instructions)) {
        // 有括号
        instructions = instructions.trim();
        instructions = instructions.substring(1, instructions.length - 1);
    }
    let keys = instructions.split(',');
    if (keys.length === 0) {
        throw new Error('error');
    }
    let obj = {};
    if (keys.length >= 1) {
        obj[keys[0].trim()] = value;
    }
    if (keys.length >= 2) {
        obj[keys[1].trim()] = index;
    }
    return obj;
}
