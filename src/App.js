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
        case 'ajax':
          this.createRequest();
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

  createRequest = () => {
    let request = false;

    if (window.XMLHttpRequest) {
      //Gecko-совместимые браузеры, Safari, Konqueror
      request = new XMLHttpRequest();
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
    const showContents = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
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
    request.onreadystatechange = showContents;
    request.open('GET', 'names.json', false);
    request.send();

    console.log(request)
    return request;
  }



  render() {
    const { peoples } = this.state
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

        {peoples.length !== 0 &&
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
