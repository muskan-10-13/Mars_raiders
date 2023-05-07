# Mars_raiders
Implementing algorithms to find the shortest path between the start Node and End Node while avoiding the nodes marked as obstacles.
Expanding the problem to finding the shortest path with 2 end nodes and 1 start node.
Visualizing the working of algorithms and highlighting the shortest path
Added new heuristic ”diagonal” to a WebApp to visualize Dijkstra’s and A-star algorithms that find the shortest path avoiding the obstacles
Algorithms Used :

Dijkstra’s Algorithm - basic shortest path finding algorithm which works as follows : Initially, all the nodes are marked unvisited and are assigned infinite distance except the startNode which is at zero distance. Then, we keep exploring the unvisited nodes one by one and keep updating the distance. Compare the newly calculated distance to the current value and assign the smaller value. When all the neighbours of the current Node have been visited, remove it from the set of unvisited nodes and move on to the next node. The algorithm terminates when the endNode becomes a part of the visitedSet or when the smallest distance in the unvisited set becomes infinity indicating that the node is not accessible. Then, we backtrack from the endNode to the startNode for getting the shortest path. The optimal complexity of the algorithm is O((V + E)logV) [where V is the number of nodes and E is the number of edges] by using a min-priority queue. However, in this project we have implemented this algorithm using an array because of its simplicity. It runs in O(V2). Some problems with the algorithm include negative cycles, and exploration of extra nodes which are not in the direction of the endNodes.

A Star Algorithm - an advanced variation of the Dijkstra’s algorithm which reduces the nodes explored. In addition to Dijkstra’s algorithm, this uses a heuristic function while assigning the distances to each node. A heuristic function calculates the distance between the endNode and startNode. This gives preference to nodes which are in the direction of the endNode.

Best First Search - contrast to the A star algorithm which gives equal importance to path-distance from startNode and heuristic distance from endNode, this algorithm focuses mainly on the heuristic distance from the endNode. Thus, it goes faster in the direction of the endNode as compared to Dijkstra and A star.

Heuristics Used :

    Euclidean : Calculates the euclidean distance between two nodes given by the formula x2 + y2
    Manhattan : Calculates the manhattan distance between two nodes given by the formula x+y
    Chebyshev : Calculates the chebyshev distance between two nodes given by the formula max(x,y)

Purpose : 
For creating an easy visualization to understand the working of various algorithms.

Tech: HTML CSS, JavaScript,React

