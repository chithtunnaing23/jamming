import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
    searchResults: [],
    playlistName: 'New playlist',
    playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if(this.state.playlistTracks.find((item) => (item.id === track.id))) return;
    const newList = this.state.playlistTracks;
    newList.push(track);
    this.setState({playlistTracks: newList});
  }

  removeTrack(track) {
    const newList = this.state.playlistTracks.filter((item) => {
      return(item.id !== track.id)
    });
    this.setState({playlistTracks: newList});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist(){
    const trackURIArray = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIArray)
  }

  search(term){
    Spotify.search(term)
    .then(tracks => {
      this.setState({searchResults: tracks});
    })
    .catch(error => {
      console.log(error)
    })
  }

  render(){
      return (
        <div>
          <h1>Ja<span className="highlight">mmm</span>ing</h1>
          <div className="App">
            <SearchBar onSearch={this.search}/>
            <div className="App-playlist">
              <SearchResults searchResults = {this.state.searchResults} onAdd={this.addTrack}/>
              <Playlist 
                playlistName={this.state.playlistName} 
                playlistTracks={this.state.playlistTracks} 
                onRemove={this.removeTrack}
                onNameChange={this.updatePlaylistName}
                onSave={this.savePlaylist}
              />
            </div>
          </div>
        </div>
      );
  }

}

export default App;
