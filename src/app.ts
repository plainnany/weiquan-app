import { Component } from 'react'
import './app.less'

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}
  // this.props.children 是将要会渲染的页面
  render() {
    return (this.props as any).children
  }
}

export default App
