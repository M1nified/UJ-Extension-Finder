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
    this.handleAddBtn = this.handleAddBtn.bind(this)
    this.handleEditBtn = this.handleEditBtn.bind(this)
    this.handleDeleteBtn = this.handleDeleteBtn.bind(this)
    this.handleExtensionSave = this.handleExtensionSave.bind(this)

    this.updateExtensionsFromServer = this.updateExtensionsFromServer.bind(this)

  }

  async componentDidMount() {
    return this.updateExtensionsFromServer();
  }

  async updateExtensionsFromServer() {
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

  handleAddBtn(evt) {
    this.setState({
      extensionToEdit: {}
    })
  }

  handleEditBtn(extension) {
    console.log(extension)
    this.setState({
      extensionToEdit: extension
    })
  }

  async handleDeleteBtn(extensionId) {
    console.log(extensionId)
    await Api.extension().remove(extensionId)
    await this.updateExtensionsFromServer()
  }

  async handleExtensionSave(extension) {
    console.log(extension)
    this.setState({ extensionToEdit: null })
    if (extension.id) {
      await Api.extension().update(extension)
    } else {
      await Api.extension().create(extension)
    }
    await this.updateExtensionsFromServer()
  }

  render() {
    const filterRegExp = new RegExp(`^${this.state.filter}.*$`, 'i')
    const extensions = this.state.extensions
      .filter(({ extension }) => filterRegExp.test(extension))
      .map((ext, id) => <Grid item xs={3} key={ext.id}>
        <ExtensionElement extension={ext} onEditBtn={this.handleEditBtn} onDeleteBtn={this.handleDeleteBtn} />
      </Grid>
      )
    return (
      <div className="App">
        <Paper className="paper-main">
          <Typography variant="h4" component="h2">
            Extension finder
          </Typography>
          <TextField fullWidth label="Filer" value={this.state.filter} onChange={this.handleFilter}></TextField>
        </Paper>
        <Paper className="paper-main">
          <Grid container spacing={24}>
            {extensions}
          </Grid>
        </Paper>
        <Fab color="secondary" style={{ position: 'fixed', bottom: '1em', right: '1em' }} onClick={this.handleAddBtn}>
          <AddIcon />
        </Fab>
        <ExtensionDialog extension={this.state.extensionToEdit} onSave={this.handleExtensionSave} open={!!this.state.extensionToEdit} />
      </div>
    );
  }
}

export default App;
