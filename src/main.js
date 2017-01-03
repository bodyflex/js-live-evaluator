import React from 'react';
import ReactDOM from 'react-dom';
import AceEditor from 'react-ace';
import Inspector from 'react-inspector';
import 'brace/theme/chrome';
import 'brace/mode/javascript';

class Container extends React.Component {
  constructor() {
    super();
    this.state = {code: localStorage.getItem('code') || '', values: [], libraryUrl: localStorage.getItem('libraryUrl') || ''};
    const that = this;
    window.log = function() {
      that.addValue(arguments);
    };
  }
  addValue(value) {
    const timestamp = Date.now();
    this.setState({baseTime: timestamp, values: this.state.values.concat({value, timestamp})});
  }
  onChange(value) {
    localStorage.setItem('code', value);
    this.setState({code: value, values: []});
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      try {
        value = eval(value);
        if (value instanceof Promise) {
          value.then(v => this.addValue(v)).catch(e => this.addValue(e.message));
        } else {
          this.addValue(value);
        }
      } catch (e) {
        console.error(e);
        this.addValue(e.message);
      }
    }, 100);
  }
  setLibrary(url) {
    this.setState({libraryUrl: url});
    localStorage.setItem('libraryUrl', url);
    const scriptTag = document.createElement('script');
    scriptTag.setAttribute('src', url);
    scriptTag.onload = () => this.onChange(this.state.code);
    document.body.appendChild(scriptTag);
  }
  componentDidMount() {
    this.onChange(this.state.code);
    this.setLibrary(this.state.libraryUrl);
  }
  render() {
    return (
      <div>
        <input
          id="cdn-input"
          onChange={e => this.setLibrary(e.target.value)}
          value={this.state.libraryUrl}
          placeholder="URL to external library" />
        <div id="content">
          <AceEditor
            name="editor"
            mode="javascript"
            theme="chrome"
            value={this.state.code}
            onChange={this.onChange.bind(this)} />
          <div id="inspector">
            {this.state.values.map((value, i) =>
            <div className="inspector-item">
              <Inspector key={i} data={value.value} />
              <span>-{(this.state.baseTime - value.timestamp) / 1000} s</span>
            </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Container />, document.getElementById('root'));
