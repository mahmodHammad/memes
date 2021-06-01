// I stopped at trying to render segments of each process
// get process start, 
// get process size
// loop over it's segments
// divide the render of the process into segments
// use the same apprach  for the allocate function

const totalMemorySize=520;
let holes = [[40,80],[140,100],[260,40],[320,20],[400,50],[450,70]]
const processes =[
    [null,{code:10,data:30,stack:16},"p1"],
    [null,{code:12,data:40,stack:18},"p2"],
    [null,{code:12,data:30,stack:35},"p3"],
    [null,{code:11,data:10,stack:12},"p4"],

] //start,size,name
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
// alert(holes[0][0])
function renderHoles(type,holes){
    // holes ==> 
    for(let hole = 0; hole <holes.length ; hole+=1){
        const startingIndex = holes[hole][0]
        const size = holes[hole][1]

        // alert(hole)
        const holeBox = document.createElement("div")
        if(type ==="old"){
            holeBox.innerText="This is Old Process #"+hole
            holeBox.classList.add("oldProcess")
        }else if(type ==="hole"){
            holeBox.innerText="This is Hole #"+hole
            holeBox.classList.add("hole")
        }else if(type ==="process"){
            holeBox.innerText= holes[hole][2]
            holeBox.classList.add("process")
        }
        
        holeBox.style.top = `${startingIndex *scale}px`
        holeBox.style.height = `${size *scale}px`
        const endSize =  document.createElement("span")
        endSize.innerText =startingIndex + size 

        endSize.classList.add("holeEndIndex")
        if(startingIndex!==null){
            holeBox.appendChild(endSize)
            memory.appendChild(holeBox)
        }else{
            // ERROR THE PROCESS CAN'T BE ALLOCATED
        }
       
    }
}

const totalProcessSize = (process)=> Object.values(process).reduce((prev,acc)=>prev+acc)
         

function allocate(){
    for(let p = 0  ; p<processes.length ; p++){
        // DON'T TOUCH MY SHIT 😡😡😡 
        firstFit(processes[p],totalProcessSize(processes[p][1]))

    }
}

function firstFit(p,totalProcessSize){
    const size =totalProcessSize
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

function renderProcess(){
    processes.forEach(p=>{
        const segments = p[1]
        // alert(p[0])
        let accumalatedStartingIndex = p[0]
        Object.keys(p[1]).forEach(s=>{
            renderHoles("process",[[accumalatedStartingIndex,p[1][s],`${p[2]}:${s}`]])
            accumalatedStartingIndex+=p[1][s]
        })

        // alert(totalProcessSize(segments))
        // alert(p[0])
    })
}

function concateHoles(){
    holes.forEach((h,index)=>{
        const [start,size]=h
        if(index<holes.length-1){
            // alert(index)
            const end = start+size
            const nextStart = holes[index+1][0]
            const nextSize = holes[index+1][1]
            if(end>=nextStart ){
                console.log("HEY",index)
                holes[index][1]+= nextSize

                // holes =[ ...holes.slice(0,index) ,  ...holes.slice(index+1)]
                console.log("holes",holes)
                // alert(f[0][0])
               
                // alert (nextStart)
            }
        }else{
            // alert(index)
        }
    })
}
concateHoles() 
generateOldProcess()
allocate()

renderProcess()

renderHoles("old",OldProcess)
renderHoles("hole",holes)



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