import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Styles for Quill

const API_URL = 'http://dev.wp-blog/wp-json/myapi/v1';

const NotesApp = () => {
    const [notes, setNotes] = useState([]);
    const [currentNote, setCurrentNote] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [page, setPage] = useState(1);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [totalPages, setTotalPages] = useState(1);  // Новое состояние для хранения количества страниц

    const navigate = useNavigate();

    // Check if the user is authorized
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) navigate('/login');
    }, [navigate]);

    useEffect(() => {
        fetchNotes(page);
    }, [page]);

    // Axios interceptor for JWT authorization
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

        // Cleanup interceptor on component unmount
        return () => {
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    // Fetch notes with pagination
    const fetchNotes = async (pageNum = 1) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/news`, {
                params: { page: pageNum, per_page: 5 },
            });
            setNotes(response.data);
            // Возможно, сервер возвращает информацию о количестве страниц в заголовках
            const totalPages = parseInt(response.headers['x-wp-totalpages'], 10);
            console.log(response)
            setTotalPages(totalPages);
console.log(totalPages)

        } catch {
            setError('Ошибка при загрузке заметок');
        } finally {
            setIsLoading(false);
        }
    };


    // Fetch a single note by ID
    const fetchNoteById = async (id) => {
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/news/${id}`);
            setCurrentNote(response.data);
            setTitle(response.data.title);
            setContent(response.data.content);
            setIsEditing(true);
        } catch {
            setError('Ошибка при загрузке заметки');
        }
    };

    // Create a new note
    const createNote = async () => {
        setError(null);
        try {
            await axios.post(`${API_URL}/news`, { title, content });
            fetchNotes(page);
            resetForm();
        } catch {
            setError('Ошибка при создании заметки');
        }
    };

    // Update an existing note
    const updateNote = async (id) => {
        setError(null);
        try {
            await axios.put(`${API_URL}/news/${id}`, { title, content });
            fetchNotes(page);
            resetForm();
        } catch {
            setError('Ошибка при обновлении заметки');
        }
    };

    // Delete a note
    const deleteNote = async (id) => {
        setError(null);
        try {
            await axios.delete(`${API_URL}/news/${id}`);
            fetchNotes(page);
        } catch {
            setError('Ошибка при удалении заметки');
        }
    };

    // Reset form fields and editing state
    const resetForm = () => {
        setTitle('');
        setContent('');
        setIsEditing(false);
        setCurrentNote(null);
    };

    // Load notes on component mount and when page changes
    useEffect(() => {
        fetchNotes(page);
    }, [page]);

    return (
        <div>
            <h1>Приложение "Заметки"</h1>

            {/* Display error if any */}
            {error && <p>{error}</p>}

            {/* Notes List with Pagination */}
            <div>
                <h2>Список заметок</h2>
                {isLoading ? (
                    <p>Загрузка...</p>
                ) : (
                    <ul>
                        {notes.map((note) => (
                            <li key={note.id}>
                                <h3>{note.title}</h3>
                                <p dangerouslySetInnerHTML={{ __html: note.excerpt }} />
                                <button onClick={() => fetchNoteById(note.id)}>Редактировать</button>
                                <button onClick={() => deleteNote(note.id)}>Удалить</button>
                            </li>
                        ))}
                    </ul>
                )}

                {/* Pagination Buttons */}
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    Назад
                </button>
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages || totalPages === 0}
                >
                    Вперед
                </button>
            </div>

            {/* Form for Creating and Editing Notes */}
            <div>
                <h2>{isEditing ? 'Редактировать заметку' : 'Создать заметку'}</h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (isEditing && currentNote) {
                            updateNote(currentNote.id);
                        } else {
                            createNote();
                        }
                    }}
                >
                    <div>
                        <label>Заголовок</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Содержание</label>
                        <ReactQuill
                            value={content}
                            onChange={setContent}
                            modules={{
                                toolbar: [
                                    [{ header: '1' }, { header: '2' }, { font: [] }],
                                    [{ list: 'ordered' }, { list: 'bullet' }],
                                    ['bold', 'italic', 'underline', 'strike'],
                                    [{ color: [] }, { background: [] }],
                                    [{ align: [] }],
                                    ['link', 'image'],
                                    ['clean'],
                                ],
                            }}
                            formats={[
                                'header', 'font', 'list', 'bold', 'italic', 'underline', 'strike',
                                'color', 'background', 'align', 'link', 'image',
                            ]}
                            placeholder="Введите текст заметки..."
                        />
                    </div>
                    <button type="submit">
                        {isEditing ? 'Сохранить изменения' : 'Создать'}
                    </button>
                    {isEditing && <button type="button" onClick={resetForm}>Отменить</button>}
                </form>
            </div>
        </div>
    );
};

export default NotesApp;
