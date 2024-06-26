// Import statements for dependencies
import { auth, provider, db } from "../firebase-config.js";
import { signInWithPopup, signOut } from "firebase/auth";
import "../styles/Home.css";
import Cookies from "universal-cookie";
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { RiDeleteBinLine } from 'react-icons/ri';
import {
  collection,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  where,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

// Creating an instance of Cookies
const cookies = new Cookies();

// Sample content for sections
const sectionContent = [
  {
    title: 'Section 1',
    content: 'This is information about Section 1.',
  },
  {
    title: 'Section 2',
    content: 'This is information about Section 2.',
  },
  {
    title: 'Section 3',
    content: 'This is information about Section 3.',
  },
  {
    title: 'Section 4',
    content: 'This is information about Section 4.',
  },
];

const About = ({ setIsAuth, setEmail, Room, setRoom, Icon, setIcon }) => {
  // States for managing modal and chat functionality
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesRef = collection(db, "messages");

  // Formatting room number
  let roomasstring = Room.toString();
  let formattedNumber = roomasstring.slice(0, 5) + '-' + roomasstring.slice(5, 10) + '-' + roomasstring.slice(10);

  // Function to open the modal for a specific section
  const openModal = (sectionIndex) => {
    setSelectedSection(sectionIndex);
    setModalIsOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSection(null);
  };

  // Function to handle user logout
  const authenticate_check = async () => {
    try {
      await signOut(auth)
      setEmail("")
      cookies.remove("auth-token");
      setIsAuth(false)
      setIcon("")
      setRoom(0)
      alert("Successfully Logged Out")
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    console.log(auth.currentUser.uid)
    const queryMessages = query(messagesRef,
      where("room", "==", roomasstring),
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
      let messages = [];
      snapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
        console.log(doc.id)
      });
      console.log(messages);
      setMessages(messages);
    });

    return () => unsubscribe();
  }, []);


  // Function to handle changes in the chat input
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(messagesRef)
    if (newMessage === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      createdAt: serverTimestamp(),
      user: auth.currentUser.displayName,
      room: roomasstring,
      mid: auth.currentUser.uid
    });

    setNewMessage("");
  };
  const handleDelete = async (messageId) => {
    try {
      // Reference to the document to be deleted
      console.log(messageId)
      const messageDocRef = doc(db, "messages", messageId);


      // Delete the document
      await deleteDoc(messageDocRef);

      // Optionally, you may remove the deleted message from the state to reflect the change immediately
      // setMessages(messages.filter(message => message.id !== messageId));

      console.log("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message: ", error);
    }
  };

  return (
    <div className="start">
      <h1>Start Chatting!</h1>
      <div className='para'>
        <div className="profile-icon">
          <img src={Icon} alt="Profile Icon" />
        </div>
        <p>Try 2 different browsers and mail ID</p>
        <p>Room ID: {formattedNumber}</p>
        <p>UID: {auth.currentUser.uid}</p>
        <br />
        <div className="chat-box">
          <div className="messages">
            {messages.map((message) => (
              <div key={message.id} className={`message ${message.mid === auth.currentUser.uid ? 'user-message' : 'other-message'}`}>
                <p style={{color: "white"}}><span className="user"><strong>{message.user}:</strong></span> {message.text}</p>
                {message.mid === auth.currentUser.uid && (
                  <p onClick={() => handleDelete(message.id)} className="delete-button">
                    <RiDeleteBinLine className="delete-icon" size={24} style={{color: "white", cursor: "pointer", alignContent: "center"}} /> {/* Adding the dustbin icon */}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="new-message-form">
          <input
            type="text"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            className="new-message-input"
            placeholder="Type your message here..."
          />
          <br />
          <br />
          <button type="submit" className="send-button">
            Send
          </button>
        </form>
        <button onClick={async () => { setRoom(0) }}> Change Room ID </button><br />
        <button onClick={authenticate_check}> Log Out </button><br />

        <div className="know">
          <p onClick={() => openModal(0)}>Know More</p>
          <p onClick={() => openModal(1)}>About Us</p>
          <p onClick={() => openModal(2)}>Privacy Policy</p>
        </div>
      </div>
      <br />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Section Modal"
        className="custom-modal"
        overlayClassName="custom-overlay"
      >
        {selectedSection !== null && (
          <div className="modal-content">
            <h2>{sectionContent[selectedSection].title}</h2>
            <p>{sectionContent[selectedSection].content}</p>
            <button onClick={closeModal} className="modal-button">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default About;
