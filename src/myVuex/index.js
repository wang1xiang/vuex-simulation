let _Vue = null
function install (Vue) {
  _Vue = Vue
  Vue.mixin({
    // 混入到beforeCreate阶段
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

class Store {
  constructor (options) {
    const {
      // 防止用户未传入 设置默认对象
      state = {},
      getters = {},
      mutations = {},
      actions = {}
    } = options

    // 设置state的响应式
    this.state = _Vue.observable(state)
    /* 
      此处不直接 this.getters = getters，是因为下面的代码中要方法 getters 中的 key
      如果这么写的话，会导致 this.getters 和 getters 指向同一个对象
      当访问 getters 的 key 的时候，实际上就是访问 this.getters 的 key 会触发 key 属性的 getter
      会产生死递归
    */
    this.getters = Object.create(null)
    Object.keys(getters).forEach(key => {
      Object.defineProperty(this.getters, key, {
        get: () => getters[key](state)
      })
    })

    // 私有属性
    this._mutations = mutations
    this._actions = actions
  }

  commit (type, payload) {
    this._mutations[type](this.state, payload)
  }

  dispatch (type, payload) {
    this._action[type](this, payload)
  }
}

export default {
  install,
  Store
}