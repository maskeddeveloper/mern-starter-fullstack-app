import React, { Component } from 'react';
import axios from "axios";
class App extends Component {
  // initialize our state 
  state = {
    data: [],
    id: 0,
    message: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has 
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever 
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object 
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify 
  // data base entries

  // our first get method that uses our backend api to 
  // fetch data from our data base
  getDataFromDb = () => {
    fetch("http://localhost:3001/api/getData")
      .then(data => data.json())
      .then(res => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  putDataToDB = message => {
    let currentIds = this.state.data.map(data => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post("http://localhost:3001/api/putData", {
      id: idToBeAdded,
      message: message
    });
  };


  // our delete method that uses our backend api 
  // to remove existing database information
  deleteFromDB = idTodelete => {
    let objIdToDelete = null;
    this.state.data.forEach(dat => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete("http://localhost:3001/api/deleteData", {
      data: {
        id: objIdToDelete
      }
    });
  };


  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    this.state.data.forEach(dat => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post("http://localhost:3001/api/updateData", {
      id: objIdToUpdate,
      update: { message: updateToApply }
    });
  };


  // here is our UI
  // it is easy to understand their functions when you 
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <div className="container" style={{marginTop: '5%'}}>
        <ul className="list-group" style={marginElements}>
          {data.length <= 0
            ? <small  style={marginElements} id="emailHelp" class="form-text text-muted">NO DB ENTRIES YET</small>
            : data.map(dat => (
              <li className="list-group-item" key={data.message}>
                <span className="list-group-item"> id: </span> {dat.id} <br />
                <span className="list-group-item"> data: </span>
                {dat.message}
              </li>
            ))}
        </ul>
        <div className="form-group">
          <input
           style = {marginElements}
            type="text"
            onChange={e => this.setState({ message: e.target.value })}
            placeholder="add something in the database"
            className="form-control"
          />
          <button className="btn btn-primary" onClick={() => this.putDataToDB(this.state.message)}>
            ADD
            </button>
        </div>
        <div className="form-group">
          <input
            type="text"
            style = {marginElements}
            className="form-control"
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button className="btn btn-primary" onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
            </button>
        </div>
        <div className="form-group" >
          <input
            type="text"
            style = {marginElements}
            className="form-control"
            onChange={e => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style = {marginElements}
            className="form-control"
            onChange={e => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button className="btn btn-primary"
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
            </button>
        </div>
      </div>
    );
  }
}
const marginElements = {
  marginBottom: '10px',
};
export default App;
