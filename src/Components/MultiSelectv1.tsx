import * as React from 'react';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Controller } from 'react-hook-form';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Option {
  label: string;
  value: string | number;
  show?: boolean
}

interface MultiSelectV1Props {
  name: string;
  label: string;
  options: Option[];
  control: any;
  errors?: any;
  disabledOptions?: (string | number)[];
}

const MultiSelectV1: React.FC<MultiSelectV1Props> = ({
  name,
  label,
  options,
  control,
  errors,
  disabledOptions = [],
}) => {
 
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => {
        const handleDelete = (chipToDelete: string | number) => {
          const newValue = field.value.filter((v: any) => v !== chipToDelete);
          field.onChange(newValue);
        };

        const value: (string | number)[] = Array.isArray(field.value)
          ? field.value
          : typeof field.value === 'string'
          ? field.value.split(',')
          : [];

        return (
          <FormControl
            sx={{ mb: 2 }}
            error={Boolean(errors?.[name])}
            size="small"
            fullWidth
          >
            <Select
              labelId={`${name}-label`}
              id={name}
              multiple 
              value={value}
              onChange={(e: SelectChangeEvent<any>) =>
                field.onChange(
                  typeof e.target.value === 'string'
                    ? e.target.value.split(',')
                    : e.target.value
                )
              }
             
              renderValue={(selected) => {
                
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((val: string | number) => {
                      const label = options.find((opt) => String(opt.value) === String(val))?.label || val;
                      return (
                        <Chip
                          key={val}
                          label={label}
                          onDelete={() => handleDelete(val)}
                          onMouseDown={(e) => e.stopPropagation()}
                        />
                      );
                    })}
                  </Box>
                )
              }}
              
              MenuProps={MenuProps}
            >
              {options.map((option) => {
                return (
                  <MenuItem
                    key={option.value}
                    value={option.value}
                    disabled={disabledOptions.includes(option.value)}
                    sx={{ display: value.includes(option.value) && !option.show ? 'none' : 'block' }}
                  >
                    {option.label}
                  </MenuItem>
                )
              })}
            </Select>
            {errors?.[name] && (
              <Box sx={{ color: 'error.main', fontSize: 12, mt: 0.5 }}>
                {errors[name]?.message}
              </Box>
            )}
          </FormControl>
        );
      }}
    />
  );
};

export default MultiSelectV1;
