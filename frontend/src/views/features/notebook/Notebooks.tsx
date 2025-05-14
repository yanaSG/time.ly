import React from 'react'

const Notebooks = () => {
  return (
    <div>
      <div className="flex flex-row z-0 align-center items-center gap-5 pt-10">
        <div className="flex bg-[#FFD25E] mr-100 p-4 w-1/6 items-center align-center justify-center items-start rounded-2xl shadow-lg text-white transition-transform duration-300 hover:scale-105">
          <img 
            src="../../../../../public/add-notebook.png" 
            alt="Add Notebook" 
            className="h-5 w-5 inline-block mr-2"
          />
          <p>Add New Notebook</p>
        </div>

        <div className="">
          <input 
            type="text" 
            placeholder="Search Notebooks..." 
            className="w-100 p-3 rounded-full border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD25E]"
          />
            <button className="bg-[#FFD25E] text-white rounded-full px-4 py-2 ml-2 hover:bg-[#E6B84F] transition-transform duration-300 hover:scale-105">
            Search
            </button>
        </div>

      </div>
      
        {/* notebooks */}
      <div className="flex flex-row gap-5 pt-10">

        <div className="flex flex-row gap-5 transform transition-transform duration-300 hover:scale-105">
          <div className="pt-6">
            <img 
              src="../../../../../public/binder.png" 
              alt="Dashboard Illustration" 
              className=" absolute pl-2 h-42 w-auto z-0"
            />
          </div>
          <div className=" flex flex-col justify-center
            bg-[#FFD25E] 
            h-55 w-40 rounded-2xl z-10 
            shadow-lg pl-2
            ">
            <h3 className="text-xl font-bold text-white ">Notebook 3</h3>
            <p className="text-white text-sm">Description of notebook 3</p>
          </div>
        </div>
        
        <div className="flex flex-row gap-5 transform transition-transform duration-300 hover:scale-105">
          <div className="pt-6">
            <img 
              src="../../../../../public/binder.png" 
              alt="Dashboard Illustration" 
              className=" absolute pl-2 h-42 w-auto z-0"
            />
          </div>
            <div 
            className="flex flex-col justify-center
            bg-[#EF988F] 
            h-55 w-40 rounded-2xl z-10 
            shadow-lg pl-2 
            ">
            <h3 className="text-xl font-bold text-white ">Notebook 3</h3>
            <p className="text-white text-sm">Description of notebook 3</p>
            </div>
        </div>


      
      </div>

    </div>
  )
}

export default Notebooks