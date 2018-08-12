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
    peoples: []
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
          console.log('webSocket')
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
    const { peoples } = this.state
    return (
      <div className="App" onClick={this.clickHandler}>
        <header className="App-header">
          Запросы
        </header>
        <div className='btn-wrapper'>
          <div data-method='ajaxget' className='request-btn request-btn_active'>AJAX GET</div>
          <div data-method='ajaxpost' className='request-btn request-btn_active'>AJAX POST</div>
          <div data-method='fetch' className='request-btn request-btn_active'>fetch</div>
          <div data-method='webSocket' className='request-btn'>WebSocket</div>
        </div>

        {peoples && peoples.length !== 0 &&
          <div className='content'>
            <div>Получена информация:</div>
            {peoples.map((el, index) => {
              return <div className='content__item' key={getKey()}>{`Имя: ${el.name}, возраст: ${el.age}, любимый цвет: ${el.color}`}</div>
            })}
          </div>
        }


      </div>
    );
  }
}

export default App;
