// --------
// This File contains IntroTour components of all the Sidebar sections
// Created: 02Aug2023
// --------

import { IconBase } from '@meronex/icons'
import { useTour } from '@reactour/tour'
import { useEffect } from 'react'
import SuJumpUp from '@meronex/icons/su/SuJumpUp';
import FcIdea from '@meronex/icons/fc/FcIdea';

export const NFTReacTour = () => {
  const { isOpen, currentStep, steps, setIsOpen, setCurrentStep, setSteps } = useTour()

  return (
    <>

        {/* <button onClick={() => setIsOpen(o => !o)}>Take a tour</button> */}
        {/* <button onClick={() => setCurrentStep(3)}>
          Take a fast way to 4th place
        </button> */}
        <button
          onClick={() =>{
            setIsOpen(true);
            setSteps([
                { selector: '#walletNFTS', content: <>
                <div className="">
                  {/* All your NFTs at one place  */}
                  All your ETH, Polygon & Lens NFTs should be here
                  Search by Token ID or Description
                </div>
                </>
                },
                { selector: '#cc0collections', content: <>
                  'Long live CC<span className="text-base">0</span>! Permissionless NFTs you can use for your designs'
                </>
                }, 
                // CC0 - Edit
            ])
            setCurrentStep(0)
            }
          }
        > 
        {/* <div className="flex flex-row justify-end align-middle">
          <SuJumpUp className="ml-2 mt-2" size="18"/> <div className="m-2 text-xs"> Quick tour </div>
        </div>   */}
        <div className="flex flex-row justify-end align-middle">
          <FcIdea className="m-2" size="16"/> <div className="m-2 ml-0 text-sm text-yellow-600"> Quick tour </div>
        </div>
        </button>
 
    </>
  )
}

export const MyDesignReacTour = () => {
    const { isOpen, currentStep, steps, setIsOpen, setCurrentStep, setSteps } = useTour()
  
    return (
      <>
  
          {/* <button onClick={() => setIsOpen(o => !o)}>Take a tour</button> */}
          {/* <button onClick={() => setCurrentStep(3)}>
            Take a fast way to 4th place
          </button> */}
          <button
            onClick={() =>{
              setIsOpen(true);
              setSteps([
                { selector: '#RecentDesigns', content: 'All your recent designs in one place' },
                { selector: '#makePublic', content: 'Make your design Public / Private' },
              ])
              setCurrentStep(0)
              }
            }
          >       
          <div className="flex flex-row justify-end align-middle">
            <FcIdea className="m-2" size="16"/> <div className="m-2 ml-0 text-sm text-yellow-600"> Quick tour </div>
          </div>
        </button>
   
      </>
    )
  }


export const StickerReacTour = () => {
  const { isOpen, currentStep, steps, setIsOpen, setCurrentStep, setSteps } = useTour()

  return (
    <>

        {/* <button onClick={() => setIsOpen(o => !o)}>Take a tour</button> */}
        {/* <button onClick={() => setCurrentStep(3)}>
          Take a fast way to 4th place
        </button> */}
        <button
          onClick={() =>{
            setIsOpen(true);
            setSteps([
                { selector: '#stickerCategories', content: 'Discover 1000s of stickers by your fave communities, artists, brands or simply utility stickers' },
                { selector: '#stickerSearch', content: <>
                  <div className="flex flex-col justify-center align-middle">
                    <iframe src="https://giphy.com/embed/Wry6dNkn5wwIhXD4SQ" width="120" height="120"></iframe>
                    {/* <image src="https://giphy.com/embed/Wry6dNkn5wwIhXD4SQ" width="120" height="120"/> */}
                    <div className="mt-2">'Spit out your thoughts'</div>
                  </div>
                </>
               },
            ])
            setCurrentStep(0)
            }
          }
        > 
        <div className="flex flex-row justify-end align-middle">
            <FcIdea className="m-2" size="16"/> <div className="m-2 ml-0 text-sm text-yellow-600"> Quick tour </div>
        </div>
        </button>
 
    </>
  )
}


// AI Image section 
// Selector : search bar
