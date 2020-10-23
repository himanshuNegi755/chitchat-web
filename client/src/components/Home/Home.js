import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

import NavBar from '../NavBar/NavBar';

const Home = ({ user }) => {
  const [rooms, setRooms] = useState([]);
  const [interests, setInterests] = useState([]);
  const [loggedIn, setLoggedIn] = useState(true);

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
    .then(res => { setRooms(res.data) })
  }, [interests]);

  const entryValidation = (e, members) => {
    if(!user.userName) {
      alert('Please First create user name in profile');
      e.preventDefault()
    } else if (members >= 2) {
      alert('Room Already full, pls try another room');
      e.preventDefault();
    }
  }

  const roomsList = () => {
    const list = rooms.map((item) =>
      <div key={item._id} className='groups'>
        <Link onClick={e => {entryValidation(e, item.members)}} to={`/chat?name=${user.userName}&room=${item.title}&roomId=${item._id}`} className='linkR-div'>
          <div className='row row-one'>
            <div className='col-8 room-name'><p>{item.title}</p></div>
            <div className='col-4 language-name'><p>Language: {item.language}</p></div>
          </div>
          <div className='row row-two'>
            <div className='col-5 access-status'><p>{item.category}</p></div>
            <div className='col-3 members-no'><p>Members: {item.members}/10</p></div>
            <div className='col-4 time-div'><p>{moment(item.created).fromNow()}</p></div>
          </div>
        </Link>
      </div>
    );

    return (list);
  }

  if(!loggedIn) {
    return <Redirect to='/' />;
  } else {
    return (
      <div className='main-div'>
        <NavBar pageTitle='Home'/>
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
