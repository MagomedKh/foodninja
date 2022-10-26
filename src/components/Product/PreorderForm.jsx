import React, {useState, forwardRef} from 'react';
import { Box, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import TextField from '@mui/material/TextField';
import ru from "date-fns/locale/ru";
import {isToday, eachHourOfInterval, getHours, setHours, format, compareAsc, add} from 'date-fns'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const PreorderForm = forwardRef(({preorderDate, preorderTime, handlePreorderDateChange, handlePreorderTimeChange}) => {

    const hoursArray = eachHourOfInterval({start: setHours(new Date(), 9),end: setHours(new Date(), 21)})

    const [open, setOpen] = useState(false)

    return (
        <Box sx={{mr: 2, display: "flex"}}>
            
            <LocalizationProvider dateAdapter={AdapterDateFns} locale={ru} >
                <DatePicker
                    disablePast
                    label="Выберите дату"
                    disableMaskedInput
                    inputFormat='dd MMM yyyy'
                    renderInput={(params) => <TextField 
                        {...params} 
                        inputProps={{
                            ...params.inputProps,
                            readOnly: true,
                            placeholder: "дд.мм.гггг"
                        }}
                        onClick={() => setOpen(true)}
                    />}
                    PaperProps={{
                        sx: {
                            "& .MuiPickersDay-root": {
                              "&.Mui-selected": {
                                backgroundColor: "primary.main",
                              },
                            },
                    }}}
                    value={preorderDate}
                    onChange={(newDate) => {
                        handlePreorderDateChange(newDate);
                    }}
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    shouldDisableDate={(date)=>{
                        if (isToday(date)) {return true}
                        if (compareAsc(date, add((new Date()),{days: 30})) == 1) {
                            return true
                        }
                    }}
                />
            </LocalizationProvider>
            <FormControl sx={{ minWidth: 120, ml: 1}}>
                <InputLabel id="preorder-time-select-label">Время</InputLabel>
                <Select 
                    label="Время"
                    labelId="preorder-time-select-label"
                    id="preorder-time-select" 
                    value={preorderTime? preorderTime : ""}
                    onChange={(e) => {
                        handlePreorderTimeChange(e.target.value);
                    }}
                    autoWidth
                    >
                        {hoursArray.map((el)=><MenuItem key={el.getHours()} value={el.getHours()}>{format(el,"k:mm")}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    )
})

export default PreorderForm