import React from 'react';
import MarkdownIt from 'markdown-it'
import MdEditor from 'react-markdown-editor-lite'
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt(/* Markdown-it options */);

class MainPage extends React.Component {

    constructor(props) {
        super(props);
    }

    handleEditorChange({html, text}) {    
        console.log('handleEditorChange', html, text)
    }

    render() {
        return (
            <div className="mainpage">
                <MdEditor
                    value=""
                    renderHTML={(text) => mdParser.render(text)}
                    onChange={handleEditorChange}
                />
            </div>
        );
      };
    
}


function handleEditorChange({html, text}) {    
    console.log('handleEditorChange', html, text)
}


export default MainPage;