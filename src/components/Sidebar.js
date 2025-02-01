// Sidebar.js
import React from 'react';
import { List, Loader } from 'semantic-ui-react';
import PaginationComponent from './PaginationComponent';

const Sidebar = ({ notes, isLoading, currentNote, fetchNoteById, totalPages, activePage, onPageChange }) => {
    return (
        <div className="data-sidebar bg-white p-6 rounded-lg shadow-md mb-8">
            <h2 className="data-title ext-2xl font-semibold mb-4">Listing</h2>

            {isLoading ? (
                <Loader active inline="centered" />
            ) : notes.length === 0 ? (
                <p className="text-gray-500">No available notes</p>
            ) : (
                <List divided className={`data-list space-y-4 ${isLoading ? "active" : ""}`}>
                    {notes.map((note) => (
                        <List.Item
                            key={note && note.ID}
                            className={`data-sidebar-item bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 cursor-pointer ${currentNote && currentNote.ID === note.ID ? "active" : ""}`}
                            onClick={() => fetchNoteById(note.ID)}
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

            <PaginationComponent
                totalPages={totalPages}
                activePage={activePage}
                onPageChange={onPageChange}
            />
        </div>
    );
};

export default Sidebar;
