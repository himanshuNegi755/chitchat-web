import React, { useState, useEffect, useRef } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { InputGroup, FormControl } from 'react-bootstrap';
import { fetchUser } from '../../../store/actions/authActions';

import './Home.css';
import NavBar from '../../NavBar/NavBar';
import langIcon from '../../../icons/langIcon.svg';
//import GoogleAd from '../../GoogleAd/GoogleAd.js';

const Home = ({ user, fetch_user }) => {

  useEffect(() => { fetch_user() }, [fetch_user])

  const [rooms, setRooms] = useState([]); //rooms as per user follow interests
  const [allRoomsList, setAllRoomsList] = useState([]); //all rooms
  const [suggestions, setSuggestions] = useState([]);
  const [roomTitle, setRoomTitle] = useState(''); //for searching titles
  const [showSearchBar, setShowSearchBar] = useState('hidden'); //for searching titles
  const [topics, setTopics] = useState([]);
  const [followedTopics, setFollowedTopics] = useState([]);

  const suggestionRef = useRef(null);

  useEffect(() => {
    let isMounted = true; //to avoid memory leak problem on unmounting component
    if(user) {
      axios.get(`${process.env.REACT_APP_BACKEND_API}/interests`)
      .then(res => { setTopics(res.data) })

      axios.get(`${process.env.REACT_APP_BACKEND_API}/user-interests/${user.userEmail}`)
      .then(res => { if(isMounted) {

        setFollowedTopics(res.data)
        axios.get(`${process.env.REACT_APP_BACKEND_API}/room`, {
          params: { interests: res.data }
        })
        .then(res => { setRooms(res.data)
                   setShowSearchBar('visible')})
        }
      })

    }

    return () => { isMounted = false };
  }, [user]);

  const entryValidation = (e, members, roomId) => {
    if(!user.userName) {
      alert('Please First create user name in profile');
      e.preventDefault()
    } else if (members >= 10) {
      alert('Room Already full, pls try another room');
      e.preventDefault();
    } else {
      e.persist();
      axios.get(`${process.env.REACT_APP_BACKEND_API}/room-with-id/${roomId}`)
      .then(res => {
        if(res.data.length === 0) {
          alert("Room doesn't exist anymore, pls refresh the page for latest room");
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
            <div className='col-4 language-name'><p><span className="lang-span"><img src={langIcon} className="lang-icon" alt="language icon" /> </span>{item.language}</p></div>
          </div>
          <div className='row row-two'>
            <div className='col-5 access-status'><p>{item.category}</p></div>
            <div className='col-3 members-no'><p><i className="fas fa-users"></i> {item.members}/10</p></div>
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
            <div className='col-lg-4 col-md-4 members-no'><p><i className="fas fa-users"></i> {item.members}/10</p></div>
            <div className='col-lg-4 col-md-5 time-div'><p>{moment(item.created).fromNow()}</p></div>
          </div>
        </Link>
      </div>
    );

    return (list);
  }

  const handleClickOutside = (event) => {
    if(suggestionRef.current) { if (suggestionRef && !suggestionRef.current.contains(event.target)) { setSuggestions([]) } }
    }

  //list of interests
  const topicItemList = () => {
    const list = topics.map((item) =>
        <div key={item._id} className="interestDiv" style={{backgroundImage: `url(${item.imageUrl})`}}>
          <div className="interest-overlayer row">
            <Link className='linkI-div col-9' onClick={() => selectedInterestsRoom(item.interests)}>
              {item.interests}
            </Link>
            <div className="col-3">{followedTopics.includes(item.interests) ? <button className="add-int"><i  onClick={ () => {unFollowInterests(item.interests) }} className="far fa-check-circle"></i></button> : <button className="add-int"><i onClick={ () => { followInterests((item.interests).toLowerCase()) }} class="fas fa-plus-circle"></i></button>}</div>
          </div>
        </div>
    );

    return (list);
  }

  //load the selected interests room
  const selectedInterestsRoom = (interests) => {
    axios.get(`${process.env.REACT_APP_BACKEND_API}/room/${interests}`)
    .then(res => {
      setRooms(res.data)
    })
  }

  //function to follow interests
  const followInterests = (interests) => {
    axios.put(`${process.env.REACT_APP_BACKEND_API}/user-interests/add`, {
      userEmail: user.userEmail,
      interests: interests
    })
    .then(res => { setFollowedTopics([...followedTopics, interests]); })
  }

  //function to unfollow interest
  const unFollowInterests = (interests) => {
    axios.put(`${process.env.REACT_APP_BACKEND_API}/user-interests/delete`, {
      userEmail: user.userEmail,
      interests: interests
    })
    .then(res => {
      let followTopicsArray = followedTopics.filter(item => item !== interests);
      setFollowedTopics(followTopicsArray);
    })
  }

  return (
    <div className='main-div home-page'>
      <NavBar pageTitle='Home'/>

        <div className="interestCol">
          <div className="interestHeading">Interest</div>
          <div className="interest-list">
            {topicItemList()}
          </div>
        </div>
        <span className="interest-barIcon"><i class="fas fa-bars"></i></span>
        <div className="roomCol" style={{visibility: showSearchBar}}>
          <div className="searchBar">
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
          <div className="rooms-list">
            {rooms.length === 0 ? <div className="firstUser-msg"><span>Feed is empty, create new room or Follow some interests</span></div> : null}
            {roomsList()}
          </div>
        </div>

    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetch_user:() => {dispatch(fetchUser())}
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
