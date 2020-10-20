import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import NavBar from '../NavBar/NavBar';

const Home = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [interests, setInterests] = useState([]);

  useEffect(() => {
    if(user) {
      axios.get(`${process.env.REACT_APP_BACKEND_API}/user-interests/${user.userEmail}`)
      .then(res => { setInterests(res.data) })
    }
  }, [user]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_API}/room`, {
      params: { interests: interests }
    })
    .then(res => { setRooms(res.data) })
  }, [interests]);

  const entryValidation = (e, members) => {
    if(!user.userName) {
      alert('Please First create user name in profile');
      e.preventDefault()
    } else if (members >= 3) {
      alert('Room Already full, pls try another room');
      e.preventDefault();
    }
  }

  /*const convertUTCToLocalTime = (utcDateAndTime) => {
    var date = new Date('6/29/2011 4:52:48 PM UTC');
    return date.toString()
  }*/

  const roomsList = () => {
    const list = rooms.map((item) =>
      <div key={item._id} className='groups'>
        <Link onClick={e => {entryValidation(e, item.members)}} to={`/chat?name=${user.userName}&room=${item.title}`} className='linkR-div'>
          <div className='row row-one'>
            <div className='col-8 room-name'><p>{item.title}</p></div>
            <div className='col-4 language-name'><p>Language: {item.language}</p></div>
          </div>
          <div className='row row-two'>
            <div className='col-5 access-status'><p>{item.category}</p></div>
            <div className='col-3 members-no'><p>Members: {item.members}/10</p></div>
            <div className='col-4 time-div'><p>{item.created}</p></div>
          </div>
        </Link>
      </div>
    );

    return (list);
  }

  return (
    <div className='main-div'>
      <NavBar pageTitle='Home'/>
      {roomsList()}
    </div>
  );
}

const mapStateToProps = (state) => {
    return {
        user: state.auth
    }
}

export default connect(mapStateToProps)(Home);
