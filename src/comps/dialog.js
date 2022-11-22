//imports
//react
import React, { useState, useEffect } from 'react';
//materials
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
//components
import DateTime from './dateTime';
import { TextField } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import toastr from "toastr";

//master export
export default function ResponsiveDialog(props) {
    //variables
    
    const [type] = useState(props.type) 
    
    let [rows] = useState(props.rowFromParent)

    const [deadline, setDeadLine] = useState(isEmpty(rows) || props.index === -1 ? new Date() : rows[props.index].deadline);

    const [title, setTitle] = useState(isEmpty(rows) || props.index === -1 ? "" : rows[props.index].title)

    const [description, setDescription] = useState(isEmpty(rows) || props.index === -1 ? "" : rows[props.index].description)

    const [priority, setPriority] = useState(isEmpty(rows) || props.index === -1 ? "low" : rows[props.index].priority)

    const [checked, setChecked] = useState(isEmpty(rows) || props.index === -1 ? false : rows[props.index].checked)

    const [titleHelperText, setTitleHelperText] = useState("");

    const [descriptionHelperText, setDescriptionHelperText] = useState("");

    const [isValidTitle, setIsValidTitle] = useState(true);

    const [isValidDescription, setIsValidDescription] = useState(true);

    function isEmpty(obj) {
        return !obj || obj.length === 0 || Object.keys(obj).length === 0;
    }

    //cancel
    let cancel = () => {
        props.parentCallback({
            action: 'cancel',
            data: {}
        });
        setIsValidDescription(true);
        setIsValidTitle(true);
        setTitleHelperText("");
        setDescriptionHelperText("");
    };

    let submitAdd = () => {
        if (isValidForm()) {
            props.parentCallback({
                action: 'submit',
                data: { title: title, description: description, deadline: deadline, priority: priority, checked: checked, setChecked: setChecked }
            });
        }
    };

    let submitEdit = () => {
        if (checkDescription()) {
            props.parentCallback({
                action: 'edit',
                data: { title: title, description: description, deadline: deadline, priority: priority, checked: checked, setChecked: setChecked },
                index: props.index
            });
        }
    };

    let isValidForm = () => {
        const validTitle = checkTitle();
        const validDescription = checkDescription();

        return validTitle && validDescription;
    }

    let checkTitle = () => {
        if (title === "") {
            setIsValidTitle(false);
            setTitleHelperText("Title is required!");
            toastr.error(`Title is empty!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
            return false;
        }

        if (rows.filter(row => row.title === title).length > 0) {
            setIsValidTitle(false);
            setTitleHelperText("Title already exists!");
            toastr.error(`Title must be unique!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
            return false;
        }

        setIsValidTitle(true);
        setTitleHelperText("");
        return true;
    }

    let checkDescription = () => {
        if (description === "") {
            setIsValidDescription(false);
            setDescriptionHelperText("Description is required!");
            toastr.error(`Description is empty!`, ``, {'closeButton': true, positionClass: 'toast-bottom-right'});
            return false;
        }

        setIsValidDescription(true);
        setDescriptionHelperText("");
        return true;
    }


    //return master object
    return (
        <>
            {/*title*/}
            {type === "add" ? <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
                <i className="fa fa-fw fa-plus-circle"></i>Add Task
            </DialogTitle> : <DialogTitle sx={{ bgcolor: 'primary.dark', color: 'white' }}>
                <i className="fa fa-fw fa-edit"></i>Edit Task
            </DialogTitle>}
            {/*content*/}
            <DialogContent>
                <br /><br />
                {type === "add" ? 
                <TextField
                    fullWidth
                    error={!isValidTitle}
                    id="title"
                    label="Title"
                    helperText={titleHelperText}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                /> : null}

                <br /><br /><br />

                <TextField
                    fullWidth
                    error={!isValidDescription}
                    id="description"
                    label="Description"
                    helperText={descriptionHelperText}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                {/*deadline*/}
                <br /><br /><br />
                <DateTime dataFromParent={deadline} dataToParent={setDeadLine} />

                <br /><br /><br />

                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">Priority</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="priority"
                        name="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <FormControlLabel value="low" control={<Radio />} label="Low" />
                        <FormControlLabel value="med" control={<Radio />} label="Med" />
                        <FormControlLabel value="high" control={<Radio />} label="High" />
                    </RadioGroup>
                </FormControl>

            </DialogContent>
            {/*action buttons*/}
            <DialogActions sx={{ bgcolor: 'white' }}>
                {/*cancel button*/}
                {type === 'add' ? <Button onClick={submitAdd} variant="contained" sx={{ width: 100, marginRight: '7px' }}>
                    <i className="fa fa-fw fa-plus-circle"></i>Add
                </Button> : <Button onClick={submitEdit} variant="contained" sx={{ width: 100, marginRight: '7px' }}>
                    <i className="fa fa-fw fa-edit"></i>Edit
                </Button>}

                <Button onClick={cancel} variant="contained" color='error' sx={{ bgcolor: '#f44336', width: 100 }}>
                    <i className="fa fa-fw fa-ban"></i>&nbsp;Cancel
                </Button>
            </DialogActions>
        </>
    );
}