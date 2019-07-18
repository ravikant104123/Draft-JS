import React, { Component } from 'react';
import { EditorState } from 'draft-js';
import { convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import './Xyz.css';
import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
import mentions from './xyzmentions';

import embed from "embed-video";
import $ from "jquery";

function uploadImageCallBack(file) {
    return new Promise(
      (resolve, reject) => {
        const reader = new FileReader(); // eslint-disable-line no-undef
        reader.onload = e => resolve({ data: { link: e.target.result } });
        reader.onerror = e => reject(e);
        reader.readAsDataURL(file);
      });
  }

export default class Xyz extends Component {
  constructor(props) {
    super(props);
    this.editorState = EditorState.createEmpty()
  }
  state = {
    editorState: EditorState.createEmpty(),
    htmlText: "",
    sourceCode: ""
  }

  onEditorStateChange = (editorState) => { 
    let htmlText = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.setState({
      editorState,
      htmlText
    }); 
  };

  componentDidUpdate(){
    let length = document.getElementsByTagName('figure').length;
    if (length) {
        $(".public-DraftEditor-content figure")[length-1].style.float = "left"
        $(".public-DraftEditor-content figure")[length-1].style.display = "inline-block"
      }
    
    length = document.getElementsByTagName('iframe').length;
    if (length) {
      $(".public-DraftEditor-content iframe")[length-1].style.float = "left"
      $(".public-DraftEditor-content iframe")[length-1].style.display = "inline-block"
    }
  }
  
  render() {
    const { editorState } = this.state;
    return (
      <div className="editor-root">
        <Editor 
        spellCheck
        mention={{
            separator: ' ',
            trigger: '@',
            suggestions: mentions
            
          }}
          editorState={editorState}
          onEditorStateChange={this.onEditorStateChange}
          toolbar={{
            image: {
              alignmentEnabled: false,
              previewImage: true,
              uploadCallback: uploadImageCallBack,
            },
            link: {
                linkCallback: params => ({ ...params })
              },
              embedded: {
                embedCallback: link => {
                  const detectedSrc = /<iframe.*? src="(.*?)"/.exec(embed(link));
                  return (detectedSrc && detectedSrc[1]) || link;
                }                
              }
          }}
        />
        {<textarea //------------------HTML data------------------------//
          disabled
          value={this.state.htmlText}
        />}
      </div>
    );
  }
}