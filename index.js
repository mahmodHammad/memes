// I stopped at trying to render segments of each process
// get process start, 
// get process size
// loop over it's segments
// divide the render of the process into segments
// use the same apprach  for the allocate function
// file:///Users/admin/Downloads/MemoryAllocationProjectDescription2021%20(1).pdf
const memory = document.querySelector(".memory")
const scale = 2

let totalMemorySize=540;
// const submitbtn = document.getElementById("submit")
// const memSize = document.getElementById("memSize")
// submitbtn.onclick=()=>{
//     let val = memSize.value
//     let intval = parseInt(val)
//     memSize.value =intval
//     totalMemorySize=intval
//     renderMemory()
// }
// let holes = [[140,100],[40,80],[260,50],[340,30],[400,80],[450,60],[510,20]]
let holes = [[140,20],[250,30],[0,90] ,[300,70],[400,140]]

function orderHoles(){
   holes = holes.sort((a,b)=>a[0]-b[0])
}
function renderMemory (){
    memory.style.height= `${totalMemorySize * scale}px`
}
renderMemory()
let processes =[
    [null,{code:[10],data:[80],stack:[60]},"p1"],
    [null,{code:[65],data:[30],stack:[25]},"p3"],
    [null,{code:[10],data:[40],stack:[18]},"p2"],
    // [null,{code:[12],data:[60],stack:[12]},"p4"],

] //start,size,name
let OldProcess=[]


function generateOldProcess(){
    const firstHoleStart = holes[0][0]

    if(firstHoleStart >0)
        OldProcess.push([0,firstHoleStart,`old ${0}`])
    

    for(let h = 0; h<holes.length; h++){
      const holeStart = holes[h][0]
      const HoleSize = holes[h][1]
      const HoleEnd = holeStart+HoleSize

      if(h === holes.length-1){
          const lastHole = totalMemorySize - HoleEnd
          if(HoleEnd<totalMemorySize)
            OldProcess.push([HoleEnd,lastHole,`old ${h}`])
      }else{
          const nextStart = holes[h+1][0]
          OldProcess.push([HoleEnd,nextStart - HoleEnd,`old ${h}`])
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
            holeBox.innerText=holes[hole][2]
            holeBox.classList.add("oldProcess")
        }else if(type ==="hole"){
            holeBox.innerText="Hole #"+hole
            holeBox.classList.add("hole")
        }else if(type ==="process"){
            holeBox.innerText= holes[hole][2]
            holeBox.classList.add("process")
        }
        
        holeBox.style.top = `${startingIndex *scale}px`
        holeBox.style.height = `${size *scale}px`
        const endSize =  document.createElement("span")
        const endSizeContainer =  document.createElement("div")
        endSizeContainer.classList.add("endSizeContainer")
        endSizeContainer.appendChild(endSize)
        endSize.innerText =startingIndex + size 

        endSize.classList.add("holeEndIndex")
        if(startingIndex!==null){
            holeBox.appendChild(endSizeContainer)
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
        // firstFit(processes[p])
        bestFit(processes[p])

    }
    console.log("PROCCESES",processes)
}

function getSmallestHole(tempHoles,segmentSize){
    let smallestHole = [0,1000000] 
    tempHoles.forEach((hole,index)=>{
        const [holeStart,holeSize] = hole

        if(holeSize>segmentSize && smallestHole[1]>holeSize){
            smallestHole=hole
            smallestHole[2]= index
        }else if(smallestHole[2]===undefined &&index ===tempHoles.length-1){
            // couldn't find hole
            console.log("FUCK",smallestHole[2])
            console.log("FUCK",smallestHole[2])
            smallestHole[2]= -1
        }

    })
    return smallestHole
}

function bestFit(p){
    // Allocate in the smallest hole
    const segments=p[1]
    let isAllProcessAllocated = true
    let tempHoles =JSON.parse(JSON.stringify(holes));
    Object.entries(segments).forEach(
        // for each segment
        ([name, value]) =>{
            const segmentSize = value[0]
           let smallest =  getSmallestHole(tempHoles,segmentSize)
           const [ holeStart,holeEnd,holeIndex] = smallest
           if(holeIndex==-1){
               console.log("PROCESS CAN NOt BE ALLOCATED",p)
               isAllProcessAllocated = false    
               p[0]=true

           }

           value[1] =  smallest[0]
           const segEnd = segmentSize+holeStart

           if(holeIndex!==-1){
               tempHoles[holeIndex][0] = segEnd
                const oldHoleSize = tempHoles[holeIndex][1]
                tempHoles[holeIndex][1]=oldHoleSize - segmentSize
           }else{
               console.log("BUBUBUB",holeIndex)
           }
          
        //    console.log("value",value)
        //    console.log("smallestHole",smallest)
           console.log("_________________")
        }
    );
    if( isAllProcessAllocated)
        holes = tempHoles
}

function firstFit(p){
    // forEach segment loop over the holes
    // create a temp allocation array
    // that array 
    // const size =totalProcessSize
    const segments=p[1]
    let isAllProcessAllocated = true
    let tempHoles =JSON.parse(JSON.stringify(holes));

    Object.entries(segments).forEach(
        ([name, value]) =>{
            tempHoles.every((hole,index)=>{
                const [holeStart,holeSize] = hole
                let  [size,segmentStartingIndex]=value
                if(size<= holeSize){
                    value[1] =  tempHoles[index][0]
                    const segEnd = size+holeStart
                    tempHoles[index][0] = segEnd
                    tempHoles[index][1] = tempHoles[index][1] - size
                    return false
                }else{
                    if(index===tempHoles.length-1){
                        //😞 مش لاقي مكان 
                         isAllProcessAllocated = false    
                        console.log("CATCH",p)
                        p[0]=true
                    }
                    return true
                }
            })

        }
    );
    if( isAllProcessAllocated){
        holes = tempHoles
    }
}

function renderProcess(){
    processes.forEach(p=>{

        // loop over segments:
        if(!p[0]){

            Object.keys(p[1]).forEach(s=>{
                // console.log("SEGMEMT",[p[1][s][1],[p[1][s]][0]])
                renderHoles("process",[[p[1][s][1],p[1][s][0],`${p[2]}:${s}`]])
            })
        }
        // }else{
            // PROCESS CAN NOT BE ALLOCATED (NO ENGOUGH SPACE!)
        // }
    })
}

function concateHoles(){
    holes.forEach((h,index)=>{
        const [start,size]=h
        if(index<holes.length-1){
            const end = start+size
            const [nextStart,nextSize] = holes[index+1]
            if(end>=nextStart ){
                holes[index][1] =  nextStart + nextSize - start
                holes =[ ...holes.slice(0,index+1) ,  ...holes.slice(index+2)]
                concateHoles()
            }
        }
    })
}

function deleteProcess(processName,isOld){
    // create a hole
    let start,ProcessSize,AfterDelete,segments;
    if(isOld){
        // deleteProcess()
        const processIndex = OldProcess.findIndex(p=>p[2]===processName)
        AfterDelete = [...OldProcess.slice(0,processIndex),...OldProcess.slice(processIndex+1)]
        // [start,segments,name] =processes[processIndex]
        start = OldProcess[processIndex][0]
        ProcessSize = OldProcess[processIndex][1]

       OldProcess= AfterDelete
    holes.push([start,ProcessSize])


    }else{
        const processIndex = processes.findIndex(p=>p[2]===processName)
        console.log("INDDDEX",processIndex)
         AfterDelete = [...processes.slice(0,processIndex),...processes.slice(processIndex+1)]
        //  recover Holes
         const [starter,segments] =processes[processIndex]
         Object.values(segments).forEach(([size,starting])=>{
             console.log(size,starting)
               holes.push([starting,size])
         })
       processes= AfterDelete

    }

    orderHoles()
    concateHoles()
     // [null,{code:10,data:30,stack:16},"p1"]
    render()
}
orderHoles()
concateHoles() 
generateOldProcess()
// deleteProcess("old 0",true)
// deleteProcess("old 2",true)
allocate()

function clear(){
    while (memory.firstChild) {
        memory.removeChild(memory.lastChild);
    }
}

function render(){
    clear()
    renderHoles("hole",holes)
    renderHoles("old",OldProcess)
    renderProcess()   
}
render()
// deleteProcess("p2",false)
// deleteProcess("p1",false)
// deleteProcess("p4",false)



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