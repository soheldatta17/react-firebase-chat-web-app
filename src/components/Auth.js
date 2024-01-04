import { auth, provider } from "../firebase-config.js";
import { signInWithPopup, signOut } from "firebase/auth";
import "../styles/Home.css";
import Cookies from "universal-cookie";
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

const cookies = new Cookies();

const sectionContent = [
  {
    title: 'Section 1',
    content: 'This is information about Section 1.',
    // imageUrl: 'https://via.placeholder.com/150', // Replace with your image URL
  },
  {
    title: 'Section 2',
    content: 'This is information about Section 2.',
    // imageUrl: 'https://via.placeholder.com/150', // Replace with your image URL
  },
  {
    title: 'Section 3',
    content: 'This is information about Section 3.',
    // imageUrl: 'https://via.placeholder.com/150', // Replace with your image URL
  },
  {
    title: 'Section 4',
    content: 'This is information about Section 4.',
    // imageUrl: 'https://via.placeholder.com/150', // Replace with your image URL
  },
];
// { setIsAuth }
const Auth = ({ setIsAuth, setEmail, setIcon }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);


  const openModal = (sectionIndex) => {
    setSelectedSection(sectionIndex);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedSection(null);
  };

  const authenticate_check = async () => {
    try {
      await signOut(auth)
      setEmail("")
      cookies.remove("auth-token");
      setIsAuth(false)
      alert("Successfully Logged Out")
    }
    catch (err) {
      console.error(err);
    }
  }


  const authenticate = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // cookies.set("auth-token", result.user.refreshToken, { 
      //   sameSite: 'None', 
      //   secure: true,
      //   photo: auth?.currentUser?.photoURL
      // });
      cookies.set('auth-token', JSON.stringify({ refreshToken: result.user.refreshToken, photoURL: auth?.currentUser?.photoURL }), { sameSite: 'None', secure: true });
      
      // alert(auth?.currentUser?.photoURL)
      setIcon(auth?.currentUser?.photoURL)
      setEmail(auth?.currentUser?.email)
      setIsAuth(true);
      alert("Sucessfully Signed In")
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="start">
      <h1>Let's Chat!</h1>
      <div className='para'>
        <p>Let's chat is a real-time chat application created with React JS and Firebase.</p>
        <img src="https://firebasestorage.googleapis.com/v0/b/fir-course-c2fc5.appspot.com/o/projectFiles%2FUntitled.png?alt=media&token=a3802048-b15c-4c13-b039-a71a7732ad4c" alt="Description" />
        <br />
        <button onClick={authenticate}> Sign In With Google </button><br /><br />
        {/* <button onClick={authenticate_check}> Log Out </button><br />
        <button onClick={() => {
          alert(auth?.currentUser?.email)
        }}> Check </button><br /> */}
        <br />
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
            {/* <img
                src={sectionContent[selectedSection].imageUrl}
                alt={sectionContent[selectedSection].title}
                className="modal-image"
              /> */}
            <button onClick={closeModal} className="modal-button">
              Close
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Auth;
