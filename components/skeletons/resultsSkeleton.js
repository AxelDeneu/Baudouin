import React, { useState } from 'react'
import ContentLoader from "react-content-loader"

export default (props) => {
	return (
		<div className="grid w-full max-w-6xl grid-cols-3 mx-auto gap-y-10 gap-x-4">
			<ContentLoader 
				speed={2}
				width={400}
				height={310}
				viewBox="0 0 400 310"
				backgroundColor="rgb(229, 231, 235)"
				foregroundColor="rgb(243, 244, 246)"
				{...props}
			>
				<rect x="12" y="17" rx="0" ry="0" width="0" height="1" /> 
				<rect x="125" y="230" rx="0" ry="0" width="150" height="10" /> 
				<rect x="50" y="275" rx="0" ry="0" width="300" height="6" /> 
				<rect x="100" y="300" rx="0" ry="0" width="200" height="6" /> 
				<rect x="125" y="0" rx="0" ry="0" width="150" height="200" />
			</ContentLoader>
			<ContentLoader 
				speed={2}
				width={400}
				height={310}
				viewBox="0 0 400 310"
				backgroundColor="rgb(229, 231, 235)"
				foregroundColor="rgb(243, 244, 246)"
				{...props}
			>
				<rect x="12" y="17" rx="0" ry="0" width="0" height="1" /> 
				<rect x="125" y="230" rx="0" ry="0" width="150" height="10" /> 
				<rect x="50" y="275" rx="0" ry="0" width="300" height="6" /> 
				<rect x="100" y="300" rx="0" ry="0" width="200" height="6" /> 
				<rect x="125" y="0" rx="0" ry="0" width="150" height="200" />
			</ContentLoader>
			<ContentLoader 
				speed={2}
				width={400}
				height={310}
				viewBox="0 0 400 310"
				backgroundColor="rgb(229, 231, 235)"
				foregroundColor="rgb(243, 244, 246)"
				{...props}
			>
				<rect x="12" y="17" rx="0" ry="0" width="0" height="1" /> 
				<rect x="125" y="230" rx="0" ry="0" width="150" height="10" /> 
				<rect x="50" y="275" rx="0" ry="0" width="300" height="6" /> 
				<rect x="100" y="300" rx="0" ry="0" width="200" height="6" /> 
				<rect x="125" y="0" rx="0" ry="0" width="150" height="200" />
			</ContentLoader>
		</div>
		
		)
	}