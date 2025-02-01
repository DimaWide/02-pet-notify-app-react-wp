import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteForm from './NoteForm';
import Sidebar from './Sidebar';
import Notification from './Notification';
import { useNotes } from './useNotes'; // Импортируем хук useNotes
import axios from 'axios';

const NotesApp = () => {
    const {
        notes,
        currentNote,
        isEditing,
        page,
        title,
        content,
        isLoading,
        error,
        success,
        totalPages,
        fetchNoteDetails,
        handleCreateNote,
        handleUpdateNote,
        handleDeleteNote,
        resetForm,
        setPage,
        setTitle,
        setContent,
    } = useNotes();

    const navigate = useNavigate();

    useEffect(() => {
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);


    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) navigate('/login');
    }, [navigate]);
    // Функция для сброса формы и фокуса на поле ввода
    const handleAddNote = () => {
        // Сбрасываем значения полей
        console.log(23)
        resetForm();
        setTitle(""); // Сбрасываем title
        setContent(""); // Сбрасываем content
        

        // Устанавливаем фокус на поле с классом .data-post-title
        const titleInput = document.querySelector(".data-post-title input");
        if (titleInput) {
            titleInput.focus();
        }
    };
    return (
        <div className="cmp-notes p-4 bg-gray-100 min-h-screen" id='id'>
            <div className="data-container swd-container">
                {error && <Notification message={error} type="error" />}
                {success && <Notification message={success} type="success" />}
    
                <div className="data-row">
                    <Sidebar
                        notes={notes}
                        isLoading={isLoading}
                        currentNote={currentNote}
                        fetchNoteById={fetchNoteDetails}
                        totalPages={totalPages}
                        activePage={page}
                        onPageChange={(_, data) => setPage(data.activePage)}
                    />

                    <NoteForm
                        title={title}
                        setTitle={setTitle}
                        content={content}
                        setContent={setContent}
                        isEditing={isEditing}
                        currentNote={currentNote}
                        confirmDelete={(id) => {
                            if (window.confirm('Are you sure you want to delete this note?')) {
                                handleDeleteNote(id);
                            }
                        }}
                        handleSubmit={(e) => {
                            e.preventDefault();
                            if (isEditing && currentNote) {
                                handleUpdateNote(currentNote.ID);
                            } else {
                                handleCreateNote();
                            }
                        }}
                        resetForm={resetForm}
                    />

                </div>

            </div>
        </div>
    );
};

export default NotesApp;
