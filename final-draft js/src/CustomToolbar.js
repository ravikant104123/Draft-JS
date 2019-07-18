import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RichUtils } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';

import './Xyz.css';

class CustomOption extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    editorState: PropTypes.object,
  };

  toggleBold = () => {
    const { editorState, onChange } = this.props;
    const newState = RichUtils.toggleInlineStyle(
      editorState,
      'BOLD',
    );
    if (newState) {
      onChange(newState);
    }
  };

  render() {
    return (
      <div className="rdw-storybook-custom-option" onClick={this.toggleBold}>B</div>
    );
  }
}

const CustomToolbar = () =>
  (<div className="rdw-storybook-root">
    <h3>Last option marked as B is custom option for making test BOLD.</h3>
    <Editor
      toolbarClassName="rdw-storybook-toolbar"
      wrapperClassName="rdw-storybook-wrapper"
      editorClassName="rdw-storybook-editor"
      toolbarCustomButtons={[<CustomOption />]}
    />
  </div>);

export default CustomToolbar;