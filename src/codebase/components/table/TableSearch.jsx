/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
import React, { useState, useEffect } from "react";


export const TableSearch = (props) => {

    const [currDS, setCurrDS] = useState({ name: "test", value: [] });
    const [currDS_O, setCurrDS_O] = useState({ name: "test", value: [] });

    useEffect(() => {
        setCurrDS(props.cDS);
        setCurrDS_O(props.cDS_O);
    }, []);

    var handleToUpdate = props.handleToUpdate;

    function sbTextChange(event) {
        const textValue = event.target.value;
        console.log(textValue);
        console.log(props.paramName);
        const newVal = {
            something: 0,
            value: []
        };

        if (textValue == "") {
            newVal.value = props.cDS_O.value;
        }
        else {
            if (props.itemCount == 0)
                return;

            const filteredPbiDatasetsData = props.cDS_O.value.filter(ds => ds[props.paramName].toLowerCase().includes(textValue.toLowerCase()));
            newVal.value = filteredPbiDatasetsData;
            setCurrDS(newVal);
        }
        handleToUpdate(newVal);
    }

    return (
        <>
            <div className="float-right flex flex-grow ">
                <div className="flex flex-grow place-content-end pr-2">
                    <input className="appearance-none  bg-white border-none text-gray-700 py-0 px-2 text-xs leading-tight rounded-sm"
                        type="text" placeholder={props.placeholder}
                        aria-label={props.label}
                        onChange={sbTextChange} />
                    SICON
                </div>
            </div>
        </>
    )
}