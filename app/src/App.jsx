import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Api from './Api'

import {
  Paper,
  Grid,
  TextField,
  Typography,
  Fab,
  AddAction
} from '@material-ui/core'

import AddIcon from '@material-ui/icons/Add';

import ExtensionElement from './components/ExtensionElement';
import ExtensionDialog from './components/ExtensionDialog';

class App extends Component {

  constructor() {
    super()

    this.state = {
      extensions: [],
      filter: '',
      extensionToEdit: null
    }

    this.handleFilter = this.handleFilter.bind(this)
    this.handleAdd = this.handleAdd.bind(this)
    this.handleExtensionSave = this.handleExtensionSave.bind(this)

  }

  async componentDidMount() {
    const extensions = await Api.extension().findByName('');
    this.setState({
      extensions
    })
  }

  handleFilter(evt) {
    const filter = evt.target.value
    this.setState({
      filter
    })
  }

  handleAdd(evt) {
    this.setState({
      extensionToEdit: {}
    })
  }

  handleExtensionSave(evt) {

  }

  render() {
    const filterRegExp = new RegExp(`^${this.state.filter}.*$`, 'i')
    const extensions = this.state.extensions
      .filter(({ extension }) => filterRegExp.test(extension))
      .map((ext, id) => <Grid item xs={3} key={ext.id}>
        <ExtensionElement extension={ext} />
      </Grid>
      )
    return (
      <div className="App">
        <Paper className="paper-main">
          <Typography variant="h4" component="h2">
            Filter extensions
          </Typography>
          <TextField fullWidth label="Filer" value={this.state.filter} onChange={this.handleFilter}></TextField>
        </Paper>
        <Paper className="paper-main">
          <Grid container spacing={24}>
            {extensions}
          </Grid>
        </Paper>
        <Fab color="secondary" style={{ position: 'fixed', bottom: '1em', right: '1em' }} onClick={this.handleAdd}>
          <AddIcon />
        </Fab>
        <ExtensionDialog extension={this.state.extensionToEdit} onSave={this.handleExtensionSave} open={!!this.state.extensionToEdit} />
      </div>
    );
  }
}

export default App;
