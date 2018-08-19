import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';

var getKey = (() => {

  var counter = 0
  return (() => {
    counter = counter + 1
    return counter
  })

})()

class App extends Component {

  state = {
    peoples: [],
    websocketData: '',
    websocketMessage: ''
  }

  clickHandler = (e) => {
    const method = e.target.dataset.method;
    if (method) {
      switch (method) {
        case 'ajaxget':
        case 'ajaxpost':
          this.createRequest(method);
          break;
        case 'fetch':
          this.sendFetchRequest();
          break;
        case 'webSocket':
          this.openWebSocket();
          break;
      }
    }
  }

  createRequest = (method) => {
    let request = false;

    if (window.XMLHttpRequest) {
      //Gecko-совместимые браузеры, Safari, Konqueror
      request = new XMLHttpRequest();
      request.overrideMimeType('text/xml');

    } else if (window.ActiveXObject) {
      //Internet explorer
      try {
        request = new window.ActiveXObject("Microsoft.XMLHTTP");
      }
      catch (CatchException) {
        request = new window.ActiveXObject("Msxml2.XMLHTTP");
      }
    }

    if (!request) {
      console.log('Невозможно создать XMLHttpRequest');
    }

    request.onreadystatechange = this.showContents;

    if (method === 'ajaxget') {
      this.sendGETRequest(request)
    } else if (method === 'ajaxpost') {
      this.sendPOSTRequest(request)
    }


    return request;
  }

  sendGETRequest = (request) => {
    request.open('GET', 'names.json', true);
    request.send();
  }

  sendPOSTRequest = (request) => {
    request.open('POST', '/names', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(null);
  }

  sendFetchRequest = () => {
    fetch('/names')
      .then(res => {
        return res.json()
      })
      .then(users => this.setState({ peoples: users }, console.log(users)));
  }

  openWebSocket = () => {
    const wsUri = "wss://echo.websocket.org/";
    const websocket = new WebSocket(wsUri);
    websocket.onopen = (e) => {
      this.setState({
        websocket: websocket,
        websocketData: 'открыт websocket!',
        websocketIsOpen: true
      })

      // websocket.send('Привет от websocket');
    };
    websocket.onclose = (e) => {
      this.setState({
        websocketData: 'websocket закрыт!'
      })
    };
    websocket.onmessage = (e) => {
      this.setState({
        websocketData: e.data
      })
    };
    websocket.onerror = (e) => {
      this.setState({
        websocketData: 'error: ' + e.data
      })
    };
  }

  saveMessage = (e) => {
    const msg = e.target.value
    this.setState({
      websocketMessage: msg
    })
  }

  sendMessageWebsocket = (e) => {
    const msg = this.state.websocketMessage;
    if (!this.state.websocket) return
    this.state.websocket.send(msg)
    this.setState({
      websocketMessage: ''
    })
  }

  closeWebsocket = () => {
    this.state.websocket.close()
  }

  showContents = (e) => {
    const request = e.currentTarget;
    try {

      if (request.readyState == 4) {
        console.log(request)
        console.log(e)
        if (request.status === 200) {

          console.log(request)
          const answer = JSON.parse(request.responseText);
          console.log(answer)
          this.setState({
            peoples: answer
          })
        } else {
          console.log('есть проблемы');
        }
      }
    }
    catch (e) {
      console.log(e.description)
    }
  }



  render() {
    const { peoples, websocketData, websocketMessage } = this.state
    return (
      <div className="App" onClick={this.clickHandler}>
        <header className="App-header">
          Запросы
        </header>
        <div className='btn-wrapper'>
          <div data-method='ajaxget' className='request-btn request-btn_active'>AJAX GET</div>
          <div data-method='ajaxpost' className='request-btn request-btn_active'>AJAX POST</div>
          <div data-method='fetch' className='request-btn request-btn_active'>fetch</div>
          <div data-method='webSocket' className='request-btn request-btn_active'>WebSocket</div>
        </div>

        {peoples && peoples.length !== 0 &&
          <div className='content'>
            <div>Получена информация:</div>
            {peoples.map((el, index) => {
              return <div className='content__item' key={getKey()}>{`Имя: ${el.name}, возраст: ${el.age}, любимый цвет: ${el.color}`}</div>
            })}
          </div>
        }

        {websocketData &&
          <div className='websocket'>
            <div className='websocket__title'>WEBSOCKET</div>
            <div className='websocket__data'>{websocketData}</div>
            <input placeholder='введите сообщение' value={websocketMessage} onChange={this.saveMessage}></input>
            <button onClick={this.sendMessageWebsocket}>Отправить</button>
            <button onClick={this.closeWebsocket}>Закрыть websocket</button>
          </div>
        }


      </div>
    );
  }
}

export default App;
