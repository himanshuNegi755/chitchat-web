import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import './Interests.css';
import SampleImage from '../../../images/mosh.jpg';

const Interests = ({ userEmail }) => {
  const [topics, setTopics] = useState([]);
  const [followedTopics, setFollowedTopics] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACKEND_API}/user-interests/${userEmail}`)
    .then(res => { setFollowedTopics(res.data) })

    axios.get(`${process.env.REACT_APP_BACKEND_API}/interests`)
    .then(res => { setTopics(res.data) })
  }, [userEmail]);

  const topicItemList = () => {
    const list = topics.map((item) =>
        <div key={item._id} className='interest-col'>
          <div className='row'>
              <div className='col-8 interest-name'>
                <Link to={`/interest?interests=${item.interests}`} className='linkI-div'>
                  <p>{item.interests}</p>
                </Link>
              </div>
              <div className='col-4 follow-div'>
                {followedTopics.includes(item.interests) ? <button onClick={ () => {unFollowInterests(item.interests) }}><i className="far fa-check-circle"></i></button> : <button onClick={ () => { followInterests((item.interests).toLowerCase()) }}>Follow</button>}
              </div>
          </div>
          <div className='img-col'>
            <img src="https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" className='topic-image'/>
          </div>
        </div>
    );

    return (list);
  }

  const followInterests = (interests) => {
    axios.put(`${process.env.REACT_APP_BACKEND_API}/user-interests/add`, {
      userEmail: userEmail,
      interests: interests
    })
    .then(res => { setFollowedTopics([...followedTopics, interests]); })
  }

  const unFollowInterests = (interests) => {
    axios.put(`${process.env.REACT_APP_BACKEND_API}/user-interests/delete`, {
      userEmail: userEmail,
      interests: interests
    })
    .then(res => {
      let followTopicsArray = followedTopics.filter(item => item !== interests);
      setFollowedTopics(followTopicsArray);
    })
  }

  return (topicItemList());
}

export default Interests;
