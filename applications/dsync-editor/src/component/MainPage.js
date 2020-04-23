import React from 'react';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';
import { Menu, Header, Segment, Container } from 'semantic-ui-react'
import "./MainPage.css"
import { joinSession, getSession, sendEvent } from 'dsynk';


const mdParser = new MarkdownIt(/* Markdown-it options */);

class MainPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            text : ""
        };
    }

    componentDidMount() {
        this.joinEditingSession();
    }

    joinEditingSession() {

        console.log("Joining editing session :" + this.props.state.id);

        if(this.props.state.topic == undefined) {
            getSession("127.0.0.1:9090", this.props.state.id)
            .then((sessionInfo) => {this.props.state.topic = sessionInfo.topic});
        }

        joinSession(this.props.state.topic, (message) => {
            console.log("message : ", message);
            this.setState((state) => message);
        });
    }

    handleEditorChange({html, text}) {    
        console.log('handleEditorChange', html, text);
    }

    handleDsynkClick() {
        console.log('handleDsynkClick');
    }

    handleEditorChange({html, text}) {
        // console.log('handleEditorChange', html, text)\
        sendEvent(this.state.id, text);
    }

    render() {

        return (
            <div className="mainpage">
                <Menu>
                    <Menu.Item header>
                        <Header as='h1' color='violet'>
                                {/* <Icon name='users' circular /> */}
                                <Header.Content>Dsynk Editor</Header.Content>
                        </Header>
                    </Menu.Item>
                    <Menu.Item
                        name='session-name'>
                        {this.state.id}
                    </Menu.Item>
                </Menu>

                <div className="editor">
                    <MdEditor
                        value={this.text}
                        renderHTML={(text) => mdParser.render(text)}
                        onChange={(change) => this.handleEditorChange(change)}
                        config={{
                            view: {
                              menu: true,
                              md: true,
                              html: true,
                              fullScreen: true,
                              hideMenu: true,
                            },
                            table: {
                              maxRow: 6,
                              maxCol: 6,
                            },
                            syncScrollMode: ['leftFollowRight', 'rightFollowLeft'],
                          }}              
                    />
                </div>
            </div>
        );
      };
    
}


export default MainPage;