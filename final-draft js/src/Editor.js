import React, { Component } from 'react';
import { convertToRaw, EditorState, RichUtils } from 'draft-js';
import Editor from 'draft-js-plugins-editor';

import createEmojiPlugin from 'draft-js-emoji-plugin';
import 'draft-js-emoji-plugin/lib/plugin.css';

import createInlineToolbarPlugin from 'draft-js-inline-toolbar-plugin';
import 'draft-js-inline-toolbar-plugin/lib/plugin.css';

import createSideToolbarPlugin from 'draft-js-side-toolbar-plugin';
import 'draft-js-side-toolbar-plugin/lib/plugin.css';

import createLinkifyPlugin from 'draft-js-linkify-plugin';
import 'draft-js-linkify-plugin/lib/plugin.css';

import createMentionPlugin, { defaultSuggestionsFilter } from 'draft-js-mention-plugin';
import 'draft-js-mention-plugin/lib/plugin.css';

import mentions from './mentions';

import createMarkdownPlugin from 'draft-js-markdown-plugin';

import createPrismPlugin from 'draft-js-prism-plugin';
import Prism from 'prismjs';
import 'prismjs/themes/prism-solarizedlight.css';
import './Editor.css'
import './Variable.css'

//import createImagePlugin from 'draft-js-image-plugin';

//--------------------------------------
import 'font-awesome/css/font-awesome.min.css';
import createRichButtonsPlugin from 'draft-js-richbuttons-plugin';
const richButtonsPlugin = createRichButtonsPlugin();
/* import only the ones you need; all available shown */
const {    
    // inline buttons
    ItalicButton, BoldButton, MonospaceButton, UnderlineButton,
    // block buttons
    ParagraphButton, BlockquoteButton, CodeButton, OLButton, ULButton, H1Button, H2Button, H3Button, H4Button, H5Button, H6Button
  } = richButtonsPlugin;
//------------------------------------------
/*
  Stateless component for inline style buttons, using the passed props as well as a custom prop "iconName"
*/
const MyIconButton = ({iconName, toggleInlineStyle, isActive, label, inlineStyle, onMouseDown, title}) =>
  <button onClick={toggleInlineStyle} onMouseDown={onMouseDown}>
    <span
      className={`fa fa-${iconName}`}
      title={title ? title : label}
      style={{ color: isActive ? '#000' : '#777' }}
    />
  </button>;
//-------------------------------------------

//const imagePlugin = createImagePlugin();

// emoji plugin
const emojiPlugin = createEmojiPlugin();
const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

// inline toolbar plugin
const inlineToolbarPlugin = createInlineToolbarPlugin();
const { InlineToolbar } = inlineToolbarPlugin;

// side toolbar plugin
const sideToolbarPlugin = createSideToolbarPlugin();
const { SideToolbar } = sideToolbarPlugin;

// link plugin
const linkPlugin = createLinkifyPlugin({ target: '_blank' });

// mention plugin
const mentionPlugin = createMentionPlugin();
const { MentionSuggestions } = mentionPlugin;


const features = {
    inline: ['BOLD', 'ITALIC', 'CODE', 'STRIKETHROUGH', 'LINK', 'IMAGE'],
    block: ['CODE', 'header-one', 'header-two', 'header-three', 'header-four', 'header-five', 'header-six', 'ordered-list-item', 'unordered-list-item', 'blockquote'],
};

const markDownPlugin = createMarkdownPlugin({ features });
const prismPlugin = createPrismPlugin({ prism: Prism });

class MyEditor extends Component {

    constructor(props) {
        super(props);
        this.state = {editorState: EditorState.createEmpty(), suggestions: mentions};
        this.onChange = (editorState) => this.setState({editorState, data: "{ Fetch content state }"});
    }

    onSearchChange = ({ value }) => {
        this.setState({
            suggestions: defaultSuggestionsFilter(value, mentions),
        });
    };


    onAddMention = () => {
    };

    handleKeyCommand = ( command, editorState ) => {
        let newState;
        newState = RichUtils.handleKeyCommand( editorState, command );
        if( newState ) {
            this.onChange(newState);
            return "handled"
        }
        return 'non-handled'
    };

    getContentStateInJSON = () => {
        const rawJson = convertToRaw( this.state.editorState.getCurrentContent() );
        const jsonStr = JSON.stringify(rawJson, null, 1);

        this.setState({ data: jsonStr });

    };

    styleMap = {
        'STRIKETHROUGH': {
            color: "#999"
        }, 'CODE': {
            backgroundColor: '#345678',
            color: "#fff",
            fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
            fontSize: 16,
            padding: 2
        }
    };

    myBlockStyleFn = ( contentBlock ) => {

        switch (contentBlock.getType()) {
            case 'code-block': return 'language-javascript';
            case 'atomic': return 'atomic';
            default: return null;
        }
    };

    render() {
        return (
            <div className={"editor"} >
            
                <div className="myToolbar" style={{ border: "1px solid #ddd", padding: "10px"}}>
                    <BoldButton>
                        <MyIconButton iconName="bold"/>
                    </BoldButton>
                    <ItalicButton>
                        <MyIconButton iconName="italic"/>
                    </ItalicButton><UnderlineButton/><MonospaceButton/>
                    <ULButton/><OLButton/>
                    <ParagraphButton/><BlockquoteButton/><CodeButton/>
                    <H1Button/><H2Button/><H3Button/><H4Button/><H5Button/><H6Button/>
                    <EmojiSelect />
                </div>
                <div style={{ padding: "10px", border: "1px solid #ddd"}}>
                    <Editor
                        editorState={ this.state.editorState }
                        onChange={ this.onChange }
                        plugins={[emojiPlugin,inlineToolbarPlugin, richButtonsPlugin, sideToolbarPlugin, linkPlugin, mentionPlugin, markDownPlugin, prismPlugin ]}
                        handleKeyCommand={ this.handleKeyCommand }
                        customStyleMap={this.styleMap }
                        blockStyleFn={ this.myBlockStyleFn }
                    />
                    <InlineToolbar />
                    <SideToolbar />
                    <EmojiSuggestions />
                    <MentionSuggestions
                        onSearchChange= { this.onSearchChange }
                        suggestions= { this.state.suggestions }
                        onAddMention= { this.onAddMention }
                    />
                </div>
            </div>
        );
    }
}

export default MyEditor;