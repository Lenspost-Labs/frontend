import Lottie from 'lottie-react'
import React from 'react'

// const randomNumber = Math.floor(Math.random() * 3) + 1;
// const animationData = import(`../../../../assets/lottie/emptystates/EmptyState${randomNumber}.json`);

// import animationData from '../../../../assets/lottie/emptystates/emptyState3.json';

const MessageComponent = ({message}) => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* <Lottie className="h-16 pb-2 sm:h-40" animationData={animationData}/> */}
      <div className="text-center"> 
        <p className="text-gray-500 text-sm mt-4">{message}</p>
      </div>
    </div>
  )
}

export default MessageComponent 