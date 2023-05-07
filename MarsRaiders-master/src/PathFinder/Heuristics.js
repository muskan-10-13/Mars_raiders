
export function manhattan(dx,dy){
  return Math.abs(dx)+ Math.abs(dy);
}
export function euclidean(dx,dy){
  return Math.sqrt(dx*dx + dy*dy)
} 

export function chebyshev(dx,dy){
  return Math.max(Math.abs(dx),Math.abs(dy))
}




