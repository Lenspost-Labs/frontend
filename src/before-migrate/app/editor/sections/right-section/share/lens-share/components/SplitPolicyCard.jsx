import React from 'react'
import SplitPolicyHeader from "../../../../../../../assets/pngs/SplitpolicyHeader.png"

export default function SplitPolicyCard() {
  return (
    <>
      {/* <div className={`h-18 mb-5 shadow-md bg-[url(${SplitPolicyBG})] bg-origin-content bg-right bg-no-repeat rounded-xl`}> */}
      <div className={`h-18 mb-5 shadow-md bg-gradient-to-r from-white to-[#e1f16b78] rounded-xl`}>
            <div className="">
                <img className='h-8 pl-1' src={SplitPolicyHeader} alt="" />
            </div>
            <div className=" opacity-80 ml-4 m-1 text-xs">
            Some part of the split fee always goes to the <b>OG creator</b> of this template.
            </div>
      </div>
    </>
  )
}