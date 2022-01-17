import React from 'react';
import './Track.css';

class Track extends React.Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(){
        if(this.props.isRemoval){
            this.props.onRemove(this.props.track);
        } else{
            this.props.onAdd(this.props.track);
        }
        
    }
    render(){
        return (
            <div className="Track">
                <div className="Track-information">
                    <h3>{this.props.track.name}</h3>
                    <p>{this.props.track.artist} | {this.props.track.album}</p>
                </div>
                <button className="Track-action" onClick={this.handleClick}>{this.props.isRemoval? '−' : '+'}</button>
            </div>
        )
    }

}

export default Track
