import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Styles for Quill
import { Button, Input, List, Pagination, Message, Loader } from 'semantic-ui-react'; // Importing Semantic UI components

const API_URL = 'http://dev.wp-blog/wp-json/myapi/v1';

const Notification = ({ message, type }) => (
    <Message
        success={type === 'success'}
        error={type === 'error'}
        header={type === 'success' ? 'Success!' : 'Error!'}
        content={message}
    />
);

const NotesApp = () => {
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

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

    // Debounce search input to limit the number of requests
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedQuery(searchQuery), 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        if (debouncedQuery.trim() !== '') {
            searchNotes(debouncedQuery);
        } else {
            fetchNotes(page);
        }
    }, [debouncedQuery, page]);

    const searchNotes = async (query) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/news/search`, {
                params: { query },
            });
            setNotes(response.data.data || []);
        } catch {
            setError('Ошибка при выполнении поиска');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) navigate('/login');
    }, [navigate]);

    useEffect(() => {
        fetchNotes(page);
    }, [page]);

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

    const fetchNotes = async (pageNum = 1) => {
        const source = axios.CancelToken.source();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_URL}/news`, {
                params: { page: pageNum, per_page: 5 },
                cancelToken: source.token,
            });
            setNotes(response.data.data); // Update the notes data
            setTotalPages(parseInt(response.data.total_pages, 10)); // Update total pages
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
            } else {
                setError('Ошибка при загрузке заметок');
            }
        } finally {
            setIsLoading(false);
        }

        return () => source.cancel('Request canceled due to component unmounting or page change.');
    };

    const fetchNoteById = async (id) => {
        setError(null);
        try {
            const response = await axios.get(`${API_URL}/news/${id}`);
            const note = response.data;
            setCurrentNote(note.data);
            setTitle(note.data.post_title || note.data.title?.rendered || '');
            setContent(note.data.post_content || note.data.content?.rendered || '');
            setIsEditing(true);
        } catch {
            setError('Ошибка при загрузке заметки');
        }
    };

    const createNote = async () => {
        setError(null);
        setSuccess(null);
        try {
            await axios.post(`${API_URL}/news`, { title, content });
            setSuccess('Заметка успешно создана!');
            fetchNotes(page);
            resetForm();
        } catch {
            setError('Ошибка при создании заметки');
        }
    };

    const updateNote = async (id) => {
        setError(null);
        setSuccess(null);
        try {
            await axios.put(`${API_URL}/news/${id}`, { title, content });
            setSuccess('Заметка успешно обновлена!');
            fetchNotes(page);
            resetForm();
        } catch {
            setError('Ошибка при обновлении заметки');
        }
    };

    const deleteNote = async (id) => {
        setError(null);
        setSuccess(null);
        try {
            await axios.delete(`${API_URL}/news/${id}`);
            setSuccess('Заметка успешно удалена!');
            fetchNotes(page);
        } catch {
            setError('Ошибка при удалении заметки');
        }
    };

    const confirmDelete = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить эту заметку?')) {
            deleteNote(id);
        }
    };

    const resetForm = () => {
        setTitle('');
        setContent('');
        setIsEditing(false);
        setCurrentNote(null);
    };

    return (
        <div>
            <h1>News App</h1>

            {error && <Notification message={error} type="error" />}
            {success && <Notification message={success} type="success" />}

            <div>
                <h2>News Posts</h2>

                <div className="search-bar">
                    <Input
                        icon="search"
                        placeholder="Поиск заметок..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {false ? (
                    <Loader active inline="centered" />
                ) : !Array.isArray(notes) ? (
                    <p>Ошибка: Заметки не являются массивом</p>
                ) : notes.length === 0 ? (
                    <p>Нет доступных заметок</p>
                ) : (
                    <List className={`data-list ${isLoading ? 'active' : ''}`}>
                        {notes.map((note) => (
                            <List.Item key={note.ID}>
                                <List.Header>{note.post_title}</List.Header>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: note.post_excerpt || note.post_content.substring(0, 150),
                                    }}
                                />
                                <Button onClick={() => fetchNoteById(note.ID)}>Редактировать</Button>
                                <Button color="red" onClick={() => confirmDelete(note.ID)}>
                                    Удалить
                                </Button>
                            </List.Item>
                        ))}
                    </List>
                )}


                <Pagination
                    totalPages={totalPages}
                    activePage={page}
                    onPageChange={(_, { activePage }) => setPage(activePage)}
                />
            </div>

            <div>
                <h2>{isEditing ? 'Редактирование заметки' : 'Создание заметки'}</h2>
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
                        <label>Название</label>
                        <Input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Содержимое</label>
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
                                'header',
                                'font',
                                'list',
                                'bold',
                                'italic',
                                'underline',
                                'strike',
                                'color',
                                'background',
                                'align',
                                'link',
                                'image',
                            ]}
                            placeholder="Введите содержимое заметки..."
                        />
                    </div>
                    <Button type="submit" primary>
                        {isEditing ? 'Сохранить изменения' : 'Создать'}
                    </Button>
                    {isEditing && (
                        <Button type="button" secondary onClick={resetForm}>
                            Отменить
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default NotesApp;
