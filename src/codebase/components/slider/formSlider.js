import React from 'react';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const FormSlider = ({ value, onChange }) => {
    return (
        <div className='sliderBottom' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{ width: '800px' }}>
                {/* <Typography gutterBottom className='normal'>Form Width</Typography> */}
                <Slider
                    value={value}
                    color='warning'
                    onChange={onChange}
                    step={100}
                    min={400}
                    max={1000}
                    valueLabelDisplay="auto"
                    marks={[
                        { value: 400, label: '400px' },
                        { value: 500, label: '500px' },
                        { value: 600, label: '600px' },
                        { value: 700, label: '700px' },
                        { value: 800, label: '800px' },
                        { value: 900, label: '900px' },
                        { value: 1000, label: '1000px' },
                    ]}
                />
            </div>
        </div>
    );
};

export default FormSlider;