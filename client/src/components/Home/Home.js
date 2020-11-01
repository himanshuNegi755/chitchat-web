import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { InputGroup, FormControl } from 'react-bootstrap';

import './Home.css';
import NavBar from '../NavBar/NavBar';

const Home = ({ user }) => {
  const [rooms, setRooms] = useState([]); //rooms as per user follow interests
  const [interests, setInterests] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);
  const [allRoomsList, setAllRoomsList] = useState([]); //all rooms
  const [suggestions, setSuggestions] = useState([]);
  const [roomTitle, setRoomTitle] = useState(''); //for searching titles
  const [showSearchBar, setShowSearchBar] = useState('hidden'); //for searching titles

  const suggestionRef = useRef(null);

  useEffect(() => {
    if(user) {
      axios.get(`${process.env.REACT_APP_BACKEND_API}/user-interests/${user.userEmail}`)
      .then(res => { setInterests(res.data) })
    } else if(user === false) {setLoggedIn(false)}
  }, [user]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_API}/room`, {
      params: { interests: interests }
    })
    .then(res => { setRooms(res.data)
                 setShowSearchBar('visible')})

  }, [interests]);
  
  const entryValidation = (e, members, roomId) => {
    if(!user.userName) {
      alert('Please First create user name in profile');
      e.preventDefault()
    } else if (members >= 2) {
      alert('Room Already full, pls try another room');
      e.preventDefault();
    } else {
      e.persist();
      axios.get(`${process.env.REACT_APP_BACKEND_API}/room-with-id/${roomId}`)
      .then(res => {
        if(res.data.length === 0) {
          alert("Room doesn't exist anymore, pls refrest the page for latest room");
          //e.persist();
        }
      })
    }
  }

  const roomsList = () => {
    const list = rooms.map((item) =>
      <div key={item._id} className='groups'>
        <Link onClick={e => entryValidation(e, item.members, item._id)} to={`/chat?room=${item.title}&roomId=${item._id}`} className='linkR-div'>
          <div className='row row-one'>
            <div className='col-8 room-name'><p>{item.title}</p></div>
            <div className='col-4 language-name'><p><span className="lang-span">Language: </span>{item.language}</p></div>
          </div>
          <div className='row row-two'>
            <div className='col-5 access-status'><p>{item.category}</p></div>
            <div className='col-3 members-no'><p><i class="fas fa-users"></i> {item.members}/10</p></div>
            <div className='col-4 time-div'><p>{moment(item.created).fromNow()}</p></div>
          </div>
        </Link>
      </div>
    );

    return (list);
  }

  //autocomplete functions
  const onTextChanged = (e) => {
    document.addEventListener('mousedown', handleClickOutside);
    const value = e.target.value;
    
    axios.get(`${process.env.REACT_APP_BACKEND_API}/all-rooms`)
    .then(res => { setAllRoomsList(res.data)})
    
    let suggestions = [];
    if (value.length > 0) {
      suggestions = allRoomsList.filter(v => (v.title).toLowerCase().includes(value.toLowerCase()));
    }
    setSuggestions(suggestions);
    setRoomTitle(value);
  }

  const renderSuggestions = () => {
    if(suggestions.length === 0) {
      return null;
    }

    const list = suggestions.map((item) =>
      <div key={item._id} className='groups'>
        <Link onClick={e => {entryValidation(e, item.members)}} to={`/chat?room=${item.title}&roomId=${item._id}`} className='linkR-div'>
          <div className='row row-one'>
            <div className='col-8 room-name'><p>{item.title}</p></div>
            <div className='col-4 language-name'><p><span className="lang-span">Language: </span>{item.language}</p></div>
          </div>
          <div className='row row-two'>
            <div className='col-lg-4 col-md-3 genre-status'><p>{item.category}</p></div>
            <div className='col-lg-4 col-md-4 members-no'><p><i class="fas fa-users"></i> {item.members}/10</p></div>
            <div className='col-lg-4 col-md-5 time-div'><p>{moment(item.created).fromNow()}</p></div>
          </div>
        </Link>
      </div>
    );

    return (list);
  }
  
  const handleClickOutside = (event) => {
    if (suggestionRef && !suggestionRef.current.contains(event.target)) {
      //setRoomTitle('');
      setSuggestions([]);
    }
  }

  /*const suggestionSelected = (value) => {
    setRoomTitle(value);
    setSuggestions([]);
  }*/
  
  const showStatusInHome = () => {
    if(interests.length > 0 && user) {
      if(rooms.length === 0) { return <div className="noRooms-msg"><span>No room found, feed is empty</span></div> }      
    } else { return <div className="noRooms-msg"><span>Please follow any topic to see chat room in home</span></div> }
  }

  if(!loggedIn) {
    return <Redirect to='/' />;
  } else {
    return (
      <div className='main-div home-page'>
        <NavBar pageTitle='Home'/>

        <div className="searchBar" style={{visibility: showSearchBar}}>
          <InputGroup>
              <InputGroup.Prepend>
                <InputGroup.Text ><span role="img" aria-label="search"><i className="fas fa-search"></i></span></InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                  placeholder="What can we help you find?"
                  aria-label="What can we help you find"
                  onChange={onTextChanged}
                  type='text'
                  value={roomTitle}
              />
              <div className="mb-3 suggestion" ref={suggestionRef}>
                {renderSuggestions()}
              </div>
          </InputGroup>
        </div>
        {showStatusInHome()}
        {roomsList()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth
    }
}

export default connect(mapStateToProps)(Home);
