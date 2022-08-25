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
    return a() == false ? () => false : b 
}
function trace<T>(x:Lazy<T>, message: string):Lazy<T> {

    return () => {
        console.log(message)
        return x()
    }
}
/*console.log("lazy and(f,f):\t", and(() => false, () => false)())
console.log("lazy and(f,t):\t", and(() => false, () => true)())
console.log("lazy and(t,f):\t", and(() => true, () => false)())
console.log("lazy and(t,t):\t", and(() => true, () => true)())
*/

console.log("-- trace --")
console.log("lazy and(f,f):\t", and(trace(() => false, "L"), trace(() => false, "R"))())
console.log("lazy and(f,t):\t", and(trace(() => false, "L"), trace(() => true, "R"))())
console.log("lazy and(t,f):\t", and(trace(() => true, "L"), trace(() => false, "R"))())
console.log("lazy and(t,t):\t", and(trace(() => true, "L"), trace(() => true, "R"))())


function or(a: Lazy<boolean>, b: Lazy<boolean>): Lazy<boolean> {
    return a() ? () => true : b
}

console.log("--")
console.log("lazy or(f,f):\t", or(() => false, () => false)())
console.log("lazy or(f,t):\t", or(() => false, () => true)())
console.log("lazy or(t,f):\t", or(() => true, () => false)())
console.log("lazy or(t,t):\t", or(() => true, () => true)())


// infinite data structures 
type LazyList<T> = Lazy<{head: Lazy<T>, tail: LazyList<T>} | null>
function toList<T>(xs: T[]): LazyList<T> {
    return () => {
        if (xs.length == 0) {
            return null
        }
        return {
            head: () => xs[0], 
            tail: toList(xs.slice(1))
        }
    }
       
}
console.log('infinite data strucutres') 
console.log(toList([1,2,3])().head())
console.log(toList([1,2,3])().tail().head())
console.log(toList([1,2,3])().tail().tail().head())
console.log(toList([1,2,3])().tail().tail().tail())

// will reach stack overflow
function range(begin: Lazy<number>): LazyList<number> {
    return () => {
        return {
            head: begin, 
            tail: range(() => begin() +1)
        }
    }
}
console.log('range')
console.log(range(() => 1)().tail().tail().head())

function printLazyList<T>(xs: LazyList<T>) {
    let pair = xs() 
    while (pair != null) {
        console.log(pair.head());
        pair = pair.tail()
    }
}

console.log('--printlazylist')
printLazyList(toList([1,2,3]))
printLazyList(range(() => 10))
