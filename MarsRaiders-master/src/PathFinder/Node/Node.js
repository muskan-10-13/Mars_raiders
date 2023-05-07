import React, {Component} from "react"
import ReactDOM from "react-dom"
import './Node.css'



export default class Node extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const {
            col,
            isFinish,
            isFinish2,
            isStart,
            isWall,
            onMouseDown,
            onMouseEnter,
            onMouseUp,
            row,
          } = this.props;
          const extraClassName = isFinish
            ? 'node-finish'
            :isFinish2
            ?'node-finish2'
            : isStart
            ? 'node-start'
            : isWall
            ? 'node-wall'
            : '';
        return (
            <div
                id={`node-${row}-${col}`}
                className={`node ${extraClassName}`}
                onMouseDown={() => onMouseDown(row, col)}
                onMouseEnter={() => onMouseEnter(row, col)}
                onMouseUp={() => onMouseUp()}>
            </div>
        )
    }
    
}