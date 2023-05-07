import React, { Component } from 'react'
import Popup from "reactjs-popup"
import Node from './Node/Node'
import {dijkstra, getNodesInShortestPathOrder, calcDistance} from '../algorithms/dijkstra'
//import {findCommonElements, findElement} from './commonNodes.js'
import './PathFinder.css'
//Define the initial starting point and the initial destination point of the rover
let START_NODE_ROW = 5;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 7;
let FINISH_NODE_COL = 20;
let FINISH2_NODE_ROW = 9;
let FINISH2_NODE_COL = 25;


export default class PathFinder extends Component {
    constructor(){
        super()
        this.state = {
            grid: [],
            mouseIsPressed: false,
            erase: false,
            clear: false,
            dist:0,
            startPos: false,
            finishPos: false,
            finishPos2: false,
            disable: false,
            seen: false,
            algorithm: null,
            heuristic: null,
        }
    }

    componentDidMount() {
        const grid = getGrid()
        //gridE = grid;
        this.setState({grid})
    }

    handleMouseDown(row, col) {
        //When <button> Move starting point </button> is clicked
        if(this.state.startPos){
            const oldRow = START_NODE_ROW
            const oldCol = START_NODE_COL
            const node = this.state.grid[row][col]
            node.isStart = true
            this.state.grid[row][col] = node
            this.state.grid[oldRow][oldCol].isStart = false
            START_NODE_COL = col
            START_NODE_ROW = row
        }
        //When <button> Move destination point </button> is clicked
        else if(this.state.finishPos){
            const oldRow = FINISH_NODE_ROW
            const oldCol = FINISH_NODE_COL
            const node = this.state.grid[row][col]
            node.isFinish = true
            this.state.grid[row][col] = node
            this.state.grid[oldRow][oldCol].isFinish = false
            FINISH_NODE_COL = col
            FINISH_NODE_ROW = row
        }

        else if(this.state.finishPos2){
            const oldRow = FINISH2_NODE_ROW
            const oldCol = FINISH2_NODE_COL
            const node = this.state.grid[row][col]
            node.isFinish2 = true
            this.state.grid[row][col] = node
            this.state.grid[oldRow][oldCol].isFinish2 = false
            FINISH2_NODE_COL = col
            FINISH2_NODE_ROW = row
        }
        //When <button> Erase Walls </button> is pressed and current node is a wall
        else if(this.state.erase && this.state.grid[row][col].isWall){
            const newGrid = getWallToggledGrid(this.state.grid, row, col,this.state.erase)
            this.setState({grid: newGrid, mouseIsPressed: true})
        }
        //When <button> Erase Walls </button> is pressed and current node is not a wall
        else if(this.state.erase && !this.state.grid[row][col].isWall){
            this.setState({mouseIsPressed:true})
        }
        //Drawing walls on the grid 
        else{
            const newGrid = getWallToggledGrid(this.state.grid, row, col,this.state.erase)
            this.setState({grid: newGrid, mouseIsPressed: true})
        }
    }

    handleMouseEnter(row, col) {
        //When mouse is not pressed don't do anything
        if (!this.state.mouseIsPressed) return
        //When <button> Erase Walls </button> is pressed
        if(this.state.erase) {
            const node = this.state.grid[row][col]
            if(node.isWall){
                const newGrid = getWallToggledGrid(this.state.grid, row, col,this.state.erase)
                this.setState({grid: newGrid})
            }
        }
        //Draw Walls
        else{
            const newGrid = getWallToggledGrid(this.state.grid, row, col,this.state.erase)
            this.setState({grid: newGrid})
        }

    }

    handleMouseUp() {
        //On releasing the mouse button
        this.setState({mouseIsPressed: false})
    }

    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder,nodesInShortestPathOrder2,far) {
        //Set Distance value to Visualizing
        this.setState({dist:"Visualizing..."})
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            //animate visited nodes : Refer to Node.css for animation details
          if (i === visitedNodesInOrder.length) {
            setTimeout(() => {
              this.animateShortestPath(nodesInShortestPathOrder,nodesInShortestPathOrder2,far);
            }, 10 * i);
            return;
          }
          //Do not animate start point and destination point
          if(visitedNodesInOrder[i].isStart || visitedNodesInOrder[i].isFinish || visitedNodesInOrder[i].isFinish2) continue
          setTimeout(() => {
            const node = visitedNodesInOrder[i];
            document.getElementById(`node-${node.row}-${node.col}`).className ='node node-visited';
          }, 5* i);
        }
        
    }
    

    animateShortestPath(nodesInShortestPathOrder,nodesInShortestPathOrder2) {
        //animate shortest path : Refer to Node.css for animation details

        var commonNodes = [];
        commonNodes = findCommonElements(nodesInShortestPathOrder,nodesInShortestPathOrder2);


        var dist1 = nodesInShortestPathOrder.length;
        for(let i=0;i<nodesInShortestPathOrder2.length;i++){
            nodesInShortestPathOrder.push(nodesInShortestPathOrder2[i]);
        }
        for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
            //Do not animate start point and destination point
            if(nodesInShortestPathOrder[i].isStart || nodesInShortestPathOrder[i].isFinish || nodesInShortestPathOrder[i].isFinish2) continue 
            else if(i>=nodesInShortestPathOrder.length-nodesInShortestPathOrder2.length && findElement(nodesInShortestPathOrder[i],commonNodes)) {
                setTimeout(() => {
                    const node = nodesInShortestPathOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                      'node node-shortest-path2';
                  }, 50 * i);
            }
            else {
                setTimeout(() => {
                    const node = nodesInShortestPathOrder[i];
                    document.getElementById(`node-${node.row}-${node.col}`).className =
                    'node node-shortest-path';
                }, 50 * i);
            }
        }
        if(dist1 + nodesInShortestPathOrder2.length>2){
            this.setState({dist:dist1 + nodesInShortestPathOrder2.length-2});
        }
        else{
            this.setState({dist : "No Possible Path"});
        }
       
    }
    
    

    visualizeDijkstra(algorithm,heuristic) {
        this.setState({disable: true, algorithm: algorithm, heuristic: heuristic})
        //Start Visualization
        const {grid} = this.state;

        var startNode = grid[START_NODE_ROW][START_NODE_COL];
        var finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
        var finishNode2 = grid[FINISH2_NODE_ROW][FINISH2_NODE_COL];
        
        

        var visitedNodesInOrder = dijkstra(grid, startNode,finishNode,algorithm,heuristic);
        
        var nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode);
        var dist1 = nodesInShortestPathOrder.length;
        console.log(nodesInShortestPathOrder);
        var nodesInShortestPathOrder2 = [];
            var grid2 = [];
            for ( let row = 0; row < 15; row++){
                const currentRow = [];
                for ( let col = 0; col < 50; col++){
                    grid[row][col].distance = Infinity;
                    grid[row][col].previousNode = null;
                    grid[row][col].isVisited = false;   
                    currentRow.push(grid[row][col]);
                }
                grid2.push(currentRow)
            }
        
            this.setState({grid:grid2});
            startNode = grid2[START_NODE_ROW][START_NODE_COL];
            finishNode = grid2[FINISH_NODE_ROW][FINISH_NODE_COL];
            finishNode2 = grid2[FINISH2_NODE_ROW][FINISH2_NODE_COL];
            
            var visitedNodesInOrder2 = dijkstra(grid2,finishNode,finishNode2,algorithm,heuristic);
            console.log(visitedNodesInOrder2);
            var nodesInShortestPathOrder2 = getNodesInShortestPathOrder(finishNode2)
            
            //console.log(nodesInShortestPathOrder2);
            //if(nodesInShortestPathOrder.length<nodesInShortestPathOrder2.length){
            //     nodesInShortestPathOrder = nodesInShortestPathOrder2;
            // }
            var grid3 = [];
            for ( let row = 0; row < 15; row++){
                const currentRow = [];
                for ( let col = 0; col < 50; col++){
                    grid2[row][col].distance = Infinity;
                    grid2[row][col].previousNode = null;
                    grid2[row][col].isVisited = false;   
                    currentRow.push(grid2[row][col]);
                }
                grid3.push(currentRow)
            }
        
            this.setState({grid:grid3});
            startNode = grid3[START_NODE_ROW][START_NODE_COL];
            finishNode = grid3[FINISH_NODE_ROW][FINISH_NODE_COL];
            finishNode2 = grid3[FINISH2_NODE_ROW][FINISH2_NODE_COL];
            
            var visitedNodesInOrder3 = dijkstra(grid3,startNode,finishNode2,algorithm,heuristic);
           
            var nodesInShortestPathOrder3 = getNodesInShortestPathOrder(finishNode2);
            //console.log(nodesInShortestPathOrder3[1]);

            var far = finishNode2;
            if(nodesInShortestPathOrder3.length < nodesInShortestPathOrder.length){
               // visitedNodesInOrder = visitedNodesInOrder3;
              //  nodesInShortestPathOrder = nodesInShortestPathOrder3;
                nodesInShortestPathOrder2.reverse();
                visitedNodesInOrder2.reverse();
                //far = finishNode;
                if(finishNode.previousNode!==null || finishNode2.previousNode!==null){ 
                       for(let i=0;i<visitedNodesInOrder2.length;i++){
                            if(!visitedNodesInOrder3.includes(visitedNodesInOrder2[i]))
                                visitedNodesInOrder3.push(visitedNodesInOrder2[i]);
                    }
                }
                else{
                    nodesInShortestPathOrder2=[];
                    //visitedNodesInOrder2=[];
                }
                this.setState({disable: true})
       
                this.animateDijkstra(visitedNodesInOrder3, nodesInShortestPathOrder3,nodesInShortestPathOrder2);
                return;
            }
            if(finishNode.previousNode!==null || finishNode2.previousNode!==null){
                for(let i=0;i<visitedNodesInOrder2.length;i++){
                    if(!visitedNodesInOrder.includes(visitedNodesInOrder2[i]))
                        visitedNodesInOrder.push(visitedNodesInOrder2[i]);
                }
            }
            else{
                nodesInShortestPathOrder2=[];
            }

            this.setState({disable: true})
       
            this.animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder,nodesInShortestPathOrder2);
    }

    eraseWalls() {
        //Toggle erase state on button press
        this.setState({erase: !this.state.erase})
    }

    startPosition() {
        //Toggle startPos state on button press
        this.setState({startPos: !this.state.startPos})
    }

    finishPosition() {
        //Toggle finishPos state on button press
        this.setState({finishPos: !this.state.finishPos})
    }

    finishPosition2() { 
        //Toggle finishPos2 state on button press
        this.setState({finishPos2: !this.state.finishPos2})
    }

    render() {
        const {grid} = this.state
        return (
            <div>
                <navbar className='navbar' >
                    <ul>
                        <li>
                            <div className = "dropdown" disabled= {this.state.disable}>
                                <button className = "dropbtn" disabled= {this.state.disable} >
                                    Choose Algorithm to Visualize
                                </button>
                                <div className = "dropdown-content" disabled= {this.state.disable}>
                                    <button className='button' disabled= {this.state.disable} onClick={() => this.visualizeDijkstra("dijkstra",null)}>
                                         Dijkstra
                                    </button>
                                    <button className='button' disabled= {this.state.disable} onClick={() => this.visualizeDijkstra("astar",'euclidean')}>
                                         AStar with Euclidean
                                    </button>
                                    <button className='button' disabled= {this.state.disable} onClick={() => this.visualizeDijkstra("astar",'manhattan')}>
                                         AStar with Manhattan
                                    </button>
                                    <button className='button' disabled= {this.state.disable} onClick={() => this.visualizeDijkstra("astar",'chebyshev')}>
                                         AStar with Chebyshev
                                    </button>
                                    <button className='button' disabled= {this.state.disable} onClick={() => this.visualizeDijkstra("bestfirst",'euclidean')}>
                                         Best First Search with Euclidean
                                    </button>
                                    <button className='button' disabled= {this.state.disable} onClick={() => this.visualizeDijkstra("bestfirst",'manhattan')}>
                                         Best First Search with Manhattan
                                    </button>
                                    <button className='button' disabled= {this.state.disable} onClick={() => this.visualizeDijkstra("bestfirst",'chebyshev')}>
                                         Best First Search with Chebyshev
                                    </button>
                                </div>
                            </div>
                        </li>
                        <li>
                            <button className = 'button' disabled= {this.state.disable} onClick={() => this.startPosition()}>
                                { this.state.startPos ? "Fix starting point" : "Move starting point"}
                            </button>
                        </li>
                        <li>
                            <button className = 'button' disabled= {this.state.disable} onClick={() => this.finishPosition()}>
                                { this.state.finishPos ? "Fix destination point A" : "Move destination point A"}
                            </button>
                        </li>
                        <li>
                            <button className = 'button' disabled= {this.state.disable} onClick={() => this.finishPosition2()}>
                                { this.state.finishPos2 ? "Fix destination point B" : "Move destination point B"}
                            </button>
                        </li>
                        <li>
                            <button className='button' disabled= {this.state.disable} onClick = { () =>  this.eraseWalls()}>
                                { this.state.erase? "Stop Erasing" : "Erase Walls"}
                            </button>
                        </li>
                        <li>
                            <form action="https://arshika77.github.io/MarsRaiders/">
                                <button className='button'> 
                                    Reset Grid 
                                </button>    
                            </form>
                        </li>
                        <li>
                            <Popup
                                modal trigger = {
                                    <button className= 'button' id= 'helpbtn'>
                                    Instructions
                                    </button> 
                                }  
                                closeOnDocumentClick
                                className = 'Popup'
                            >
                                <h1> Welcome to the MARS ROVER Navigator! </h1>
                                <h3> The Mars Curiosity Rover needs to examine two sites for soil samples, labelled Destination Point A and Destination Point B. It must do so while avoiding deathly obstacles and in the shortest path possible! </h3>
                                <hr></hr>
                                <b> <i> (Click anywhere to close the HELP window) </i> </b> <br></br> <br></br>
                                To run the MARS ROVER Navigator: <br></br> <br></br>
                                <ol>
                                    <li> 1. Fix the starting point of the rover </li> <br></br>
                                    <li> 2. Fix the two destination points of the rover </li> <br></br>
                                    <li> 3. Draw the necessary obstacles (walls) on the grid </li> <br></br>
                                    <li> 4. In case you make an error, use the "Erase Walls" button to make corrections or press "Reset Grid" to start afresh </li> <br></br>
                                    <li> 5. Once the simulated terrain is ready, choose the appropriate Shortest Path Algorithm and the corresponding Heuristic for the robot to implement</li> <br></br>
                                    <li> 6. Voila! The MARS ROVER Navigator will visualise the shortest path of the robot and display the distance</li> <br></br>
                                    <li> 7. To start another visualisation, click on "Reset Grid" </li> <br></br>
                                </ol>
                                <br></br>
                                <footer>
                                    To view the source code, take a look at the <a href= 'https://github.com/arshika77/MarsRaiders'> github repository </a> of the project
                                </footer>
                                <br></br> <br></br>
                            </Popup>
                        </li>
                    </ul>
                </navbar>
                <div className = "distance">
                    <button className = 'buttonBottom'>
                      <b>Algortihm</b>: {this.state.algorithm? (this.state.algorithm).toUpperCase() : "Choose Algorithm"} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <b>Heuristic</b>: {this.state.heuristic? (this.state.heuristic).toUpperCase() : "None selected"}
                    </button>
                    <button className='buttonBottom' >
                       <b>Distance</b>: {this.state.dist}
                    </button>
                </div>
                <br></br> <br></br>
                <div className = 'gridline'>
                    {grid.map((row,rowIdx) => {
                        return (
                        <div key={rowIdx}> 
                            {row.map((node,nodeIdx) => {
                                const {row, col, isFinish,isFinish2, isStart, isWall} = node
                                return (
                                    <Node 
                                        key = {nodeIdx}
                                        col = {col}
                                        row = {row}
                                        isFinish = {isFinish}
                                        isFinish2 = {isFinish2}
                                        isStart = {isStart}
                                        isWall = {isWall}
                                        mouseIsPressed={this.state.mouseIsPressed}
                                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                                        onMouseEnter={(row, col) =>
                                          this.handleMouseEnter(row, col)
                                        }
                                        onMouseUp={() => this.handleMouseUp()}
                                    />
                                )
                            })}
                        </div>
                    )
                    })}
                </div> 
                <footer className='footer'> 
                    Developed By: Arshika Lalan, Parth Agrawal, Arohi Dureja, Rupali Raniwala
                </footer>
            </div>
        )
    }
}


const getGrid = () => {
    //Initial grid setup
    const grid = [];
    for ( let row = 0; row < 15; row++){
        const currentRow = [];
        for ( let col = 0; col < 50; col++){
            currentRow.push(createNode(col,row))
        }
        grid.push(currentRow)
    }
    return grid
}

const createNode = (col,row) => {
    //Creating new node
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
        isFinish2: row === FINISH2_NODE_ROW && col=== FINISH2_NODE_COL,
        distance: Infinity,
        heuristicDistance: null,
        isVisited: false,
        isWall: false,
        previousNode: null,
        
    }
}


const getWallToggledGrid = (grid, row, col,erase) => {
    //Draw wall function
    const newGrid = grid.slice()
    const node = newGrid[row][col]
    let nNode = node
    //If erase button is not pressed and a wall doesn't exist at the node already - then draw a wall
    if (!node.isWall && erase === false){
        const newNode = {
            ...node,
            isWall: !node.isWall
        }
        nNode = newNode
    }
    //If erase button is pressed : (Proper functioning rendered due to event handling functions)
    else if(erase){
        const newNode = {
            ...node,
            isWall: !node.isWall
        }
        nNode = newNode
    }
    newGrid[row][col] = nNode
    return newGrid
}

export function findCommonElements(array1,array2) {
        
    var commonNodes = []

    for(let i = 0; i < array1.length; i++) { 
      
        // Loop for array2 
        for(let j = 0; j < array2.length; j++) { 
              
            // Compare the element of each and 
            // every element from both of the 
            // arrays 
            if(array1[i] === array2[j]) { 
              
                // Return if common element found 
                commonNodes.push(array2[j]) 
            } 
        } 
    }
    return commonNodes
}

export function findElement(element,arr) {
    for(let i =0; i<arr.length; i++) {
        if(element===arr[i]) return true
    }
    return false
}