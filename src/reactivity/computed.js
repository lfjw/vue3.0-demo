

import { isFunction } from './../shared/utils'
import { effect, track, trigger } from './effect';
import { TrackOpTypes, TriggerOpTypes } from './operation';
export function computed(getterOrOptions) {
    let getter;
    let setter;

    if (isFunction(getterOrOptions)) {
        getter = getterOrOptions;
        setter = () => { }
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }

    let dirty = true; // 默认地址一次取值是执行getter方法的
    let computed;
    //计算属性也是一个effect 
    let runner = effect(getter, {
        lazy: true, // 懒加载 不会立即执行
        computed: true, // 仅仅是个标识 是一个计算属性
        scheduler: () => {
            if (!dirty) {
                dirty = true // 等会计算属性的依赖的值发生变化后，就会执行这个 scheduler
                trigger(computed, TriggerOpTypes.SET, 'value')
            }
        }
    })
    let value;
    computed = {
        get value() {
            if (dirty) { // 多次取值不会重新执行
                value = runner() // 调用了effect createReactiveEffect  return fn() 拿到了这个结果
                dirty = false;

                // 修改之后才能触发
                track(computed, TrackOpTypes.GET, 'value')// 收集value属性
            }
            return value
        },
        set value(newValue) {
            setter(newValue)
        }
    }

    return computed
}