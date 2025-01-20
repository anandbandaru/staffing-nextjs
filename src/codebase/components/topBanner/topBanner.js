import React from "react";
import './topBanner.css';
import Clock from 'react-live-clock';

const TopBanner = () => {
    return (
        <div className="topBannerHolder">
            <div className="timeZonesHolder text-white text-xs flex justify-start place-items-center space-x-3 ">
                <ul className="flex w-full border-b border-gray-200">
                    <li className="mr-2">
                        <span className="companyLogo ">VIZION TECHNOLOGIES</span>
                    </li>
                    <li className="border-l border-gray-300">
                        <span className="companyLogo ">STAFFING SOLUTION</span>
                    </li>
                    <li className="px-2 pt-0.5 rounded-sm leading-5 border-l border-gray-300 itemToHideForSmall">
                        {/* <AccessTimeIcon fontSize="small" style={{ fontSize: '16px', height: '16px' }} /> */}
                        TIME:
                    </li>
                    <li className="px-2 pt-0.5 rounded-sm mr-2 leading-5 border-l border-gray-300 itemToHideForSmall">
                        PST: <Clock format={"dd, MMM Do YYYY, h:mm a"} ticking={true} timezone={'US/Pacific'} />
                    </li>
                    <li className="px-2 pt-0.5 rounded-sm mr-2 leading-5 border-l border-gray-300 itemToHideForSmall">
                        CST: <Clock format={"dd, MMM Do YYYY, h:mm a"} ticking={true} timezone={'US/Central'} />
                    </li>
                    <li className="px-2 pt-0.5 rounded-sm mr-2 leading-5 border-l border-gray-300 itemToHideForSmall">
                        IST: <Clock format={"dd, MMM Do YYYY, h:mm a"} ticking={true} timezone={'Asia/Calcutta'} />
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default TopBanner;