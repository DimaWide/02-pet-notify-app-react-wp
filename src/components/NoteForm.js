// NoteForm.js
import React from 'react';
import { Button, Input, Icon } from 'semantic-ui-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const NoteForm = ({ title, setTitle, content, setContent, isEditing, currentNote, handleSubmit, resetForm, confirmDelete }) => {

    return (
        <div className="data-content bg-white p-6 rounded-lg shadow-md">
            <h2 className="data-title text-2xl font-semibold mb-4">
                {isEditing ? 'Edit Note' : 'Create Note'}
            </h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block font-medium mb-2">Title</label>
                    <Input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full data-post-title"
                    />
                </div>

                <div className="mb-6">
                    <label className="data-content-title block font-medium mb-2">Content</label>
                    <ReactQuill
                        value={content}
                        onChange={setContent}
                        theme="snow"
                        style={{ width: '100%' }}
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
                        className="data-btn-submit"
                        type="submit"
                        primary
                    >
                        {isEditing ? 'Save Changes' : 'Create Note'}
                    </Button>

                    {isEditing && (
                        <Button
                            type="button"
                            onClick={resetForm}
                            color="grey"
                            className="data-btn-cansel"
                        >
                            Cancel
                        </Button>
                    )}

                    {isEditing && currentNote && (
                        <Button
                            type="button"
                            color="red"
                            className="data-btn-delete-1"
                            onClick={() => confirmDelete(currentNote.ID)}
                        >
                            <Icon name="trash" />
                            Delete
                        </Button>
                    )}

                    {currentNote && currentNote.post_name && (
                        <Button
                            as="a"
                            href={'http://dev.wp-blog/news/' + currentNote.post_name}
                            target="_blank"
                            rel="noopener noreferrer"
                            color="blue"
                            className="data-btn-view"
                        >
                            <Icon name="external alternate" />
                            View in WordPress
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default NoteForm;
