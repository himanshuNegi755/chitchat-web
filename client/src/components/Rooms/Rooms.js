import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import queryString from 'query-string';
import moment from 'moment';

import './Rooms.css';
import NavBar from '../NavBar/NavBar';
import langIcon from '../../icons/langIcon.svg';

const Rooms = ({ location, user }) => {
  const [rooms, setRooms] = useState([]);
  const [interestExistOrNot, setInterestExistOrNot] = useState(false);  //var to check if interest exist or not
  const [interestStatus, setInterestStatus] = useState('');   //server response after finding interest doesn't exist

  useEffect(() => {
    const { interests } = queryString.parse(location.search);

    axios.get(`${process.env.REACT_APP_BACKEND_API}/room/${interests}`)
    .then(res => {
      if(Array.isArray(res.data)) {
        setRooms(res.data);
        setInterestExistOrNot(true);
      } else {
        setInterestExistOrNot(false);
        setInterestStatus(res.data);
      }
    })

  }, [location.search, user]);

  const roomsList = () => {
    if(interestExistOrNot) {
      if(rooms.length > 0){
        const list = rooms.map((item) =>
          <div key={item._id} className='groups'>
            <Link onClick={e => entryValidation(e, item.members, item._id)} to={`/chat?room=${item.title}&roomId=${item._id}`} className='linkR-div'>
              <div className='row row-one'>
                <div className='col-lg-8 col-md-6 col-sm-6 room-name'><p>{item.title}</p></div>
                <div className='col-lg-4 col-md-6 col-sm-6 language-name'><p><span className="lang-span"><img src={langIcon} className="lang-icon" alt="language icon" /> </span>{item.language}</p></div>
              </div>
              <div className='row row-two'>
                <div className='col-lg-4 col-md-3 col-sm-3 genre-status'><p>{item.category}</p></div>
                <div className='col-lg-4 col-md-4 col-sm-4 members-no'><p><i className="fas fa-users"></i> {item.members}/10</p></div>
                <div className='col-lg-4 col-md-5 col-sm-5 time-div'><p>{moment(item.created).fromNow()}</p></div>
              </div>
            </Link>
          </div>
        );

      return (list);

      } else {
        return <div className="noRooms-msg">No rooms in this interest. But you can create one <span role="img" aria-label="peace">✌️</span>.</div>
      }
    } else {
      return <div className="noRooms-msg">{interestStatus}</div>
    }
  }

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

  return (
    <div className='main-div'>
      <NavBar/>
      {roomsList()}
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.auth
  }
}

export default connect(mapStateToProps)(Rooms);
