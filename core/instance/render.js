import {getValue} from "../util/ObjectUtil.js";
// 通过模板来找到哪些节点用到了这个模板
let template2VNode = new Map();

// 通过节点，找到这个节点下有哪些模板
let vNode2Template = new Map();

export function renderMixin(Due) {
    Due.prototype._render = function () {
        renderNode(this, this._vnode);
    }
}

export function renderNode(vm, vNode) {
    if (vNode.nodeType === 3) {
        // 是个文本节点
        let templates = vNode2Template.get(vNode);
        if (templates) {
            let result = vNode.text;
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vNode.env], templates[i]); // 当前节点的参数 可以来自于Due 对象，也可以来自于父级节点
                if (templateValue) {
                    result = result.replace('{{' + templates[i] + '}}', templateValue);
                }
            }
            // 文本节点直接进行 nodeValue 的 赋值
            vNode.elm.nodeValue = result;
        }
    } else if (vNode.nodeType === 1 && vNode.tag === 'INPUT') {
        let templates = vNode2Template.get(vNode);
        if (templates) {
            for (let i = 0; i < templates.length; i++) {
                let templateValue = getTemplateValue([vm._data, vNode.env], templates[i]);
                if (templateValue) {
                    vNode.elm.value = templateValue;
                }
            }
        }
    } else {
        for (let i = 0; i < vNode.children.length; i++) {
            renderNode(vm, vNode.children[i]);
        }
    }
}

export function prepareRender(vm, vNode) {
    if (vNode === null) {
        return;
    }
    if (vNode.nodeType === 3) {
        // 是个文本节点
        analysisTemplateString(vNode);
    }
    analysisAttr(vm, vNode);
    if (vNode.nodeType === 1) {
        // 元素节点
        for (let i = 0; i < vNode.children.length; i++) {
            prepareRender(vm, vNode.children[i]);
        }
    }
}

/**
 * 数据变化的时候，重现调用下渲染函数，使页面中相应的数据进行变化
 * @param vm
 * @param data
 */
export function renderData(vm, data) {
    let vNodes = template2VNode.get(data);
    if (vNodes != null) {
        for (let i = 0; i < vNodes.length; i++) {
            renderNode(vm, vNodes[i]);
        }
    }
}

/**
 * 对文本节点的文本进行模板分析
 * @param vNode
 */
function analysisTemplateString(vNode) {
    let templateStringList = vNode.text.match(/{{[a-zA-Z0-9_.]+}}/g);
    for (let i = 0; templateStringList && i < templateStringList.length; i++) {
        setTemplate2VNode(templateStringList[i], vNode);
        setVNode2Template(templateStringList[i], vNode);
    }
}

/**
 * 通过模板设置节点
 * @param template
 * @param vNode
 */
function setTemplate2VNode(template, vNode) {
    const templateName = getTemplateName(template);
    const vNodeSet = template2VNode.get(templateName);
    if (vNodeSet) {
        vNodeSet.push(vNode);
    } else {
        template2VNode.set(templateName, [vNode]);
    }
}

/**
 * 通过节点设置模板
 * @param template
 * @param vNode
 */
function setVNode2Template(template, vNode) {
    const templateSet = vNode2Template.get(vNode);
    if (templateSet) {
        templateSet.push(getTemplateName(template));
    } else {
        vNode2Template.set(vNode, [getTemplateName(template)]);
    }
}

/**
 * 对模板 {{xxx}} 进行解析
 * @param template
 * @returns {string|*}
 */
function getTemplateName(template) {
    // 判断是否有花括号，如果有，则解掉，如果没用，则直接返回
    if (template.substring(0, 2) === '{{' && template.substring(template.length - 2, template.length) === '}}') {
        return template.substring(2, template.length - 2);
    } else {
        return template;
    }

}

/**
 * 获取 双花括号 中 表达式的 值
 * @param obj
 * @param templateName
 * @returns {null|*}
 */
function getTemplateValue(obj, templateName) {
    for (let i = 0; i < obj.length; i++) {
        let temp = getValue(obj[i], templateName);
        if (temp != null) {
            return temp;
        }
    }
    return null;
}

/**
 * 分析属性
 * @param vm
 * @param vNode
 */
function analysisAttr(vm, vNode) {
    if (vNode.nodeType !== 1) {
        return;
    }
    let attrNames = vNode.elm.getAttributeNames();
    if (attrNames.indexOf('v-model') > -1) {
        setTemplate2VNode(vNode.elm.getAttribute('v-model'), vNode);
        setVNode2Template(vNode.elm.getAttribute('v-model'), vNode);
    }
}
