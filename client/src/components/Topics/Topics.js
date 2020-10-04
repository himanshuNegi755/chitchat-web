import React, { useState } from "react";
import './Topics.css';

const Interests = () => {
  const [groups, setGroups] = useState([
    {category: 'Technology', title: 'mars rover', members: '7/10', language: 'English', started: '3 min ago', access: 'anyone can join', key: '1'},
    {category: 'Technology', title: 'flying winds turbine', members: '5/10', language: 'German', started: '10 min ago', access: 'anyone can join', key: '2'},
    {category: 'Technology', title: 'hydrogen fuel car', members: '10/10', language: 'Chinese', started: '15 min ago', access: 'only admin allow', key: '3'},
    {category: 'Technology', title: 'nuclear fusion', members: '2/10', language: 'Japanese', started: '1 min ago', access: 'anyone can join', key: '4'},
    {category: 'Technology', title: 'wireless electricity', members: '4/10', language: 'Hindi', started: '4 min ago', access: 'anyone can join', key: '5'},
    
    {category: 'Art', title: 'monalisa', members: '7/10', language: 'English', started: '3 min ago', access: 'anyone can join', key: '6'},
    {category: 'Art', title: 'the last supper', members: '5/10', language: 'German', started: '10 min ago', access: 'anyone can join', key: '7'},
    {category: 'Art', title: 'the starry night', members: '10/10', language: 'Chinese', started: '15 min ago', access: 'only admin allow', key: '8'},
    {category: 'Art', title: 'the scream', members: '2/10', language: 'Japanese', started: '1 min ago', access: 'anyone can join', key: '9'},
    {category: 'Art', title: 'the kiss', members: '4/10', language: 'Hindi', started: '4 min ago', access: 'anyone can join', key: '10'},
    
    {category: 'Apps', title: 'tinder', members: '7/10', language: 'English', started: '3 min ago', access: 'anyone can join', key: '11'},
    {category: 'Apps', title: 'facebook', members: '5/10', language: 'German', started: '10 min ago', access: 'anyone can join', key: '12'},
    {category: 'Apps', title: 'quire', members: '10/10', language: 'Chinese', started: '15 min ago', access: 'only admin allow', key: '13'},
    {category: 'Apps', title: 'crunchy roll', members: '2/10', language: 'Japanese', started: '1 min ago', access: 'anyone can join', key: '14'},
    {category: 'Apps', title: 'zomato', members: '4/10', language: 'Hindi', started: '4 min ago', access: 'anyone can join', key: '15'},
    
    {category: 'Space', title: 'mega structure', members: '7/10', language: 'English', started: '3 min ago', access: 'anyone can join', key: '16'},
    {category: 'Space', title: 'colonizing space', members: '5/10', language: 'German', started: '10 min ago', access: 'anyone can join', key: '17'},
    {category: 'Space', title: 'space weapon', members: '10/10', language: 'Chinese', started: '15 min ago', access: 'only admin allow', key: '18'},
    {category: 'Space', title: 'fermi paradox', members: '2/10', language: 'Japanese', started: '1 min ago', access: 'anyone can join', key: '19'},
    {category: 'Space', title: 'mars mission', members: '4/10', language: 'Hindi', started: '4 min ago', access: 'anyone can join', key: '20'},
    
    {category: 'Politics', title: '2020 election', members: '7/10', language: 'English', started: '3 min ago', access: 'anyone can join', key: '21'},
    {category: 'Politics', title: 'putin', members: '5/10', language: 'German', started: '10 min ago', access: 'anyone can join', key: '22'},
    {category: 'Politics', title: 'china vs india', members: '10/10', language: 'Chinese', started: '15 min ago', access: 'only admin allow', key: '23'},
    {category: 'Politics', title: 'heroshima attack', members: '2/10', language: 'Japanese', started: '1 min ago', access: 'anyone can join', key: '24'},
    {category: 'Politics', title: 'ram mandir', members: '4/10', language: 'Hindi', started: '4 min ago', access: 'anyone can join', key: '25'},
    
    {category: 'Nature', title: 'yellow stone park', members: '7/10', language: 'English', started: '3 min ago', access: 'anyone can join', key: '26'},
    {category: 'Nature', title: 'munich', members: '5/10', language: 'German', started: '10 min ago', access: 'anyone can join', key: '27'},
    {category: 'Nature', title: 'honkong park', members: '10/10', language: 'Chinese', started: '15 min ago', access: 'only admin allow', key: '28'},
    {category: 'Nature', title: 'sucide park', members: '2/10', language: 'Japanese', started: '1 min ago', access: 'anyone can join', key: '29'},
    {category: 'Nature', title: 'munnar', members: '4/10', language: 'Hindi', started: '4 min ago', access: 'anyone can join', key: '30'},
    
    {category: 'Anime', title: 'one punch man', members: '7/10', language: 'English', started: '3 min ago', access: 'anyone can join', key: '31'},
    {category: 'Anime', title: 'death note', members: '5/10', language: 'German', started: '10 min ago', access: 'anyone can join', key: '32'},
    {category: 'Anime', title: 'one outs', members: '10/10', language: 'Chinese', started: '15 min ago', access: 'only admin allow', key: '33'},
    {category: 'Anime', title: 'no game no life', members: '2/10', language: 'Japanese', started: '1 min ago', access: 'anyone can join', key: '34'},
    {category: 'Anime', title: 'one piece', members: '4/10', language: 'Hindi', started: '4 min ago', access: 'anyone can join', key: '35'},
  ])
  
  const groupsList = () => {
    const list = groups.map((item) =>
      <a href='#topics'>
        <div key={item.key} className='groups'>
          <div className='row'>
            <div className='col'><h2>{item.title}</h2></div>
            <div className='col'><h2>{item.language}</h2></div>
          </div>
          <div className='row'>
            <div className='col'><h2>{item.members}</h2></div>
            <div className='col'><h2>{item.access}</h2></div>
            <div className='col'><h2>{item.started}</h2></div>
          </div>
        </div>
      </a>
    );

    return (list);
  }
  
  return (
    <div className='main-div'>
      {groupsList()}
    </div>
  );
}

export default Interests;