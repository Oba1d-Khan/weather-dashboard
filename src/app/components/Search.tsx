import { Autocomplete, TextField } from '@mui/material';
import { topCities } from '../constants';

interface CitySearchProps {
    onCitySelect: (city: string) => void;
}

const CitySearch: React.FC<CitySearchProps> = ({ onCitySelect }) => {
    return (
        <Autocomplete
            options={topCities}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search Cities"
                    variant="outlined"
                />
            )}
            onChange={(event, value) => onCitySelect(value || '')} // value is a string
        />
    );
};

export default CitySearch;
