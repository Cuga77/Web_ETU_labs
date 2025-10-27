import React, {Component} from "react";
import "./app.header.css"

export default class App extends Component{
    returnToStartPage() {
        window.location.href = '/';
    }

    render(){
        return (
            <div className="header-tile">
                <button className="invisible-button" onClick={this.returnToStartPage}>
                    <div className="header-logo">
                        <p>Биржа акций</p>
                    </div>
                </button>
                <div style={{display: "flex"}}>
                <div className="header-small-elem">
                    <a href="/brokers" style={{textDecoration:"none"}}>Брокеры</a>
                </div>
                <div className="header-small-elem">
                    <a href="/stocks" style={{textDecoration:"none"}}>Акции</a>
                </div>
                <div className="header-small-elem">
                    <a href="/exchange" style={{textDecoration:"none"}}>Торги</a>
                </div>
                </div>
            </div>
        )
    }
}