import React, { useState } from 'react'
import ContentLoader from "react-content-loader"

export default function MangaSkeleton(props) {
	return (
		<div className="grid w-full max-w-6xl grid-cols-12 pt-32 gap-y-10 gap-x-4">
			<div className="col-span-8">
				<ContentLoader 
					speed={2}
					width={800}
					height={160}
					viewBox="0 0 800 160"
					backgroundColor="#e5e7eb"
					foregroundColor="#f3f4f6"
					style={{ width: '100%', height: "auto" }}
					{...props}
				>
					<rect x="0" y="0" rx="10" ry="10" width="340" height="12" /> 
					<rect x="0" y="40" rx="3" ry="3" width="680" height="6" /> 
					<rect x="0" y="60" rx="3" ry="3" width="750" height="6" /> 
					<rect x="0" y="80" rx="3" ry="3" width="750" height="6" />
					<rect x="0" y="100" rx="3" ry="3" width="580" height="6" /> 
				</ContentLoader>
			</div>
			<div className="col-span-4">
				<ContentLoader 
					speed={2}
					width={800}
					height={1200}
					viewBox="0 0 800 1200"
					backgroundColor="#e5e7eb"
					foregroundColor="#f3f4f6"
					style={{ width: '100%', height: "auto" }}
					{...props}
				>
					<rect x="0" y="0" rx="20" ry="20" width="800" height="1600" />
				</ContentLoader>
			</div>
		</div>
	)
}