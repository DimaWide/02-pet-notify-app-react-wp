import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Styles for Quill
import { Button, Input, List, Pagination, Message, Loader, Icon } from 'semantic-ui-react'; // Importing Semantic UI components

const API_URL = 'http://dev.wp-blog/wp-json/myapi/v1';

const Notification = ({ message, type }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (message) {
            setShow(true); 
            const timer = setTimeout(() => {
                setShow(false); 
            }, 2000); 
            
            return () => clearTimeout(timer);
        }
    }, [message]); 
    
    if (!message) return null;

    return (
        <div className={`notification ${show ? 'show' : ''} ${type}`}>
            <Message
                success={type === 'success'}
                error={type === 'error'}
                header={type === 'success' ? 'Success!' : 'Error!'}
                content={message}
            />
        </div>
    );
};

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
            setError('Error during search');
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
                setError('Error loading notes');
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
            setError('Error loading note');
        }
    };

    const createNote = async () => {
        setError(null);
        setSuccess(null);
        try {
            await axios.post(`${API_URL}/news`, { title, content });
            setSuccess('Note successfully created!');
            fetchNotes(page);
            resetForm();
        } catch {
            setError('Error creating note');
        }
    };

    const updateNote = async (id) => {
        setError(null);
        setSuccess(null);
        try {
            await axios.put(`${API_URL}/news/${id}`, { title, content });
            setSuccess('Note successfully updated!');
            fetchNotes(page);
            resetForm();
        } catch {
            setError('Error updating note');
        }
    };

    const deleteNote = async (id) => {
        setError(null);
        setSuccess(null);
        try {
            await axios.delete(`${API_URL}/news/${id}`);
            setSuccess('Note successfully deleted!');
            fetchNotes(page);
            resetForm();
        } catch {
            setError('Error deleting note');
        }
    };

    const confirmDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this note?')) {
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
        <div className="cmp-notes p-4 bg-gray-100 min-h-screen" id='id'>
            <div className="data-container swd-container">
                {/* Notification rendering */}
                {error && <Notification message={error} type="error" />}
                {success && <Notification message={success} type="success" />}

                <div className="data-row">
                    <div className="data-sidebar bg-white p-6 rounded-lg shadow-md mb-8">
                        <h2 className="data-title ext-2xl font-semibold mb-4">Listing </h2>

                        <div className="mb-6">
                            <Input
                                icon="search"
                                placeholder="Search notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full data-search"
                            />
                        </div>

                        {false ? (
                            <Loader active inline="centered" />
                        ) : notes.length === 0 ? (
                            <p className="text-gray-500">No available notes</p>
                        ) : (
                            <List divided className={`data-list space-y-4 ${isLoading ? "active" : ""}`}>
                                {notes.map((note) => (
                                    <List.Item
                                        key={note && note.ID} // Проверка на null перед доступом
                                        className={`data-sidebar-item bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 cursor-pointer ${currentNote && currentNote.ID === note.ID ? "active" : "" // Проверка на null для currentNote
                                            }`}


                                        onClick={() => fetchNoteById(note.ID)} // Trigger edit on click
                                    >
                                        <List.Header className="text-lg font-semibold">
                                            {note.post_title}
                                        </List.Header>
                                        <p
                                            dangerouslySetInnerHTML={{
                                                __html: note.post_excerpt,
                                            }}
                                            className="text-gray-600"
                                        />

                                    </List.Item>
                                ))}
                            </List>
                        )}

                        <Pagination
                            totalPages={totalPages} // Убедитесь, что это значение — число > 0
                            activePage={page} // Текущая страница
                            onPageChange={(_, data) => setPage(data.activePage)} // Обработчик смены страницы
                            boundaryRange={0} // Убираем кнопки первой/последней страницы
                            siblingRange={1} // Показываем соседние страницы
                            ellipsisItem={null} // Убираем многоточия
                            firstItem={null} // Убираем кнопку "первая"
                            lastItem={null} // Убираем кнопку "последняя"
                            prevItem={{ content: '<', icon: false }} // Настраиваем "назад"
                            nextItem={{ content: '>', icon: false }} // Настраиваем "вперед"
                            size="mini" // Уменьшаем размер кнопок
                            className="mt-4 pagination-center"
                        />
                    </div>

                    <div className="data-content bg-white p-6 rounded-lg shadow-md">
                        <h2 className="data-title text-2xl font-semibold mb-4">
                            {isEditing ? 'Edit Note' : 'Create Note'}
                        </h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (isEditing && currentNote) {
                                    updateNote(currentNote.ID);
                                } else {
                                    createNote();
                                }
                            }}
                        >
                            <div className="mb-4">
                                <label className="block font-medium mb-2">Title</label>
                                <Input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="mb-6">
                                <label className="data-content-title block font-medium mb-2">Content</label>
                                <ReactQuill
                                    value={content}
                                    onChange={setContent}
                                    theme="snow"
                                    style={{ width: '100%' }} // Установим 100% ширины и минимальную высоту
                                    modules={{
                                        toolbar: [
                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            [{ 'align': [] }],
                                            ['bold', 'italic', 'underline'],
                                            ['link'],
                                            [{ 'indent': '-1' }, { 'indent': '+1' }],
                                            [{ 'color': [] }, { 'background': [] }],
                                            ['image']
                                        ],
                                    }}
                                />
                            </div>

                            <div className="flex justify-end">
                                <Button
                                    className='data-btn-submit'
                                    type="submit" primary>
                                    {isEditing ? 'Save Changes' : 'Create Note'}
                                </Button>
                                {/* Delete Button */}
                                {isEditing && currentNote && (
                                    <Button
                                        type="button"
                                        color="red"
                                        className='data-btn-delete-1'
                                        onClick={() => confirmDelete(currentNote.ID)}
                                    >    <Icon name="trash" />
                                        Delete
                                    </Button>
                                )}

                                {isEditing && (
                                    <Button
                                        type="button"
                                        onClick={resetForm}
                                        color="grey"
                                        className='data-btn-cansel'
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesApp;
