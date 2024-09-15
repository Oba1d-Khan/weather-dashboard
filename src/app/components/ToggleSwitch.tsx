import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';

const ToggleSwitch = ({ label, checked, onChange }: {
    label: string,
    checked: boolean,
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}) => {
    return (
        <FormControlLabel
            control={<Switch checked={checked} onChange={onChange} />}
            label={label}
        />
    );
};

export default ToggleSwitch;
