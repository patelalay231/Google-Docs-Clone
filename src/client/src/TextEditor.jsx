import React, { useCallback, useEffect, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';
import { FaShareAlt } from 'react-icons/fa'; // Importing a share icon from react-icons
import { Button, EditableTitle, ShareModel } from './components'; // Importing components
import { useNavigate } from 'react-router-dom';
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
  const [shareLink, setShareLink] = useState(`https://google-docs-clone-xi-teal.vercel.app/document/${documentId}`);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Fetch user data
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');

      const response = await axios.get(`https://google-docs-clone-xi-teal.vercel.app/api/user/data`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.user.id);
    } catch (err) {
      console.error(err);
    }
  };

  // Establish socket connection
  useEffect(() => {
    const s = io('https://google-docs-clone-xi-teal.vercel.app', {
      transports: ['websocket', 'polling'],
      auth: {
        token: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    s.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setTimeout(() => {
        s.connect();
      }, 1000); // Retry connection after 1 second
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  // Handle receiving changes
  useEffect(() => {
    if (quill == null || socket == null) return;

    const handleReceiveChanges = (delta, title) => {
      setTitle(title);
      quill.updateContents(delta);
    };

    socket.on('receive-changes', handleReceiveChanges);

    return () => {
      socket.off('receive-changes', handleReceiveChanges);
    };
  }, [socket, quill]);

  // Load document
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

  // Handle text changes
  useEffect(() => {
    if (quill == null || socket == null) return;

    const handleTextChange = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta, title);
    };

    quill.on('text-change', handleTextChange);

    return () => {
      quill.off('text-change', handleTextChange);
    };
  }, [quill, socket, title]);

  // Auto-save document periodically
  useEffect(() => {
    if (quill == null || socket == null) return;

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents(), title, user);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [quill, socket, title, user]);

  // Initialize Quill editor
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

  // Handle title save
  const handleSave = (newTitle) => {
    setTitle(newTitle);
  };

  // Handle share button click
  const handleShare = () => {
    setModalOpen(true);
  };

  // Close share modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <div>
          <EditableTitle title={title} onSave={handleSave} />
        </div>
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
            onClick={handleShare}
          >
            <FaShareAlt className="mr-2" /> {/* Sharing icon */}
            Share
          </button>
          <Button onClick={() => navigate('/')}>Go to dashboard</Button>
        </div>
      </nav>
      <div ref={wrapperRef} className="container" />
      <ShareModel isOpen={modalOpen} onClose={handleCloseModal} shareLink={shareLink} />
    </>
  );
}

export default TextEditor;
