import React from 'react';
import FormControl from '@northstar/core/FormControl';
import InputLabel from '@northstar/core/InputLabel';
import Select from '@northstar/core/Select';
import MenuItem from '@northstar/core/MenuItem';

export default function SelectProject({ data, onSelect }) {
    const projects = data.values;

    const onChange = ( event ) => {
       onSelect(event.target.value);
    };

    return (
        <FormControl>
            <InputLabel>Project Name</InputLabel>
            <Select onChange={onChange} label="Project Name"  variant="outlined">
                <MenuItem value="">
                    <em>None</em>
                </MenuItem>
                {
                    projects.map((value, index) => {
                        return <MenuItem key={index} value={value.key}>{value.key}</MenuItem>
                    })
                }
            </Select>
        </FormControl>
    );
}