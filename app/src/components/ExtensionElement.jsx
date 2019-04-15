import React from 'react'
import {
    Card,
    CardContent,
    CardHeader,
    CardActions,
    CardActionArea,
    IconButton,
    Button
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';

export default class ExtensionElement extends React.Component {

    constructor({ extension, onEditBtn, onDeleteBtn }) {
        super()

        this.state = {
            extensionObject: extension,
            ...extension,
            onEditBtn,
            onDeleteBtn
        }

        // console.log(this.state)

        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);

    }

    componentWillReceiveProps({ extension }) {
        this.setState({ ...extension, extensionObject: extension });
    }

    handleDelete() {
        console.log('delete')
        this.state.onDeleteBtn(this.state.id)
    }

    handleEdit() {
        console.log('edit')
        this.state.onEditBtn(this.state.extensionObject)
    }

    render() {
        return (
            <Card style={{ minHeight: "220px" }}>
                <CardActionArea>
                    <CardHeader title={this.state.extension} />
                    <CardContent>
                        {this.state.description || " "}
                    </CardContent>
                </CardActionArea>
                <CardActions className="extension-btns">
                    <Button variant="contained" color="secondary" onClick={this.handleDelete} >
                        Delete
                        {/* <DeleteIcon style={{ marginLeft: "0.1em" }} /> */}
                    </Button>
                    <Button variant="contained" onClick={this.handleEdit} >
                        Edit
                        {/* <DeleteIcon style={{ marginLeft: "0.1em" }} /> */}
                    </Button>
                </CardActions>
            </Card >
        )
    }
}
