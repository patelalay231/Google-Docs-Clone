import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { FaShareAlt } from 'react-icons/fa'; // Importing a share icon from react-icons
import {Button, EditableTitle,ShareModel} from './components'; // Import EditableTitle
import {useNavigate} from 'react-router-dom';
import axios from 'axios';

const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  [{ size: ['small', false, 'large', 'huge'] }],
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ color: [] }, { background: [] }],
  [{ font: [] }],
  [{ align: [] }],
  ['link', 'blockquote', 'code-block'],
  ['clean'],
];

function TextEditor() {
  const [socket, setSocket] = useState(null);
  const [quill, setQuill] = useState(null);
  const { id: documentId } = useParams();
  const [title, setTitle] = useState('');
  const [shareLink, setShareLink] = useState(`http://localhost:5173/document/${documentId}`);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:8000/api/user/data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data.user.id);
      } catch (err) {
        console.error(err);
      }
    };


  useEffect(() => {
    const s = io('http://localhost:8000');
    setSocket(s);

    s.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  useEffect(() => {
    if (quill == null || socket == null) return;

    const handleReceiveChanges = (delta,title) => {
      setTitle(title);
      quill.updateContents(delta);
    };

    socket.on('receive-changes', handleReceiveChanges);

    return () => {
      socket.off('receive-changes', handleReceiveChanges);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (quill == null || socket == null) return;

    socket.emit('get-document', documentId);

    socket.once('load-document', (document, t) => {
      fetchUser();
      setTitle(t);
      quill.setContents(document);
      quill.enable();
    });
  }, [quill, socket, documentId]);

  useEffect(() => {
    if (quill == null || socket == null) return;

    const handleTextChange = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta,title);
    };

    quill.on('text-change', handleTextChange);

    return () => {
      quill.off('text-change', handleTextChange);
    };
  }, [quill, socket,title]);

  useEffect(() => {
    if (quill == null || socket == null) return;
    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents(),title,user);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket,title,user]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = '';

    const editor = document.createElement('div');
    wrapper.append(editor);

    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        toolbar: toolbarOptions,
      },
    });
    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, []);

  const handleSave = (newTitle) => {
    setTitle(newTitle);
  };

  const handleShare = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div>
          <EditableTitle title={title} onSave={handleSave} />
        </div>
        <div className='flex gap-2'>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
          onClick={handleShare}
        >
          <FaShareAlt className="mr-2" /> {/* Sharing icon */}
          Share
        </button>
        <Button onClick={() => {navigate('/')} }> Go to dashboard</Button>
        </div>
      </nav>
      <div ref={wrapperRef} className="container" />
      <ShareModel isOpen={modalOpen} onClose={handleCloseModal} shareLink={shareLink} />
      
    </>
  );
}

export default TextEditor;
