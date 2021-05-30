const totalMemorySize=1000;
const holes = [[10,40],[70,100],[260,40],[300,20],[600,100]]
const memory = document.querySelector(".memory")
memory.style.height= `${totalMemorySize}px`
// alert(holes[0][0])
for(let hole = 0; hole <holes.length ; hole+=1){
    // alert(hole)
    const holeBox = document.createElement("div")
    holeBox.innerText="THIS IS hole"
    holeBox.classList.add("hole")
    holeBox.style.top = `${holes[hole][0]}px`
    holeBox.style.height = `${holes[hole][1]}px`
    const endSize =  document.createElement("span")
    endSize.innerText =holes[hole][0] + holes[hole][1] 
    endSize.classList.add("holeEndIndex")

    holeBox.appendChild(endSize)
    memory.appendChild(holeBox)
}
console.log("MEM",memory)
/*
Inputs:
{totalMemorySize, holes:{startingAdr,size}}
{processes:[{name,size}]} one by one
methodOfAllocation:{firstFit:method(),bestfit:method()}
*/

/*
TODO
* Allocate segments using allocation methodology [firstFit,bestfit]
* If one segment or more can not fit in any hole ==> generate an error message
* De-allocate a process 
    * The user chooses a process to de-allocate
    * Deallocate all segments fo this process
    * Consider their spaces holes to be used later
    * Add them to any neighboring holes
* Between holdes spaces are considered old process
    * user can choose to deallocate one of these old processses
*/

/*
Output
* Drawing representing memory allocation
0       p1:Code
100     p2:Data
150     Hole0
300     OldProcess
600
*/


/*
My notes:
eachProcess: [base,limit]    

*/