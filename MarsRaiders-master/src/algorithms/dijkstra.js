import React from 'react'
import { manhattan, euclidean, chebyshev } from '../PathFinder/Heuristics'

export function dijkstra(grid, startNode, finishNode,algorithm,heuristic) {
    
    const visitedNodesInOrder = []  
    startNode.distance = 0
    const unvisitedNodes = getAllNodes(grid)
    while (! !unvisitedNodes.length){
        sortNodesByDistance(unvisitedNodes)
        const closestNode = unvisitedNodes.shift();
        if(closestNode.isWall) continue;
        if(closestNode.distance === Infinity) return visitedNodesInOrder
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode)
        if(visitedNodesInOrder.includes(finishNode)){
          //var visitedNodesInOrder2 = dijkstra2(grid,finishNode,finishNode2);

          //console.log(visitedNodesInOrder2);
          updateUnvisitedNeighbors(closestNode,finishNode, grid,algorithm,heuristic)
    
          return visitedNodesInOrder
        } 
        updateUnvisitedNeighbors(closestNode,finishNode, grid,algorithm,heuristic)
    }
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
  }
  
function updateUnvisitedNeighbors(node,finishNode, grid,algorithm,heuristic) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
      if(algorithm==='dijkstra'){
        neighbor.distance = node.distance + 1;
      }
      else if(algorithm==='astar' && heuristic==='euclidean'){
        neighbor.distance = node.distance + 1 + euclidean(finishNode.col-node.col,finishNode.row-node.row);
      }
      else if(algorithm==='astar' && heuristic==='manhattan'){
        neighbor.distance = node.distance + 1 + manhattan(finishNode.col-node.col,finishNode.row-node.row);
      }
      else if(algorithm==='astar' && heuristic==='chebyshev'){
        neighbor.distance = node.distance + 1 + chebyshev(finishNode.col-node.col,finishNode.row-node.row);
      }
      else if(algorithm==='bestfirst' && heuristic==='euclidean'){
        neighbor.distance = node.distance + 1 + 100000*euclidean(finishNode.col-node.col,finishNode.row-node.row);
      
      }
      else if(algorithm==='bestfirst' && heuristic==='manhattan'){
        neighbor.distance = node.distance + 1 + 100000*manhattan(finishNode.col-node.col,finishNode.row-node.row);
      
      }
      else if(algorithm==='bestfirst' && heuristic==='chebyshev'){
        neighbor.distance = node.distance + 1 + 100000*chebyshev(finishNode.col-node.col,finishNode.row-node.row);
      
      }
      neighbor.previousNode = node;
    }
}


function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    return neighbors.filter(neighbor => !neighbor.isVisited);
}
  
function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        if(node.isVisited===false) nodes.push(node);
      }
    }
    return nodes;
}

  
export function getNodesInShortestPathOrder(finishNode) {
    //const nodesInVisitedPathOrder = dijkstra2(grid,finishNode,finishNode2);
    //console.log(nodesInVisitedPathOrder);
    const nodesInShortestPathOrder = [];
    let currentNode = finishNode;
    while (currentNode !== null) {
      nodesInShortestPathOrder.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    return nodesInShortestPathOrder;
}

/*export function calcDistance(nodesInShortestPathOrder){
  var sum=0,dx,dy;
  for(let i=1;i<nodesInShortestPathOrder.length;i++){
    dy = nodesInShortestPathOrder[i].row - nodesInShortestPathOrder[i-1].row;
    dx = nodesInShortestPathOrder[i].col - nodesInShortestPathOrder[i-1].col;
    sum+= manhattan(dx,dy);
  }
  return (sum!=0) ? sum : "No possible path";
  
  
}*/