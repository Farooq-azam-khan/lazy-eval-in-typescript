// intro 
function sum(a: number, b: number): number {
    return a + b 
}

console.log("Eager sum:\t", sum( 10, 20))

type Lazy<T> = () => T 
/*
function lazySum(a: () => number, b: () => number): () => number {
    return (() => a() + b())
}
*/
function lazySum(a: Lazy<number>, b: Lazy<number>): Lazy<number> {
    return () => a() + b()
}

console.log("Lazy sum:\t", lazySum(() => 10,() => 20)())

// avoid big computations that are not needed

function hand<T>(): T {
    return hand() 
}

function first(a: number, b: number) : number {
    return a
}
function lazyFirst(a: Lazy<number>, b: Lazy<number>) : Lazy<number> {
    return a
}


//console.log("hangs?", first(10, hand()))
console.log("Lazy First:\t", lazyFirst(() => 10,() => hand())())

// short-circuit evaluation 

//false && x => false 
//true || y => true 
function and(a: Lazy<boolean>, b: Lazy<boolean>): Lazy<boolean> {
    if (a() == false) {
        return () => false 
    } else {
        return b
    
/*        
        if (b() == false) {
            return () => false 
        }
    */
    } 
    //return () =>  true 
}

console.log("lazy and(f,f):\t", and(() => false, () => false)())
console.log("lazy and(f,t):\t", and(() => false, () => true)())
console.log("lazy and(t,f):\t", and(() => true, () => false)())
console.log("lazy and(t,t):\t", and(() => true, () => true)())
