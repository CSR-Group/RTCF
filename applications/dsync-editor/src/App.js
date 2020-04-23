import React from 'react';
import './App.css';
import MainPage from './component/MainPage.js'
import { Button, Grid, Input, Segment, Header, Icon } from 'semantic-ui-react'
import {createSession} from 'dsynk';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  createNewSession() {

    console.log("Creating new seesion");

    createSession("127.0.0.1:9090")
    .then(sessionInfo => {
        console.log("Got session ",sessionInfo);
        this.setState(state => ({
          'id': sessionInfo.id,
          'topic': sessionInfo.topic
        }));
        console.log("Sesssion created");
    });
  }

  render() {

    console.log("render called on app");

    if(this.state.id == undefined) {
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
                          <Input inverted action='Join' placeholder='Session id...' />
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
