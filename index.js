const totalMemorySize=600;
const holes = [[40,80],[140,100],[260,40],[320,20],[400,100]]
const OldProcess=[]
const memory = document.querySelector(".memory")
const scale = 2
memory.style.height= `${totalMemorySize * scale}px`

function generateOldProcess(){
    const firstHoleStart = holes[0][0]
    if(firstHoleStart >0)
        OldProcess.push([0,firstHoleStart])
    

    for(let h = 0; h<holes.length; h++){
      const holeStart = holes[h][0]
      const HoleSize = holes[h][1]
      const HoleEnd = holeStart+HoleSize

      if(h === holes.length-1){
        OldProcess.push([HoleEnd,totalMemorySize - HoleEnd])
      }else{
          const nextStart = holes[h+1][0]
          OldProcess.push([HoleEnd,nextStart - HoleEnd])
      }
    }
} 
generateOldProcess()
// alert(holes[0][0])
function renderHoles(type,holes){
    for(let hole = 0; hole <holes.length ; hole+=1){
        // alert(hole)
        const holeBox = document.createElement("div")
        if(type ==="old"){
            holeBox.innerText="This is Old Process #"+hole
            holeBox.classList.add("oldProcess")
        }else if(type ==="hole"){
            holeBox.innerText="This is Hole #"+hole
            holeBox.classList.add("hole")
        }else if(type ==="process"){
            holeBox.innerText="This is Process #"+holes[hole][2]
            holeBox.classList.add("process")
        }

        
        holeBox.style.top = `${holes[hole][0] *scale}px`
        holeBox.style.height = `${holes[hole][1] *scale}px`
        const endSize =  document.createElement("span")
        endSize.innerText =holes[hole][0] + holes[hole][1] 
        endSize.classList.add("holeEndIndex")
        if(holes[hole][0]!==null){
            holeBox.appendChild(endSize)
            memory.appendChild(holeBox)
        }else{
            // ERROR THE PROCESS CAN'T BE ALLOCATED
        }
       
    }
}

const processes =[
    [null,30,"p1"],
    [null,60,"p2"],
    [null,10,"p3"],
    [null,90,"p4"],
    [null,32,"p5"],
]

function firstFit(){
    for(let p = 0  ; p<processes.length ; p++){
        const process = processes[p]
        // const {name,size} = process
        allocate(processes[p])
    }
}

function allocate(p){
    const size = p[1]
    for(let h =0 ; h<holes.length; h++){
        const holeStart = holes[h][0]
        const holeSize = holes[h][1]
        if(size<holeSize){
            p[0] = holeStart
            const processEnd = holeStart+size
            holes[h][0] = processEnd
            holes[h][1]= holes[h][1] - size
            return
            //update the hole
        }
    }
}
firstFit()
renderHoles("old",OldProcess)
renderHoles("process",processes)
renderHoles("hole",holes)

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