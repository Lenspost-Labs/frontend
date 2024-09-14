import Lottie from 'lottie-react'
import React from 'react'

export const SecNameHeading = ({name, hasSeeMore, seeMoreFn, animationData}) => {
  return (
    <>
        <div className="flex flex-row justify-between items-center m-1">

            <div className="flex flex-row justify-center items-center">
                <div className=""> {name} </div>
                <div className="ml-2"> <Lottie className="h-10" animationData={animationData}/> </div>
            </div>

            {hasSeeMore && 
            <div onClick={seeMoreFn} 
                className="appFont text-sm font-medium cursor-pointer opacity-80 hover:opacity-60"> 
                See more
            </div> }
        </div>

    </>
  )
}
