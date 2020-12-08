import React, { useState, useEffect } from "react";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

import './Interests.css';
import NavBar from '../NavBar/NavBar';

const Interests = ({ user }) => {
  const [topics, setTopics] = useState([]);
  const [followedTopics, setFollowedTopics] = useState([]);

  useEffect(() => {
    if(user) {
      axios.get(`${process.env.REACT_APP_BACKEND_API}/user-interests/${user.userEmail}`)
      .then(res => { setFollowedTopics(res.data) })

      axios.get(`${process.env.REACT_APP_BACKEND_API}/interests`)
      .then(res => { setTopics(res.data) })
    }
  }, [user]);

  const topicItemList = () => {
    const list = topics.map((item) =>
        <div key={item._id} className='interest-col'>
          <div className='row'>
              <div className='col-8 interest-name'>
                <Link to={`/rooms?interests=${item.interests}`} className='linkI-div'>
                  <p>{item.interests}</p>
                </Link>
              </div>
              <div className='col-4 follow-div'>
                {followedTopics.includes(item.interests) ? <button onClick={ () => {unFollowInterests(item.interests) }}><i className="far fa-check-circle"></i></button> : <button onClick={ () => { followInterests((item.interests).toLowerCase()) }}>Follow</button>}
              </div>
          </div>
          <Link to={`/rooms?interests=${item.interests}`} className='linkI-div'>
            <div className='img-col'>
              <img src={item.imageUrl} alt="topic" className='topic-image'/>
            </div>
          </Link>
        </div>
    );

    return (list);
  }

  const followInterests = (interests) => {
    axios.put(`${process.env.REACT_APP_BACKEND_API}/user-interests/add`, {
      userEmail: user.userEmail,
      interests: interests
    })
    .then(res => { setFollowedTopics([...followedTopics, interests]); })
  }

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
    <div className='main-div interest-pg'>
      <NavBar pageTitle='Interests'/>
      { user ? (user.userIsNew ? <div className="firstUser-msg">Please create an unique UserName in profile section to join chat room and follow any topic you like. You will get the existing rooms</div> : null) : null}
      <div className="interest-div">{topicItemList()}</div>
    </div>
  );
}

const mapStateToProps = (state) => {
    return {
        user: state.auth
    }
}

export default connect(mapStateToProps)(Interests);
