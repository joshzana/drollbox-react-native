/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var React = require('react-native');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  ListView,
  TouchableHighlight,
} = React;

var Dropbox = require("dropbox");

var DROPBOX_KEY = '<Insert API Key Here';
var DROPBOX_TOKEN = '<Insert User Token Here>';

var reactAuthDriver = {
  authType: function() { return "token"; },
  url: function() { return ""; },
  doAuthorize: function(authUrl, stateParm, client, callback) {
      // TODO: Implement driver that uses https://facebook.github.io/react-native/docs/webview.html#content
  }
};


var Drollbox = React.createClass({
  

  getInitialState: function() {
      return {
        dataSource: new ListView.DataSource({
          rowHasChanged: (row1, row2) => row1 != row2,
        }),
        client: new Dropbox.Client({ key : DROPBOX_KEY, token: DROPBOX_TOKEN }) ,
        loaded: false,
      };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function() {

    var that = this;

    this.state.client.authenticate(function(error, client) {

        client.readdir("", null, function(error, files, dirInfo, fileInfo) {
          if (error == null) {
            that.setState({
               fileInfo: fileInfo,
               dataSource: that.state.dataSource.cloneWithRows(fileInfo),
               loaded:true,
             });
          }
        });
    });
  },

  render: function() {

    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <ListView
        dataSource={this.state.dataSource}
        renderRow={this.renderFile}
        style={styles.listView} />
    );
  },

  renderLoadingView : function() {
    return (
      <View style={styles.loading}>
        <Text>
          Loading Files...
        </Text>
      </View>
      );
  },

  renderFile: function(file) {
    var imageObj = file.hasThumbnail ? 
        {uri : this.state.client.thumbnailUrl(file.path, {size:"m"})} :
        require('image!Folder');

    return (
      <TouchableHighlight onPress={() => this.pressRow(file)} underlayColor="#F5FCFF">
        <View bckgroundColor="#F5FCFF">
          <View style={styles.container}>
            <Image source={ imageObj } style={styles.thumbnail}/>
            <View style={styles.textContainer}>
              <Text style={styles.name}>{file.name}</Text>
            </View>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  },

  pressRow: function(file) {

    // TODO: Implement ImageDetailsView
    this.props.navigator.push({
      title: 'Image',
      component: ImageDetailsView,
      passProps: {fileInfo: file}
    });
  }
});

var styles = StyleSheet.create({
  loading: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F5FCFF',
    padding: 10
  },
  textContainer: {
    flex: 1,
    // TODO: Why won't this vertically center its children?
  },
  thumbnail: {
    width: 64,
    height: 64,
  },
  name: {
    flex :1,
    fontSize: 14,
    marginLeft: 20,
    textAlign: 'left',
  },
  listView: {
    paddingTop: 20,
    backgroundColor: '#F5FCFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  } 
});

AppRegistry.registerComponent('Drollbox', () => Drollbox);
