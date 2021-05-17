import VNode from "../vdom/vnode.js";
import {prepareRender, getVNodeByTemplate, clearMap} from "./render.js";
import {vmodel} from "./grammar/vmodel.js";
import {vforInit} from "./grammar/vfor.js";
import {mergeAttr} from "../util/ObjectUtil.js";
import {checkVBind} from "./grammar/vbind.js";

export function initMount(Due) {
    Due.prototype.$mount = function (el) {
        let vm = this;
        let rootDom = document.getElementById(el);
        mount(vm, rootDom);
    }
}

export function mount(vm, elm) {
    // 进行挂载
    vm._vnode = constructorVNode(vm, elm, null);
    // 进行预备渲染(建立渲染索引，通过模板找vNode，通过vNode找模板)
    prepareRender(vm, vm._vnode);
}

export function rebuild(vm, template) {
    let virtualNode = getVNodeByTemplate(template);
    for (let i = 0; i < virtualNode.length; i++) {
        virtualNode[i].parent.elm.innerHTML = '';
        // 将模板还原，方便之后的重新编译渲染
        virtualNode[i].parent.elm.appendChild(virtualNode[i].elm);
        let result = constructorVNode(vm, virtualNode[i].elm, virtualNode[i].parent);
        virtualNode[i].parent.children = [result];
        clearMap();
        prepareRender(vm, vm._vnode);
    }
}

function constructorVNode(vm, elm, parent) {
    let vNode = analysisAttr(vm, elm, parent);
    if (vNode == null) {
        let children = [];
        let text = getNodeText(elm);
        let data = null;
        let nodeType = elm.nodeType;
        let tag = elm.nodeName;
        vNode = new VNode(tag, elm, children, text, data, parent, nodeType);
        if (elm.nodeType === 1 && elm.getAttribute('env')) {
            vNode.env = mergeAttr(vNode.env, JSON.parse(elm.getAttribute('env')));
        } else {
            vNode.env = mergeAttr(vNode.env, parent ? parent.env : {});
        }
    }
    checkVBind(vm, vNode);
    let childrenArr = vNode.nodeType === 0 ? vNode.parent.elm.childNodes : vNode.elm.childNodes;
    let len = vNode.nodeType === 0 ? vNode.parent.elm.childNodes.length : vNode.elm.childNodes.length;
    // 深度优先搜索
    for (let i = 0; i < len; i++) {
        // 进行递归搜索
        let childNodes = constructorVNode(vm, childrenArr[i], vNode);
        if (childNodes instanceof VNode) { // 返回单一节点的时候
            vNode.children.push(childNodes);
        } else { // 返回节点数组的时候
            vNode.children = vNode.children.concat(childNodes);
        }
    }
    return vNode;
}

/**
 * 如果是文本节点，返回文本内容
 * @param elm
 * @returns {string|any}
 */
function getNodeText(elm) {
    if (elm.nodeType === 3) {
        return elm.nodeValue;
    } else {
        return '';
    }
}

/**
 * 分析属性
 * @param vm
 * @param elm
 * @param parent
 */
function analysisAttr(vm, elm, parent) {
    if (elm.nodeType === 1) {
        let attrNames = elm.getAttributeNames();
        if (attrNames.indexOf('v-model') > -1) {
            vmodel(vm, elm, elm.getAttribute('v-model'));
        }
        if (attrNames.indexOf('v-for') > -1) {
            return vforInit(vm, elm, parent, elm.getAttribute('v-for'));
        }
    }
}
