import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {

    const className = `square ${props.isWinner ? "square-winner" : ""}`;

    return (

        <button 
            className={ className }
            onClick={ props.onClick }
        > 
            { props.value }
        </button>
    )
}
  
class Board extends React.Component {

    renderSquare(i) {
      return (
        <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            isWinner={ this.props.winners.includes(i) }
        />
      );
    }
  
    render() {
      return (
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            <div className="divider-vertical divider-v-left"></div>
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="divider-horizontal"></div>
          <div className="board-row">
            {this.renderSquare(3)}
            <div className="divider-vertical divider-v-right"></div>
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="divider-horizontal"></div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
}
  
class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if(calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      
      const moves = history.map((step, move) => {

        let coords = undefined;
        if(move !== 0) {
            coords = getChangedSquareCoords(history[move-1], history[move]);
        }
        
        const desc = move ?
            `Go to move #${move} (${coords !== undefined ? `${coords[0]}/${coords[1]}` : ""})` :
            `Go to game start`
        
        if(this.state.stepNumber === move) {
            return (
                <li key={move}>
                    <button className="highlighted" onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        } else {
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        }
      });

      let status;

      if(this.state.stepNumber === 9 && !winner) {
        status = `No one won the game!`;
      } else {
        status = winner ? `Winner: ${winner.player}` : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board 
              squares={current.squares}
              winners={winner === null ? [] : winner.squares}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div className="game-status">{status}</div>
            <ul>{moves}</ul>
          </div>
        </div>
      );
    }
}
  
// ========================================
  
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], squares: [a, b, c]};
      }
    }
    return null;
}

function getChangedSquareCoords(oldSquares, currentSquares) {
    for(var i = 0; i < oldSquares.squares.length; i++) {
        if(oldSquares.squares[i] !== currentSquares.squares[i]) return getSquareCoordsFromIndex(i);
    }
    return undefined;
}

function getSquareCoordsFromIndex(i) {
    return [ Math.floor(i / 3), Math.floor(i % 3)];
}