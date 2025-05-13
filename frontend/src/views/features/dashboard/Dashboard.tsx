import React from 'react'

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col relative"> 

      <div className="flex justify-center z-0">
        <img 
          src="../../../../../public/deco-corner.png" 
          alt="Dashboard Illustration" 
          className="absolute top-0 left-0 w-1/2 h-auto z-0"
        />
      </div>
        

      <div className='flex flex-row gap-5 p-5 z-10'>

        <div className="bg-[rgba(255,255,255,0.85)] p-5 rounded-2xl z-10 shadow-lg">
            <h3 className="text-4xl font-bold text-[#037682] ">Good day, Johanne! </h3>
          <p className="text-[#037682] ">Ready for another study session?</p>
        </div>

        <div className="bg-[rgba(255,255,255,0.85)] p-5 rounded-2xl flex shadow-lg">
            <div className="flex flex-col align-center justify-center">
              <div className="flex flex-row gap-3 align-center justify-center">
                <div className="w-10 h-10 bg-[#8BCBC0] rounded-full flex items-center justify-center">
                  <span>M</span>
                </div>
                <div className="w-10 h-10 bg-[#8BCBC0] rounded-full flex items-center justify-center">
                  <span>T</span>
                </div>
                <div className="w-10 h-10 bg-[#8BCBC0] rounded-full flex items-center justify-center">
                  <span>W</span>
                </div>
                <div className="w-10 h-10 bg-[#8BCBC0] rounded-full flex items-center justify-center">
                  <span>Th</span>
                </div>
                <div className="w-10 h-10 bg-[#8BCBC0] rounded-full flex items-center justify-center">
                  <span>F</span>
                </div>
                <div className="w-10 h-10 bg-[#8BCBC0] rounded-full flex items-center justify-center">
                  <span>Sa</span>
                </div>
                <div className="w-10 h-10 bg-[#8BCBC0] rounded-full flex items-center justify-center">
                  <span>S</span>
                </div>
              </div>
            </div>
        </div>

       <div className="bg-[rgba(255,255,255,0.85)] rounded-lg">
          <p>block 1 </p>
        </div>

      </div>

      {/*  start notebooks */}
      <div className="flex flex-col pt-10 items-start z-10">
        {/*  top notebooks */}
        <div className="flex flex-row">
          <div>
            <p className="text-4xl font-bold pr-200">Notebooks</p>
          </div>
          
          <div className="">
            <input
              type="text"
              placeholder="Search"
              className="w-full p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
         {/*  bottom notebooks */}
        <div>
          <div className="flex flex-row gap-5">

            <div className="flex flex-row gap-5">
              <div className="pt-6">
                <img 
                  src="../../../../../public/binder.png" 
                  alt="Dashboard Illustration" 
                  className=" absolute h-75 w-auto z-0"
                />
              </div>
              <div className="bg-[#FFD25E] pt-35 pb-35 pl-5 pr-5 rounded-3xl z-10 shadow-lg">
                <h3 className="text-4xl font-bold text-white ">Notebook 3</h3>
                <p className="text-white ">Description of notebook 3</p>
              </div>
            </div>
            
            <div className="flex flex-row gap-5">
              <div className="pt-6">
                <img 
                  src="../../../../../public/binder.png" 
                  alt="Dashboard Illustration" 
                  className=" absolute h-75 w-auto z-0"
                />
              </div>
              <div className="bg-[#EF988F] pt-35 pb-35 pl-5 pr-5 rounded-3xl z-10 shadow-lg">
                <h3 className="text-4xl font-bold text-white ">Notebook 3</h3>
                <p className="text-white ">Description of notebook 3</p>
              </div>
            </div>

            <div className="flex flex-row gap-5">
              <div className="pt-6">
                <img 
                  src="../../../../../public/binder.png" 
                  alt="Dashboard Illustration" 
                  className=" absolute h-75 w-auto z-0"
                />
              </div>
              <div className="bg-[#037682] pt-35 pb-35 pl-5 pr-5 rounded-3xl z-10 shadow-lg">
                <h3 className="text-4xl font-bold text-white ">Notebook 3</h3>
                <p className="text-white ">Description of notebook 3</p>
              </div>
            </div>
          
          </div>

        </div>

      </div>
      {/*  end notebooks */}
    </div>
  )
}

export default Dashboard