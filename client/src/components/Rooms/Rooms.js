import React, { useState, useEffect } from "react";
import { Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';
import queryString from 'query-string';
import { Modal, Form } from 'react-bootstrap';
import './Rooms.css';

const Rooms = ({ location, user }) => {
  /*const [groups, setGroups] = useState([
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
  ]);*/
  const [title, setTitle] = useState();
  const [members, setMembers] = useState();
  const [access, setAccess] = useState();
  const [language, setLanguage] = useState();
  const [category, setCategory] = useState();
  const [showModal, setShowModal] = useState(false);
  const [rooms, setRooms] = useState([]);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    const { interests } = queryString.parse(location.search);

    axios.get(`${process.env.REACT_APP_BACKEND_API}/room/${interests}`)
    .then(res => { setRooms(res.data) })

  }, [location.search]);

  const createRoom = () => {
    axios.post(`${process.env.REACT_APP_BACKEND_API}/room/create`, {
      title: title,
      language: language,
      members: members,
      access: access,
      category: category
    })
    .then(res => {
      setShowModal(!showModal);
      setRedirect(true);
    })
  }

  const roomsList = () => {
    const list = rooms.map((item) =>
      <div key={item._id} className='groups'>
        <Link onClick={e => {entryValidation(e, item.members)}} to={`/chat?name=${user.userName}&room=${item.title}`} className='linkR-div'>
          <div className='row row-one'>
            <div className='col-8 room-name'><p>{item.title}</p></div>
            <div className='col-4 language-name'><p>Language: {item.language}</p></div>
          </div>
          <div className='row row-two'>
            <div className='col-5 access-status'><p>Access: {item.access}</p></div>
            <div className='col-3 members-no'><p>Members: {item.members}</p></div>
            <div className='col-4 time-div'><p>{item.created}</p></div>
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
    } else if (members >= 11) {
      alert('Room Already full, pls try another room');
      e.preventDefault();
    }
  }
  
  const showCreateRoomModal = (showModal) => {
    return(
      <div>
        <Modal
            size="md"
            aria-labelledby="new-room-modal"
            centered
            show={showModal}
            onHide={() => { setShowModal(!showModal) }}
            >
          <Modal.Header closeButton>
            <div className="Form-title">
              CREATE NEW ROOM
            </div>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control type="text" placeholder="Room Title" name='title' value={title} onChange={e => setTitle(e.target.value)}/>
              </Form.Group>

              <Form.Group>
                  <Form.Control type="text" placeholder="members" name='members' value={members} onChange={e => setMembers(e.target.value)}/>
              </Form.Group>

              <Form.Group>
                  <Form.Control type="text" placeholder="who all can access the room" name='access' value={access} onChange={e => setAccess(e.target.value)}/>
              </Form.Group>

              <Form.Group>
                  <Form.Control type="text" placeholder="language" name='language' value={language} onChange={e => setLanguage(e.target.value)}/>
              </Form.Group>

              <Form.Group>
                  <Form.Control type="text" placeholder="category" name='category' value={category} onChange={e => setCategory(e.target.value)}/>
              </Form.Group>

              <div className="btn-div">
                <button type="button" className="submit-btn form-btn" onClick={createRoom}>
                  Submit
                </button>
              </div>
            </Form>

          </Modal.Body>
        </Modal>
      </div>
    )
  }
  
  const showRoomCreateModalOrNot = () => {
    if(user.userName) {
      setShowModal(!showModal)
    } else {
      alert('Please First create user name in profile');
    }
  }

  if(redirect && user.userName) {
    return (<Redirect to ={`/chat?name=${user.userName}&room=${title}`}/>)
  } else {
      return (
        <div className='main-div'>
          <div className="topbar row">
            <div className="col-5"><h2>Rooms</h2></div>
            <div className="col-5"></div>
            <div className="col-2"><button  className="create-room" onClick={showRoomCreateModalOrNot}>CREATE ROOM</button></div>
          </div>
          {roomsList()}
          {showCreateRoomModal(showModal)}
        </div>
      );
    }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth
  }
}

export default connect(mapStateToProps)(Rooms);
