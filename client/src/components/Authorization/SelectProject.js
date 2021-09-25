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
        <div style={{ textAlign: 'center' }}>
            <FormControl>
                <InputLabel>Select Project</InputLabel>
                <Select label="Project Name" onChange={onChange}>
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
        </div>
    );
}