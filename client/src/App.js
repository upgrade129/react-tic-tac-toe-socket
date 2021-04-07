import React, { Component } from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
const url = "http://localhost:4000";


class App extends Component {

  

  constructor(props) {
    super(props)
    this.state = {
      user:"X",
      board: [
        "", "", "", "", "", "", "", "", ""
      ],
      winner: null,
      socketRef:""
    }
    const enteredName = prompt('Please enter room name')
   
    this.state.socketRef = socketIOClient(url,
      {
        query:{enteredName}
      });
      this.state.socketRef.on("update",(data)=>{
        this.setState( {board : data.board });
      });
      
      this.state.socketRef.emit("toggleuser","0");

      this.state.socketRef.on("toggleuser",(data)=>{
        this.setState({user:data});
      })


  }

  updateSocket(){
    const da ={ board: this.state.board }
    this.state.socketRef.emit("update",da);
    this.state.socketRef.on("update",(data)=>{
      this.setState( {board : data.board , currentTurn : data.turn});
     
    });
  }

 

  
  

  handleClick(index) {
    if(this.state.board[index] === "" && !this.state.winner) {
      this.state.board[index] = this.state.user
      this.setState({
        board: this.state.board,
        winner: this.checkForWinner(),
      })
      this.updateSocket();
    }
  }
  
  checkForWinner() {
    var symbols = this.state.board
    var winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
    return winningCombos.find(function(combo) {
      if(symbols[combo[0]] !== "" && symbols[combo[1]] !== ""  && symbols[combo[2]] !== ""  && symbols[combo[0]] === symbols[combo[1]] && symbols[combo[1]] === symbols[combo[2]]) {
        return true
      } else {
        return false
      }
    })
  }
  
  render() {
    return (
      <div className="app-container">
        <h1>React Tic Tac Toe Game</h1>
        <h2>Your are -- {this.state.user}</h2>
        <div className="board">
        {this.state.board.map((cell, index) => {
          return <div key={index} onClick={() => this.handleClick(index)} className="square">{cell}</div>;
        })}
        </div>
        {this.state.winner ? <h2 className="winner">{`The final winner: ${this.state.winner}`}</h2> : null}
      </div>
    )
  }
}

export default App;