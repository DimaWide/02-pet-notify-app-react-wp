// src/components/NotesList.js
import React from 'react';
import { List, Pagination, Loader, Icon } from 'semantic-ui-react';

const NotesList = ({ notes, isLoading, page, totalPages, onPageChange, onNoteClick }) => {
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
                            className={`data-sidebar-item bg-gray-50 p-4 rounded-lg shadow hover:bg-gray-100 cursor-pointer`}
                            onClick={() => onNoteClick(note.ID)}
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
                totalPages={totalPages}
                activePage={page}
                onPageChange={(_, data) => onPageChange(data.activePage)}
                boundaryRange={0}
                siblingRange={1}
                ellipsisItem={null}
                firstItem={null}
                lastItem={null}
                prevItem={{ content: '<', icon: false }}
                nextItem={{ content: '>', icon: false }}
                size="mini"
                className="mt-4 pagination-center"
            />
        </div>
    );
};

export default NotesList;
