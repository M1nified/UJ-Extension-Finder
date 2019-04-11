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

    componentWillReceiveProps({ open }) {
        console.log(open)
        this.setState({ open })
    }

    handleCancel() {
        this.setState({
            open: false,
            extension: null
        })
    }

    handleSubmit() {

    }

    render() {
        const isAdd = !this.extension || !this.extension.hasOwnProperty('extension');
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
                    />
                    <TextField
                        margin="dense"
                        id="edit_dialog-description"
                        label="Description"
                        type="textarea"
                        fullWidth
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
