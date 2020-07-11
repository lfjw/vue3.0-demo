import { isObject } from './../shared/utils'
import { mutableHandler } from './baseHandlers'

/**
 * 
 * @param {*} target 目标对象
 */
export function reactive(target) {
    return createReactiveObject(target, mutableHandler)
}

function createReactiveObject(target, baseHandler) {
    // 如果不是对象直接返回即可
    if (!isObject(target)) {
        return target;
    }

    // 是对象进行代理
    const observed = new Proxy(target, baseHandler)
    return observed
}