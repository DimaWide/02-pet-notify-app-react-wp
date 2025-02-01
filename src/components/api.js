// api.js
import axios from 'axios';

const API_URL = 'http://dev.wp-blog/wp-json/myapi/v1';

export const fetchNotes = async (pageNum = 1) => {
    const source = axios.CancelToken.source();
    try {
        const response = await axios.get(`${API_URL}/news`, {
            params: { page: pageNum, per_page: 5 },
            cancelToken: source.token,
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
        } else {
            throw new Error('Error loading notes');
        }
    } finally {
        source.cancel('Request canceled due to component unmounting or page change.');
    }
};

export const fetchNoteById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/news/${id}`);
        return response.data;
    } catch {
        throw new Error('Error loading note');
    }
};

export const createNote = async (title, content) => {
    try {
        await axios.post(`${API_URL}/news`, { title, content });
    } catch {
        throw new Error('Error creating note');
    }
};

export const updateNote = async (id, title, content) => {
    try {
        await axios.put(`${API_URL}/news/${id}`, { title, content });
    } catch {
        throw new Error('Error updating note');
    }
};

export const deleteNote = async (id) => {
    try {
        await axios.delete(`${API_URL}/news/${id}`);
    } catch {
        throw new Error('Error deleting note');
    }
};
