import React from 'react'
import { Card, CardContent, CardHeader, CardActions } from '@material-ui/core';

export default class ExtensionElement extends React.Component {

    constructor({ extension }) {
        super()

        this.state = {
            ...extension
        }

        // console.log(this.state)

    }

    render() {
        return (
            <Card style={{ minHeight: "200px" }}>
                <CardHeader title={this.state.extension} />
                <CardContent>
                    {this.state.description}
                </CardContent>
                <CardActions>

                </CardActions>
            </Card >
        )
    }
}
