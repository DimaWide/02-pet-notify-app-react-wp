// PaginationComponent.js
import React from 'react';
import { Pagination } from 'semantic-ui-react';

const PaginationComponent = ({ totalPages, activePage, onPageChange }) => {
    return (
        <Pagination
            totalPages={totalPages}
            activePage={activePage}
            onPageChange={onPageChange}
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
    );
};

export default PaginationComponent;
