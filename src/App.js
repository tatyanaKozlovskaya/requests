import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';

class App extends Component {

  clickHandler = (e) => {
    const method = e.target.dataset.method;
    if (method) {
      switch (method) {
        case 'ajax':
          console.log('ajax')
          break;
        case 'fetch':
          console.log('fetch')
          break;
        case 'webSocket':
          console.log('webSocket')
          break;
      }
    }
  }

  render() {
    return (
      <div className="App" onClick={this.clickHandler}>
        <header className="App-header">
          Запросы
        </header>
        <div className='btn-wrapper'>
          <div data-method='ajax' className='request-btn request-btn_active'>AJAX</div>
          <div data-method='fetch' className='request-btn '>fetch</div>
          <div data-method='webSocket' className='request-btn'>WebSocket</div>
        </div>

      </div>
    );
  }
}

export default App;
