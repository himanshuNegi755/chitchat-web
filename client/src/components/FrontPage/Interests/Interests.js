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
        <div key={item._id} className='row'>
          <div className='col'>
            <img src={SampleImage} alt="topic" className='image-topic'/>
          </div>
          <div className='col'>
            <Link to={`/interest?interests=${item.interests}`}>
              <h2>{item.interests}</h2>
            </Link>
          </div>
          <div className='col'>
            {followedTopics.includes(item.interests) ? <button onClick={ () => {unFollowInterests(item.interests) }}>Followed</button> : <button onClick={ () => { followInterests((item.interests).toLowerCase()) }}>Follow</button>}
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