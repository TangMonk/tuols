import './index.html'
import dva from 'dva'

let state = localStorage.getItem('app')
if(state){
  try {
    state = {app: JSON.parse(state)}
  } catch (error) {
    state = null
  }
}

// 1. Initialize
const app = dva({
  initialState: state,
  onStateChange() {
    let state = app._store.getState()
    localStorage.setItem('app', JSON.stringify(state.app))
  }
})
// 2. Model

app.model(require('./models/app'))

// 3. Router
app.router(require('./router'))

// 4. Start
app.start('#root')
