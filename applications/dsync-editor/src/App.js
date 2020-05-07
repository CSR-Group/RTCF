import React from 'react';
import './App.css';
import MainPage from './component/MainPage.js'
import { Button, Grid, Input, Segment, Header, Icon } from 'semantic-ui-react'
import {createReplicatedObject, getReplicatedObject} from 'dsynk';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.sessionId = ""; 
  }


  handleStateChange(app) {
    app.setState(state => ({
      'object': state.object,
      'sessionid' : this.sessionId 
    }));  
  }

  createNewSession() {

    //console.log("Creating new session");

    createReplicatedObject("dsynk.io:9090",          
    {
        "document": {"type": "str", "value":"Hello world"}, 
        "textarea": {"type": "doc", "value":"Hello world"}
    }, () => this.handleStateChange(this))
    .then(session => {
      this.setState(state => ({
        'object': session[0],
        'sessionid' : session[1] 
      }));
      //console.log("Replicated Object Created" + session);
    }); 
  }

  joinSession() {
    getReplicatedObject("dsynk.io:9090", this.sessionId, () => this.handleStateChange(this))
    .then(session => {
      this.setState(state => ({
        'object': session,
        'sessionid' : this.sessionId 
      }));
    });
  }

  render() {

    //console.log("render called on app");

    if(this.state.sessionid == undefined) {
      return (
        <div className="App">
          <div className="App-header">
            <div className="row">
                <div className="column">
                  <div className="ui text container inverted segment ">
                    <Grid verticalAlign='middle' columns={1} centered>
                      <Grid.Row>
                        <Header inverted as='h1' icon textAlign='center' color='violet'>
                          {/* <Icon name='users' circular /> */}
                          <Header.Content>Dsynk Editor</Header.Content>
                        </Header>
                      </Grid.Row>
                      <Grid.Row>
                        <Button onClick={() => this.createNewSession()}>Create New Session</Button>
                      </Grid.Row>
                      <Grid.Row>
                        <Segment inverted>
                          <Input inverted 
                                 action={{ content: 'Join',  onClick: () => this.joinSession()}} 
                                 placeholder='Session id...' 
                                 onChange={e => this.sessionId = e.target.value }/>
                        </Segment>
                      </Grid.Row>
                    </Grid>
                  </div>
                </div>
            </div>          
          </div>
        </div>
      );
    } else {
      return (

        <div className="App">
          <MainPage state={this.state}/>
        </div>
      );
    }
  }

}

export default App;
