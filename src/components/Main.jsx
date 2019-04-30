import React, { Component } from 'react';
import {
  Person,
  getFile,
  putFile,
  lookupProfile
} from 'blockstack';

const uuidv4 = require('uuid/v4');

const avatarFallbackImage = 'https://s3.amazonaws.com/onename/avatar-placeholder.png';

export default class Main extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      userSession: this.props,
  	  person: {
  	  	name() {
          return 'Anonymous';
        },
  	  	avatarUrl() {
  	  	  return avatarFallbackImage;
  	  	},
  	  },
      username: "",
      newNote: "",
      notes: [],
      noteIndex: 0,
      isLoading: false
  	};
  }

  render() {
    const { handleSignOut } = this.props;
    const { person } = this.state;
    const { username } = this.state;

		 return (
			 !userSession.isSignInPending() && person ?
       <div>
				 <div className="site-wrapper-inner">
					 <div className="col-main col-main-profile">
             <div className="avatar-section">
               <img
                 src={ person.avatarUrl() ? person.avatarUrl() : avatarFallbackImage }
                 className="img-rounded avatar"
                 id="avatar-image"
               />
               <div className="username">
                 <h1>
                   <span id="heading-name">{ person.name() ? person.name()
                     : 'Nameless Person' }</span>
                 </h1>
                 <div>{username}</div>
                 <div className="btn btn-secondary btn-lg" onClick={ handleSignOut.bind(this) }>log out</div>
               </div>
             </div>
           </div>

					 <div className="col-main col-main-feed">
              <div className="col-md-12">
  							 <div className="new-note shadow">
    								 <div className="col-md-12">
    									 <textarea className="input-note"
    										 value={this.state.newNote}
    										 onChange={e => this.handleNewNoteChange(e)}
    										 placeholder="Where's your mind?"
    									 />
  									 <button
  										 className="btn btn-lg btn-light"
  										 onClick={e => this.handleNewNoteSubmit(e)}
  									 >
  										 Submit
  									 </button>
  								     </div>
							 </div>
             </div>

						 <div className="col-md-12 notes">
						 {this.state.isLoading && <span>Loading...</span>}
						 {this.state.notes.map((note) => (
                <div className="note shadow" key={note.id}>
                  <div className="btn-delete note-secondary" onClick={ this.handleDeleteNote.bind(this, note) }>X</div>
                  <div>
                    {note.text}
                  </div>
                  <div className="note-secondary note-date">
                    {new Date(note.created_at).toDateString()}
                  </div>
								</div>
              )
						 )}
             <div className="footer"></div>
						 </div>
					 </div>
				 </div>
			 </div> : null
		 );
	}


  handleNewNoteChange(event) {
    this.setState({newNote: event.target.value})
  }

  handleNewNoteSubmit(event) {
    if (this.state.newNote) {
      this.saveNewNote(this.state.newNote)
      this.setState({
        newNote: ""
      })
    }
  }

  handleDeleteNote(event) {
    let notes = this.state.notes

    const new_notes = notes.filter(el => el.id != event.id)

    const options = {encrypt: false}
    putFile('notes.json', JSON.stringify(new_notes), options)
      .then(() => {
        this.setState({
          notes: new_notes
        })
      })
  }

  saveNewNote(noteText) {
    let notes = this.state.notes

    let note = {
      id: uuidv4(),
      text: noteText.trim(),
      created_at: Date.now()
    }

    notes.unshift(note)
    const options = {encrypt: false}
    putFile('notes.json', JSON.stringify(notes), options)
      .then(() => {
        this.setState({
          notes: notes
        })
      })
  }

  fetchData() {
    this.setState({ isLoading: true })
		if (this.isLocal()) {
			const options = {decrypt: false}
			getFile('notes.json', options)
				.then((file) => {
					var notes = JSON.parse(file || '[]')
					this.setState({
						person: new Person(userSession.loadUserData().profile),
						username: userSession.loadUserData().username,
						noteIndex: notes.length,
						notes: notes,
					})
				})
				.finally(() => {
					this.setState({ isLoading: false })
      })
		} else {
			const username = this.props.match.params.username

			lookupProfile(username)
				.then((profile) => {
					this.setState({
						person: new Person(profile),
						username: username
					})
				})
				.catch((error) => {
					console.log('could not resolve profile')
				})
			const options = {username: username, decrypt: false}
			getFile('notes.json', options)
				.then((file) => {
					var notes = JSON.parse(file || '[]')
					this.setState({
						noteIndex: notes.length,
						notes: notes
					})
				})
				.catch((error) => {
					console.log('could not fetch notes')
				})
				.finally(() => {
					this.setState({ isLoading: false })
				})
		}
  }

	isLocal() {
		return this.props.match.params.username ? false : true
	}

  componentWillMount() {
    this.fetchData()
  }
}
