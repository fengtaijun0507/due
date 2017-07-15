import initEvent from './init/initEvent'
import initOptions from './init/initOptions'
import initState from './init/initState'
import initLifeCycle from './init/lifeCycle'
function Due(options) {
  this._init(options)
}
initOptions(Due)
initEvent(Due)
initState(Due)
initLifeCycle(Due)
export default Due