// --------
// Onboarding steps - currently use id [#step-number]
// Created : 27Jul2023
// --------
// import { useAccount } from "wagmi"
import shareGif from "../../../../assets/gifs/ShareGif.gif"

export const OnboardingSteps = () =>{

  // const {isConnected} = useAccount();

  // if(isConnected){
  return (
  [
    {
      selector: '#first-step',
      content: <>
      <div className="flex flex-col justify-center align-middle text-center">
        {/* <iframe src="https://giphy.com/embed/IhIsxGk9FqOSI7a0Nn" width="240" height="120" ></iframe> */}
        <img height={320} src={"/svgs/ConnectWalletIntroTour.svg"}></img>
        <div className="mt-2"> Connect your wallet </div>
      </div>
      </>
    },
    {
      selector: '#second-step',
      content: 'Explore our one tap magic tools',
    },
    // {
    //   selector: '#third-step',
    //   content: 'Leaverage the power of AI',
    // },
    {
      selector: '#fourth-step',
      content: <> Remove Background </>,
    },
    // {
    //   selector: '#fifth-step',
    //   content:  <>
    //     <div className="flex flex-col justify-center align-middle text-center">
    //       <iframe src={shareGif} width="120"></iframe>
    //       <div className=""> Share on socials </div>
    //     </div>
    // </> 
    // }
  ])
// }
}
export const OnboardingStepsWithShare = () =>{

  // const {isConnected} = useAccount();

  // if(isConnected){
  return (
  [
    {
      selector: '#first-step',
      content: <>
      <div className="flex flex-col justify-center align-middle text-center">
        {/* <iframe src="https://giphy.com/embed/IhIsxGk9FqOSI7a0Nn" width="240" height="120" ></iframe> */}
        <img height="320" src={"/svgs/ConnectWalletIntroTour.svg"}></img>
        <div className="mt-2"> Connect your wallet </div>
      </div>
      </>
    },
    {
      selector: '#second-step',
      content: 'Explore our one tap magic tools',
    },
    // {
    //   selector: '#third-step',
    //   content: 'Leaverage the power of AI',
    // },
    {
      selector: '#fourth-step',
      content: <> Remove Background </>,
    },
    {
      selector: '#fifth-step',
      content:  <>
        <div className="flex flex-col justify-center align-middle text-center">
          <img src={shareGif} width="120"></img>
          <div className=""> Share on socials </div>
        </div>
    </> 
    }
  ])
// }
}