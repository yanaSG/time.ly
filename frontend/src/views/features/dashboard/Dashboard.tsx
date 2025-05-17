import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div className="fixed flex flex-col relative pl-10 "> 

      <div className="flex justify-center z-0">
        <img 
          src="../../../../../public/deco-corner.png" 
          alt="Dashboard Illustration" 
          className="absolute top-0 left-0 w-1/2 h-auto z-0"
        />
      </div>
        

      <div className='fixed flex flex-row gap-5 p-5 z-10 justify-center pl-20 '>

        {/* start of id */}
        <div className="bg-white h-75 w-120 rounded-3xl border border-gray-300 flex flex-col shadow-lg align-center justify-center items-center transform transition-transform duration-300 hover:scale-105">

          <div className=" border border-black bg-[#FFD25E]  pt-2 pb-2 pl-10 pr-10 rounded-full">
  
          </div>

          <div className="flex flex-row justify-center items-center items-start pt-10">
            <img 
              src="../../../../../public/user-jennie.jpg" 
              alt="user" 
              className=" h-45 w-45 rounded-lg shadow-lg"
            />
          
            <div className="flex flex-row align-center pl-10 mr-15">
              <div className="font-bold">
                <p>Name:</p>
                <p>Course: </p>
                <p>Likes: </p>
              </div>
              <div className="pl-2">
                <p>Jennie</p>
                <p>Nursing</p>
                <p>k-pop</p>
              </div>
            
            </div>

          </div>

          <div>
            <p className="text-xs pt-3">A premium time.ly member for five years.</p>
          </div>
          
        </div>
         {/* end of id */}

        <div className="border border-gray-300 bg-white h-75 w-50 rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105 p-5 flex flex-col items-center">
          <p className="font-bold text-lg mb-3">Schedule</p>
            <ul className="text-sm ">
            <li className="bg-white rounded-full ">8:00 AM - GE PE</li>
            <li>10:00 AM - GE UTS</li>
            <li>12:00 PM - Lunch Break</li>
            <li>2:00 PM - History Lecture</li>
            <li>4:00 PM - Gym Session</li>
            </ul>
        </div>

        <div className=" border border-gray-300 bg-white h-75 w-50 rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105 p-5 flex flex-col items-center">
          <p className="font-bold text-lg mb-3">Streak</p>
        </div>

      </div>

      <div className="bg-white w-11/12 h-75 mt-90 rounded-xl shadow-2xl mx-auto">
        <p className="p-10">bulletin board</p>
      </div>
    </div>
  )
}

export default Dashboard