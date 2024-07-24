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
    <div className="start" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1>Start Chatting!</h1>
      <div className="para" style={{ width: '100%', maxWidth: '600px' }}>
        <div className="profile-icon">
          <img src={Icon} alt="Profile Icon" />
        </div>
        <p style={{ textAlign: 'center' }}>Try 2 different browsers and mail ID</p>
        <p style={{ textAlign: 'center' }}>Room ID: {formattedNumber}</p>
        <p style={{ textAlign: 'center' }}>UID: {auth.currentUser.uid}</p>
        <br />
        <div className="chat-box" style={{ border: '1px solid #ccc', borderRadius: '10px', padding: '10px', background: 'url("https://i.pinimg.com/564x/6c/78/4f/6c784f07146f1a05372059daff4fdf88.jpg")', maxHeight: '400px', overflowY: 'auto' }}>
          <div className="messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.mid === auth.currentUser.uid ? 'other-message' : 'user-message'}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.mid === auth.currentUser.uid ? 'flex-end' : 'flex-start',
                  marginBottom: '10px'
                }}
              >
                <p style={{ background: message.mid === auth.currentUser.uid ? '#DCF8C6' : '#FFF', color: '#333', padding: '10px', borderRadius: '10px', maxWidth: '80%' }}>
                  <span className="user" style={{ fontWeight: 'bold' }}>{message.user}:</span> {message.text}
                </p>
                {message.mid === auth.currentUser.uid && (
                  <p
                    onClick={() => handleDelete(message.id)}
                    className="delete-button"
                    style={{ alignSelf: 'flex-end', marginTop: '5px', cursor: 'pointer', color: '#ff0000' }}
                  >
                    <RiDeleteBinLine className="delete-icon" size={24} style={{ color: "white", cursor: "pointer", alignContent: "center" }} />
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="new-message-form" style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <input
            type="text"
            value={newMessage}
            onChange={(event) => setNewMessage(event.target.value)}
            className="new-message-input"
            placeholder="Type your message here..."
            style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginBottom: '10px' }}
          />
          <button type="submit" className="send-button" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>
            Send
          </button>
        </form>
        <button onClick={() => { setRoom(0) }}> Change Room ID </button><br />
        <button onClick={authenticate_check}> Log Out </button>

        <div className="know" style={{ marginTop: '20px', textAlign: 'center' }}>
          <p onClick={() => openModal(0)} style={{ cursor: 'pointer', color: '#007bff' }}>Know More</p>
          <p onClick={() => openModal(1)} style={{ cursor: 'pointer', color: '#007bff' }}>About Us</p>
          <p onClick={() => openModal(2)} style={{ cursor: 'pointer', color: '#007bff' }}>Privacy Policy</p>
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
          <div className="modal-content" style={{ padding: '20px', borderRadius: '10px', background: '#fff' }}>
            <h2>{sectionContent[selectedSection].title}</h2>
            <p>{sectionContent[selectedSection].content}</p>
            <button onClick={closeModal} className="modal-button" style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', background: '#007bff', color: '#fff', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default About;
