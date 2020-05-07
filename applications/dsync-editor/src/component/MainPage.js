import React from 'react';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';
import { Menu, Header, Segment, Container } from 'semantic-ui-react'
import "./MainPage.css"
// import { joinSession, getSession, sendEvent } from 'dsynk';


const mdParser = new MarkdownIt(/* Markdown-it options */);

class MainPage extends React.Component {

    getTextFromMap(object) {

        try {
            // return object.get("document"); 
            // return object.get("textarea")[0];

            console.log(object.get("textarea"));
            var currentState = object.get("textarea"); 
            var lineKeys = Object.keys(currentState).sort();
    
            var editorText = ""
            for(var i = 0; i < lineKeys.length; i++) {
                editorText = editorText + currentState[lineKeys[i]]
                if(i < lineKeys.length-1) {
                    editorText = editorText + "\n"
                }
            }
            return editorText;    

        } catch (e) {
            console.log(e.message)
            return "";
        }   
    }

    constructor(props) {
        super(props);
        console.log(props);        
        this.state = {
            sessionid: props.state.sessionid, 
            object: props.state.object,
        };
    }

    isNewInBetweenLine(currentState, previousState, prevLineKeys, prevIndex, currentIndex) {
        // return i+1 < currentState.length && prevLine == currentState[i+1];
        if(currentIndex+1 >= currentState.length || currentState.length !== prevLineKeys.length + 1) {
            return false; 
        }
        var i = currentIndex + 1;
        var j = prevIndex; 

        while(i < currentState.length && j < prevLineKeys.length) {
            if(currentState[i] !== previousState[prevLineKeys[j]]) {
                return false; 
            }
            i++; 
            j++;
        }
        return true; 
    }

    handleEditorChange({html, text}) {
        // console.log('handleEditorChange', html, text);
        this.state.object.set("document", text);

        var previousState = this.state.object.get("textarea"); 
        var currentState = text.split("\n"); 

        console.log("prevstate: ", previousState)
        console.log("currstate: ",currentState)
        var prevLineKeys = Object.keys(previousState).sort();
        console.log("prevLineKeys: ",prevLineKeys)

        var prevIndex = 0; 
        var i = 0; 
        // TODO : handle empty current doc 

        for(; i < currentState.length && prevIndex < prevLineKeys.length; i++) {

            var currLine = currentState[i]; 
            var prevLine = previousState[prevLineKeys[prevIndex]]; 

            console.log("currLine: ",currLine)
            console.log("prevLine: ",prevLine)
            
            if(currLine !== prevLine) {
            
                // new line in between two old lines
                if(this.isNewInBetweenLine(currentState, previousState, prevLineKeys, prevIndex, i)) {
                    this.state.object.set("textarea",currentState[i],(prevLineKeys[prevIndex-1] + prevLineKeys[prevIndex])/2.0);
                    console.log("new inbetween line detected");
                } 
                // line deleted 
                else if(prevIndex+1 < prevLineKeys.length && currLine === previousState[prevLineKeys[prevIndex+1]]) {
                    //to do 
                    console.log("delete inbetween line detected");
                    prevIndex+=2; 
                } else {
                    console.log("line change detected");
                    this.state.object.set("textarea",currLine,prevLineKeys[prevIndex]);
                    prevIndex++; 
                }
            } else {
                prevIndex++; 
            }
        }

        while(i < currentState.length) {
            console.log("new line detected");
            this.state.object.set("textarea",currentState[i],i++);
        }

        // var prevState = this.state.get("textarea"); 
        // for(var key in prevState)
    }

    render() {

        console.log("Rendering editor");
        console.log(this.state.object)
        var text = this.getTextFromMap(this.state.object)

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
                        {this.state.sessionid}
                    </Menu.Item>
                </Menu>

                <div className="editor">
                    <MdEditor
                        value={text}
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