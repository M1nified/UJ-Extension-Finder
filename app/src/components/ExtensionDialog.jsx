import React from 'react'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Input,
    TextField
} from '@material-ui/core';

export default class ExtensionElement extends React.Component {

    constructor({ extension, onSave, open }) {
        super()

        this.state = {
            extension,
            onSave,
            open
        }

        // console.log(this.state)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

    }

    componentWillReceiveProps(props) {
        console.log(props)
        this.setState(props)
    }

    handleCancel() {
        this.setState({
            open: false,
            extension: null
        })
    }

    handleSubmit(evt) {
        // poor programming skillz shown below:
        const
            extension = document.querySelector("#edit_dialog-extension").value,
            description = document.querySelector("#edit_dialog-description").value
        this.state.onSave({ ...this.state.extension, extension, description })
        this.setState({
            open: false,
            extension: null
        })
    }

    render() {
        const isAdd = !this.state.extension || !this.state.extension.hasOwnProperty('extension');
        return (
            <Dialog open={this.state.open}>
                <DialogTitle>
                    {isAdd
                        ? "Add extension"
                        : "Edit extension"}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        label="Extension"
                        id="edit_dialog-extension"
                        type="text"
                        fullWidth
                        defaultValue={!isAdd ? this.state.extension.extension : ''}
                    />
                    <TextField
                        margin="dense"
                        id="edit_dialog-description"
                        label="Description"
                        type="textarea"
                        fullWidth
                        defaultValue={!isAdd ?this.state.extension.description : ''}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleCancel} color="primary">
                        {isAdd
                            ? "Cancel"
                            : "Discard"}
                    </Button>
                    <Button onClick={this.handleSubmit} color="primary">
                        {isAdd
                            ? "Add"
                            : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}