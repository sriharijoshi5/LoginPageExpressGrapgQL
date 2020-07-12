import React, { Component  } from 'react';
import './Files.css'
class FilesPage extends Component{
    render(){
        return <div className="events-control">
            <p>Add your own Files!</p>
            <button className="btn">
                Upload File
            </button>
        </div>
    }
}

export default FilesPage;