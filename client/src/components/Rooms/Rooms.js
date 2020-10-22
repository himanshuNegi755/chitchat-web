import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import queryString from 'query-string';
import moment from 'moment';

import './Rooms.css';
import NavBar from '../NavBar/NavBar';

const Rooms = ({ location, user }) => {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const { interests } = queryString.parse(location.search);

    axios.get(`${process.env.REACT_APP_BACKEND_API}/room/${interests}`)
    .then(res => { setRooms(res.data) })

  }, [location.search]);

  const roomsList = () => {
    const list = rooms.map((item) =>
      <div key={item._id} className='groups'>
        <Link onClick={e => {entryValidation(e, item.members)}} to={`/chat?name=${user.userName}&room=${item.title}&roomId=${item._id}`} className='linkR-div'>
          <div className='row row-one'>
            <div className='col-lg-8 col-md-6 col-sm-6 room-name'><p>{item.title}</p></div>
            <div className='col-lg-4 col-md-6 col-sm-6 language-name'><p>Language: {item.language}</p></div>
          </div>
          <div className='row row-two'>
            <div className='col-lg-5 col-md-3 col-sm-3 access-status'><p>{item.category}</p></div>
            <div className='col-lg-3 col-md-4 col-sm-4 members-no'><p>Members: {item.members}/10</p></div>
            <div className='col-lg-4 col-md-5 col-sm-5 time-div'><p>{moment(item.created).fromNow()}</p></div>
          </div>
        </Link>
      </div>
    );

    return (list);
  }

  const entryValidation = (e, members) => {
    if(!user.userName) {
      alert('Please First create user name in profile');
      e.preventDefault()
    } else if (members >= 2) {
      alert('Room Already full, pls try another room');
      e.preventDefault();
    }
  }

  return (
    <div className='main-div'>
      <NavBar pageTitle='Rooms'/>
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
