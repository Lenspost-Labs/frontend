import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { InputGroup, Button } from "@blueprintjs/core";
import { Tab, Tabs,} from "@blueprintjs/core";

import { SectionTab } from "polotno/side-panel";
import { getKey } from "polotno/utils/validate-key";
import { getImageSize } from "polotno/utils/image";
import FaBrain from "@meronex/icons/fa/FaBrain";
import { t } from "polotno/utils/l10n";

import { ImagesGrid } from "polotno/side-panel/images-grid";
import { useCredits } from "../credits";
import { useInfiniteAPI } from "polotno/utils/use-api";
import { getCrop } from "polotno/utils/image";
import { AIIcon } from "../editor-icon";


// New imports: 
import axios from "axios";

const API = "https://api.polotno.dev/api";

const GenerateTab = observer(({ store }) => {
	const inputRef = React.useRef(null);
	const [image, setImage] = React.useState(null);
	const [loading, setLoading] = React.useState(false);
	const { credits, consumeCredits } = useCredits(
		"stableDiffusionCredits",
		10
	);

	const handleGenerate = async () => {
		if (credits <= 0) {
			alert("You have no credits left");
			return;
		}
		setLoading(true);
		setImage(null);

		const req = await fetch(
			`${API}/get-stable-diffusion?KEY=${getKey()}&prompt=${
				inputRef.current.value
			}`
		);
		setLoading(false);
		if (!req.ok) {
			alert("Something went wrong, please try again later...");
			return;
		}
		consumeCredits();
		const data = await req.json();
		setImage(data.output[0]);
	};

	return (
		<>
			<div style={{ height: "40px", paddingTop: "5px" }}>
				Generate image with Stable Diffusion AI (BETA)
			</div>
			<div style={{ padding: "15px 0" }}>
				Stable Diffusion is a latent text-to-image diffusion model
				capable of generating photo-realistic images given any text
				input
			</div>
			<InputGroup
				placeholder="Type your image generation prompt here..."
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleGenerate();
					}
				}}
				style={{
					marginBottom: "20px",
				}}
				inputRef={inputRef}
			/>
			<p style={{ textAlign: "center" }}>
				{!!credits && <div>You have ({credits}) credits.</div>}
				{!credits && (
					<div>You have no credits. They will renew tomorrow.</div>
				)}
			</p>
			<Button
				onClick={handleGenerate}
				intent="primary"
				loading={loading}
				style={{ marginBottom: "40px" }}
				disabled={credits <= 0}>
				Generate
			</Button>
			{image && (
				<ImagesGrid
					shadowEnabled={false}
					images={image ? [image] : []}
					getPreview={(item) => item}
					isLoading={loading}
					onSelect={async (item, pos, element) => {
						const src = item;
						if (
							element &&
							element.type === "svg" &&
							element.contentEditable
						) {
							element.set({ maskSrc: src });
							return;
						}

						if (
							element &&
							element.type === "image" &&
							element.contentEditable
						) {
							element.set({ src: src });
							return;
						}

						const { width, height } = await getImageSize(src);
						const x = (pos?.x || store.width / 2) - width / 2;
						const y = (pos?.y || store.height / 2) - height / 2;
						store.activePage?.addElement({
							type: "image",
							src: src,
							width,
							height,
							x,
							y,
						});
					}}
					rowsNumber={1}
				/>
			)}
		</>
	);
});

const RANDOM_QUERIES = [
	"Magic mad scientist, inside cosmic labratory, radiating a glowing aura stuff, loot legends, stylized, digital illustration, video game icon, artstation, ilya kuvshinov, rossdraws",
	"cute duckling sitting in a teacup, photography, minimalistic, 8 k ",
	"anime girl",
	"an mascot robot, smiling, modern robot, round robot, cartoon, flying, fist up, crypto coins background",
];

const SearchTab = observer(({ store }) => {
	// load data
	const [query, setQuery] = React.useState("");
	const [data, setData] = React.useState(null);
	const [isLoading, setIsLoading] = React.useState(false);
	const [error, setError] = React.useState(null);

	const [delayedQuery, setDelayedQuery] = React.useState(
		RANDOM_QUERIES[(RANDOM_QUERIES.length * Math.random()) | 0]
	);

	const requestTimeout = React.useRef();
	React.useEffect(() => {
		requestTimeout.current = setTimeout(() => {
			setDelayedQuery(query);
		}, 1000);
		return () => {
			clearTimeout(requestTimeout.current);
		};
	}, [query]);

	React.useEffect(() => {
		if (!delayedQuery) {
			return;
		}
		async function load() {
			setIsLoading(true);
			setError(null);
			try {
				const req = await fetch(
					`https://lexica.art/api/v1/search?q=${delayedQuery}`
				);
				const data = await req.json();
				setData(data.images);
			} catch (e) {
				setError(e);
			}
			setIsLoading(false);
		}
		load();
	}, [delayedQuery]);

	return (
		<>
			<InputGroup
				leftIcon="search"
				placeholder={("Search")}
				onChange={(e) => {
					setQuery(e.target.value);
				}}
				type="search"
				style={{
					marginBottom: "20px",
				}}
			/>
			{/* <p>
				Search AI images with{" "}
				<a
					href="https://lexica.art/"
					target="_blank">
					https://lexica.art/
				</a>
			</p> */}
			<ImagesGrid
				shadowEnabled={false}
				images={data}
				getPreview={(item) => item.srcSmall}
				isLoading={isLoading}
				error={error}
				onSelect={async (item, pos, element) => {
					if (
						element &&
						element.type === "svg" &&
						element.contentEditable
					) {
						element.set({ maskSrc: item.src });
						return;
					}

					const { width, height } = await getImageSize(item.srcSmall);

					if (
						element &&
						element.type === "image" &&
						element.contentEditable
					) {
						const crop = getCrop(element, {
							width,
							height,
						});
						element.set({ src: item.src, ...crop });
						return;
					}

					const x = (pos?.x || store.width / 2) - width / 2;
					const y = (pos?.y || store.height / 2) - height / 2;
					store.activePage?.addElement({
						type: "image",
						src: item.src,
						width,
						height,
						x,
						y,
					});
				}}
				rowsNumber={2}
			/>
		</>
	);
});

const StableDiffusionPanel = observer(({ store }) => {
	const [selectedTabId, setSelectedTabId] = React.useState("search");
	return (
		<div
			style={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
			}}>
			<Tabs
				id="TabsExample"
				defaultSelectedTabId="search"
				onChange={(tabId) => {
					setSelectedTabId(tabId);
				}}>
								<Tab
					id="search"
					title="Search"
				/>
				{/* <Tab
					id="generate"
					title="Generate"
				/>
				<Tab
					id="designify"
					title="Designify"
				/> */}
				<Tab
					id="textToImage"
					title="Text to Image"
				/>
			</Tabs>
			<div
				style={{
					height: "calc(100% - 20px)",
					display: "flex",
					flexDirection: "column",
					paddingTop: "20px",
				}}>
				{selectedTabId === "search" && <SearchTab store={store} />}
				{/* {selectedTabId === "generate" && <GenerateTab store={store} />}
				{selectedTabId === "designify" && <DesignifyTab store={store} />} */}
				{selectedTabId === "textToImage" && <TextToImageTab store={store} />}
			</div>
		</div>
	);
});
// New Tab - Designify Start

//API KEY - eea3ea9b371d1ad5fdd62387d42009ed
// https://www.designify.com/dashboard?tab=api-key

const DesignifyTab = observer(({ store }) => {
	// const [selectedTabId, setSelectedTabId] = React.useState("designify");
	const fileInputRef = useRef(null);

	console.log(`Store variable`); 
	console.log(store); 

	const handleImageUpload = async () => {
	  try {
		const file = fileInputRef.current.files[0];
		
		console.log(file);

		const formData = new FormData();
		formData.append("image_file", file);
  
		const response = await axios.post(
		  "https://api.designify.com/v1.0/designify/:designID",
		  formData,
		  {
			headers: {
			  "Content-Type": "multipart/form-data",
			//   "X-Api-Key": "eea3ea9b371d1ad5fdd62387d42009ed",
			  "X-Api-Key": "9822b7f73ff3bea87eee20370ac3982e",
			},
			responseType: "arraybuffer",
			encoding: null,
		  }
		);
  
		if (response.status === 200) {
		  const imageBlob = new Blob([response.data]);
		  const imageUrl = URL.createObjectURL(imageBlob);
		  const link = document.createElement("a");
		  link.href = imageUrl;
		  link.download = "design.png";
		  link.click();
		} else {
		  console.error("Error:", response.status, response.statusText);
		}
	  } catch (error) {
		// console.log(error.response.data);
		console.log(error);

	  }
	};

	return (
		<>
			<div style={{ height: "40px", paddingTop: "5px" }}>
				Inside Designify Tab
				{/* ------------------------------------------------------ */}
				{/* Just for DEV testing */}
				{/* <BgRemove/> */}
				{/* ------------------------------------------------------ */}
			</div>
			<div>
				<input type="file" ref={fileInputRef} />
				<button onClick={handleImageUpload}>Upload</button>
			</div>
		</>
	);
});

// New Tab - Designify End

// 07e9340b97c84afeb46b83899d64701f

// New Tab - Text to Image Start
const TextToImageTab = observer(({ store }) => { 

	const [stTextInput, setStTextInput] = useState(""); 
	const [stImageUrl, setStImageUrl] = useState("");
	const [stTaskId, setStTaskId] = useState(0);
	const [stImageLoadStatus, setStImageLoadStatus] = useState(0);
	const [stStatusCode, setStStatusCode] = useState(0);
	const [stLoading, setStLoading] = useState(false);

	const varApiKey = '313643402a8146568d9c8f2d730356a1';
	// cbc8f827de974acd8d19d03b0db6c627
	// 313643402a8146568d9c8f2d730356a1

	const fnHandleText = (evt) => { 
		setStTextInput(evt.target.value)
		console.log(stTextInput);
	}

	const fnCallApi = async () =>{
		setStLoading(true)
		
		console.log(`Handling the API Start - ${stTextInput}`);
		
		const varApiUrl = 'https://www.cutout.pro/api/v1/text2imageAsync';

		const requestData = {
			prompt: `${stTextInput}`,
		};

		const config = {
			headers: {
				"Access-Control-Allow-Origin": "https://localhost:5173", 
				'Content-Type': 'application/json',
				'APIKEY': varApiKey,
			},
		};

		axios.post(varApiUrl, requestData, config)
		.then(  res => {
			console.log('Image generation successful!');
			console.log(`The response is: `);
			console.log(res);

			console.log(`The Task Id is: `)
			setStTaskId(res.data.data)
			setStStatusCode(res.data.code)
			console.log(res.data.data)
			console.log("The Query API execution START")

			//--------------- Generate the Image API - GET Start ---------------
			
			const apiUrl = 'https://www.cutout.pro/api/v1/getText2imageResult';
			const taskId = `${res.data.data}`; 
			
			const config = {
				headers: {
					'APIKEY': varApiKey,
					"Access-Control-Allow-Origin": "https://localhost:5173", 
				},
				params: {
					taskId: taskId,
				},
			};
			
			axios.get(apiUrl, config)
				.then(response => {
				console.log('Get text to image result successful!');
				console.log("GET Response is: ");
				console.log(response);
				// Handle the response data here
					setStImageUrl(response.data.data.resultUrl)
					setStImageLoadStatus(response.data.data.status)
				})
				.catch(error => {
				console.error('Error getting text to image result:', error);
				// Handle errors here
				});
			
			//--------------- Generate the Image API - GET End ---------------

			console.log("The Query API execution END")
		})
		.catch( err => console.log(err))	

		setStLoading(false)
		console.log("Handling the API End");
	}
	const fnGetImageAPI = () => {

		const taskId = `${stTaskId}`; 
		const apiUrl = 'https://www.cutout.pro/api/v1/getText2imageResult';
		
		const config = {
			headers: {
				'APIKEY': varApiKey,
				"Access-Control-Allow-Origin": "https://localhost:5173", 
			},
			params: {
				// taskId: 369316216628389, //For Test
				taskId: taskId,
			},
		};
		
		axios.get(apiUrl, config)
			.then(response => {
			console.log('Get text to image result successful!');
			console.log("GET Response is: ");
			console.log(response);
			// Handle the response data here
				setStImageUrl(response.data.data.resultUrl)
				setStImageLoadStatus(response.data.data.status)
			})
			.catch(error => {
			console.error('Error getting text to image result:', error);
			// Handle errors here
			})	
	}

	useEffect(()=>{fnGetImageAPI}, [stImageLoadStatus, stTaskId, stStatusCode])


	return ( 
	<>
		<div className="flex flex-row justify-normal align-bottom">

			<textarea rows="4" 
				className="mb-4 border px-2 py-1 rounded-md" 
				placeholder="Description of the Image"
				onChange={(e) => { fnHandleText(e) }}
			> </textarea>
			<Button icon="search" className="ml-4 border px-2 py-1 h-8 rounded-md" onClick={fnCallApi}></Button> 
			<Button icon="refresh" className="ml-4 border px-2 py-1 h-8 rounded-md" onClick={fnGetImageAPI}></Button> 
		</div>
		
		{stTextInput && `Showing Search results for ${stTextInput}`}
		{stStatusCode == 5010
			? <div className="p-2 m-2" title="Server Error" color="red">
					The server is at capacity, Please try again later
				</div>
			: ""
		}
		{stLoading && "Loading" }

		{stImageUrl && <img src={stImageUrl} alt="Searched Image"/> }

		{/* Image Grid */}

		{/* <ImagesGrid
				images={stImageUrl}
				key={stImageUrl}
				getPreview={(image) => image.url}
				onSelect={async (image, pos) => {
					const { width, height } = await getImageSize(image.url);
					store.activePage.addElement({
						type: "image",
						src: "",
						width,
						height,
						// if position is available, show image on dropped place
						// or just show it in the center
						x: pos ? pos.x : store.width / 2 - width / 2,
						y: pos ? pos.y : store.height / 2 - height / 2,
					});
				}}
				rowsNumber={2}
				isLoading={""} //How many images to Load .length
				loadMore={false}
			/> */}
	</>
	)
})

// New Tab - Text to Image End


// define the new custom section
export const StableDiffusionSection = {
	name: "stable-diffusion",
	Tab: (props) => (
		<SectionTab
			name="AI Image"
			{...props}>
			<AIIcon />
		</SectionTab>
	),
	// we need observer to update component automatically on any store changes
	Panel: StableDiffusionPanel,
};