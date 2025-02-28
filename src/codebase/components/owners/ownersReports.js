import React, { useEffect, useState, useContext } from 'react';
import { Context } from "../../context/context";
import { AgCharts } from 'ag-charts-react';
import axios from 'axios';

const OwnersReport = () => {
    const {
        APIPath } = useContext(Context);
    const [data, setData] = useState([]);
    const [apiLoading, setApiLoading] = useState(false);

    const fetchData = async () => {
        setApiLoading(true);
        axios.get(APIPath + "/getowners", {
            headers: {
                'ngrok-skip-browser-warning': 'true',
            }
        }).then((response) => {
            setApiLoading(false);
            const ownersData = response.data.data;
            // Process data to count disabled and active users
            const disabledCount = ownersData.filter(owner => owner.Disabled === true).length;
            const activeCount = ownersData.filter(owner => owner.Disabled === false || owner.Disabled === null).length;
            setData([
                { status: 'Disabled', count: disabledCount },
                { status: 'Active', count: activeCount }
            ]);
        }).catch(function (error) {
            // console.log(error);
            setApiLoading(false);
            setData([]);
        });
    };

    useEffect(() => {
        // Replace with your API endpoint
        fetchData();
    }, []);

    var myTheme = {
        overrides: {
            common: {
                title: {
                    fontSize: 11,
                },
            },
            bar: {
                series: {
                    label: {
                        enabled: true,
                        color: 'white',
                    },
                },
            },
        },
    };
    const options_1 = {
        theme: myTheme,
        data: data,
        series: [
            {
                type: 'bar',
                xKey: 'status',
                yKey: 'count',
                // fills: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
                // strokes: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
            },
        ],
        axes: [
            { type: 'status', position: 'bottom' },
            { type: 'count', position: 'left' }
        ],
        title: {
            text: 'Disabled vs Active'
        },
        // background: {
        //     fill: "aliceblue",
        // },
        overlays: {
            loading: {
                renderer: () => 'LOADING...',
            },
            noData: {
                renderer: () => 'NO DATA'
            },
        },
    };
    const options_2 = {
        theme: myTheme,
        data: data,
        series: [
            {
                type: 'pie',
                angleKey: 'count',
                legendItemKey: 'status',
                // fills: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
                // strokes: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1'],
            },
        ],
        title: {
            text: 'Disabled vs Active'
        },
        // background: {
        //     fill: "aliceblue",
        // },
        overlays: {
            loading: {
                renderer: () => 'LOADING...',
            },
            noData: {
                renderer: () => 'NO DATA'
            },
        },
    };

    return (
        <div className="flex flex-wrap gap-x-2">
            <div className="border-gray-700 rounded-lg bg-slate-200 justify-items-center p-1">
                {apiLoading ?
                    <div className='spinner'></div>
                    :
                    <AgCharts options={options_1}
                        className="chart"
                        style={{ width: "300px", height: "300px" }}
                    />
                }
            </div>
            <div className="border-gray-600 rounded-lg bg-slate-200 justify-items-center p-1">
                {apiLoading ?
                    <div className='spinner'></div>
                    :
                    <AgCharts options={options_2}
                        className="chart"
                        style={{ width: "300px", height: "300px" }}
                    />
                }
            </div>
        </div>
        // <Grid container spacing={1}>
        //     <Grid item lg={3}>
        //     </Grid>
        //     <Grid item lg={3}>
        //     </Grid>
        // </Grid>
    );
};

export default OwnersReport;