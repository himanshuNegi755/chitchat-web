import React, { useState, useEffect } from "react";
import './Interests.css';

const Interests = () => {
  const [topics, setTopics] = useState([
    {title: 'Technology', subTitle: 'Follow', image: require('../../../images/mosh.jpg'), key: '1'},
    {title: 'Art', subTitle: 'Follow', image: require('../../../images/mosh.jpg'), key: '2'},
    {title: 'Apps', subTitle: 'Follow', image: require('../../../images/mosh.jpg'), key: '3'},
    {title: 'Space', subTitle: 'Follow', image: require('../../../images/mosh.jpg'), key: '4'},
    {title: 'Politics', subTitle: 'Follow', image: require('../../../images/mosh.jpg'), key: '5'},
    {title: 'Nature', subTitle: 'Follow', image: require('../../../images/mosh.jpg'), key: '6'},
    {title: 'Anime', subTitle: 'Follow', image: require('../../../images/mosh.jpg'), key: '7'},
  ])
  
  const topicItemList = () => {
    const list = topics.map((item) =>
      <a href='/topics'>
        <div key={item.key} className='row'>
          <div className='col'>
            <img src={item.image} alt="topic" className='image-topic'/>
          </div>
          <div className='col'>
            <h2>{item.title}</h2>
          </div>
          <div className='col'>
            <button>{item.subTitle}</button>
          </div>
        </div>
      </a>
    );

    return (list);
  }
  
  return (topicItemList());
}

export default Interests;