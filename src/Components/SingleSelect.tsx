import { useState, useMemo, useRef, useEffect } from 'react';
import { Select, MenuItem, ListSubheader, TextField } from '@mui/material';

const containsText = (text: string | number, searchText: string | number) => {
  const textString = String(text).toLowerCase();
  const searchTextString = String(searchText).toLowerCase();
  return textString.indexOf(searchTextString) > -1;
};

const SingleSelect: React.FC<{
  placeholderText: string | null;
  options: any;
  fields: any;
  disable: any;
  setValue: any;
  handleSelectedOption?: any;
  autoPopulate?: boolean;
  disabledOptions: any;
  readOnly: any;
}> = ({
  placeholderText,
  options,
  fields,
  disable,
  setValue,
  handleSelectedOption,
  autoPopulate,
  disabledOptions,
  readOnly
}) => {
  const textfieldRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);

  const displayedOptions = useMemo(() => {
    if (searchText !== '') {
      return options?.filter(option => containsText(option.label, searchText));
    } else {
      return options;
    }
  }, [searchText, options]);

  useEffect(() => {
    if (fields.value) {
      setSelectedOption(options?.filter(option => option.value === Number(fields.value))[0]);
    }
    if (options && options.length === 1 && autoPopulate) {
      setValue(fields.name, options[0].value);
    }
  }, [options]);

  return (
    <Select size='small' sx={{padding:'1px'}}
      MenuProps={{ autoFocus: false }}
      displayEmpty
      disabled={disable}
      onOpen={() => {
        setTimeout(() => {
          if (textfieldRef.current) {
            textfieldRef.current.focus();
          }
        }, 0);
      }}
      onClose={() => setSearchText('')}
      {...fields}
      onChange={(value, child: any) => {
        if (fields.name === 'state') {
          setValue(fields.name + 'Name', child.props.children);
        }
        const option = { name: fields.name, label: child.props.children, value: child.props.value };
        setSelectedOption(option);
        if (handleSelectedOption) {
          handleSelectedOption(option);
        }
        fields.onChange(value);
      }}
      style={{ width: '100%', minWidth: '150px' }}
      className={readOnly ? 'read-only' : ''}
    >
      {/* TextField is put into ListSubheader so that it doesn't
            act as a selectable item in the menu
            i.e. we can click the TextField without triggering any selection.*/}
      <ListSubheader>
        <TextField
          size="small" sx={{padding:'1px'}}
          inputRef={textfieldRef}
          placeholder="Type to search..."
          fullWidth
          autoFocus
          onChange={e => setSearchText(e.target.value)}
          onKeyDown={e => {
            if (e.key !== 'Escape') {
              // Prevents autoselecting item while typing (default Select behaviour)
              e.stopPropagation();
            }
          }}
        />
      </ListSubheader>
      {placeholderText === null && (
        <MenuItem className="d-none" disabled value="">
          Select
        </MenuItem>
      )}
      {placeholderText !== null && <MenuItem value="">{placeholderText}</MenuItem>}
      {selectedOption && (
        <MenuItem className="d-none" disabled value={selectedOption.value}>
          {selectedOption.label}
        </MenuItem>
      )}
      {displayedOptions && displayedOptions.length !== 0 ? (
        displayedOptions.map(option => (
          <MenuItem
            key={option.value}
            value={option.value}
            disabled={disabledOptions ? disabledOptions.some(value => value == option.value) : false}
          >
            {option.label}
          </MenuItem>
        ))
      ) : (
        <MenuItem disabled sx={{ opacity: '1 !important' }} key={'NA'} value={'NA'}>
          No data found
        </MenuItem>
      )}
    </Select>
  );
};

export default SingleSelect;
