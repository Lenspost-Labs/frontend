import { observer } from "mobx-react-lite";
import { SectionTab } from "polotno/side-panel";
import { Button } from "@blueprintjs/core";
import { useEffect, useState } from "react";
import { ResizeIcon } from "../editor-icon";

const AVAILABLE_SIZES = [
	{ width: 1080, height: 1350, imgUrl: "/other-icons/resize-sizes/resize1.svg" },
	{ width: 1200, height: 630, imgUrl: "/other-icons/resize-sizes/resize2.svg" },
	{ width: 820, height: 312, imgUrl: "/other-icons/resize-sizes/resize3.svg" },
	{ width: 1080, height: 1080, imgUrl: "/other-icons/resize-sizes/resize4.svg" },
	{ width: 1080, height: 1080, imgUrl: "/other-icons/resize-sizes/resize5.svg" },
	{ width: 1080, height: 1920, imgUrl: "/other-icons/resize-sizes/resize6.svg" },
	{ width: 1080, height: 1080, imgUrl: "/other-icons/resize-sizes/resize7.svg" },
	{ width: 1080, height: 1920, imgUrl: "/other-icons/resize-sizes/resize8.svg" },
	{ width: 1080, height: 1920, imgUrl: "/other-icons/resize-sizes/resize9.svg" },
	{ width: 1080, height: 1080, imgUrl: "/other-icons/resize-sizes/resize10.svg" },	
	{ width: 1500, height: 500, imgUrl: "/other-icons/resize-sizes/resize11.svg" },	
];

// define the new custom section
export const CustomSizesPanel = {
	name: "sizes",
	Tab: (props) => (
		<SectionTab
			name="Sizes"
			{...props}>
			<ResizeIcon />
		</SectionTab>
	),
	Panel: observer(({ store }) => {
		const [width, setWidth] = useState(1000);
		const [height, setHeight] = useState(1000);

		useEffect(() => {
			store.setSize(width, height);
		}, [width, height]);

		return (	
				<div className="flex flex-col overflow-y-scroll overflow-x-hidden h-full">
				{/* <label htmlFor="width">Width (px)</label> */}
				<div className="sticky top-0 bg-white">
					<div className="m-2 p-1">Set custom size</div>
					<div className="flex flex-row justify-center text-center">
						<input
						className="border-2 rounded-md p-2 m-2 w-32"
						placeholder="width"
						name="width"
						type="number"
						min="0"
						value={width}
						onChange={(e) => setWidth(Number(e.target.value))}
						/>
						{/* <br /> */}
						<div className="m-2 mt-4 mb-4">X</div>
						{/* <label htmlFor="height">Height (px)</label> */}
						<input
						className="border-2 rounded-md p-2 m-2 w-32"
						placeholder="height"
						name="height"
						type="number"
						min="0"
						value={height}
						onChange={(e) => setHeight(Number(e.target.value))}
						/>
					</div>
				</div>
				<hr className="m-4"/>
				<div className="flex flex-row flex-wrap justify-center">
					{AVAILABLE_SIZES.map(({ width, height, imgUrl }, i) => (
						<div className="cursor-pointer p-1 w-32"
						key={i}
						onClick={() => {
							store.setSize(width, height); 
						}}>
							<img src={imgUrl} alt="" />
						</div>
					))}
				</div>
			</div>
		);
	}),
};
