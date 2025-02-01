// useNotes.js
import { useState, useEffect } from 'react';
import { fetchNotes, fetchNoteById, createNote, updateNote, deleteNote } from './api';

export const useNotes = () => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [totalPages, setTotalPages] = useState(1);

    // console.log(currentNote)

    const fetchNotesData = async (pageNum = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchNotes(pageNum);
            setNotes(data.data);
            setTotalPages(parseInt(data.total_pages, 10));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateNote = async () => {
        setError(null);
        setSuccess(null);
        try {
            await createNote(title, content);
            setSuccess('Note successfully created!');
            fetchNotesData(page);
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleUpdateNote = async (id) => {
        setError(null);
        setSuccess(null);
        try {
            await updateNote(id, title, content);
            setSuccess('Note successfully updated!');
            fetchNotesData(page);
            //resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDeleteNote = async (id) => {
        setError(null);
        setSuccess(null);
        try {
            await deleteNote(id);
            setSuccess('Note successfully deleted!');
            fetchNotesData(page);
            resetForm();
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchNoteDetails = async (id) => {
        setError(null);
        try {
            const data = await fetchNoteById(id);
            console.log(data)
            setCurrentNote(data.data);
            setTitle(data.data.post_title || data.data.title?.rendered || '');
            setContent(data.data.post_content || data.data.content?.rendered || '');
            setIsEditing(true);
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setIsEditing(false);
        setCurrentNote(null);
    };

    useEffect(() => {
        fetchNotesData(page);
    }, [page]);

    return {
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
    };
};
