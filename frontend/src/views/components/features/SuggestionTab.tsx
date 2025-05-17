import React from 'react'
import SuggestionButton from '../ui/buttons/SuggestionButton'

const SuggestionTab: React.FC = () => {
  const header = 'timely-suggests.svg'

    return (
        <div className='w-full h-full flex flex-col gap-2 items-start p-2'>
            <img src={header} alt="noot" className='h-10 m-1 mx-2' />
            <div className='w-full h-full flex flex-col gap-3 rounded-lg'>
                <SuggestionButton message='Review notes today, then in 3 days—Noot will remind you!' />
            </div>
        </div>
    )
}

export default SuggestionTab