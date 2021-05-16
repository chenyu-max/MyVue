import VNode from "../vdom/vnode.js";
import {prepareRender} from "./render.js";

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

function constructorVNode(vm, elm, parent) {
    let vNode = null;
    let children = [];
    let text = getNodeText(elm);
    let data = null;
    let nodeType = elm.nodeType;
    let tag = elm.nodeName;
    vNode = new VNode(tag, elm, children, text, data, parent, nodeType);
    let childrenArr = vNode.elm.childNodes;
    // 深度优鲜搜索
    for (let i = 0; i < childrenArr.length; i++) {
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

function getNodeText(elm) {
    // 如果是文本节点，返回文本内容
    if (elm.nodeType === 3) {
        return elm.nodeValue;
    } else {
        return '';
    }
}
