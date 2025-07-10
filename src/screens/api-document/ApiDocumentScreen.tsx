import { BaseSettingsScreen } from '@components/ui/BaseSettingsScreen';
import { TkButton } from '@components/ui/TkButton';
import { TkCard } from '@components/ui/TkCard';
import { Button } from 'primereact/button';
import React from 'react';

const API_DOCUMENT_URL = 'https://graphql-api-docs-xi.vercel.app/';

const ApiDocumentScreen: React.FC = () => {
    return (
        <BaseSettingsScreen>
        <TkCard
            header={
                <div className="flex p-3 align-items-center card-flat">
                    <h1 className="mt-0 mr-3 mb-0 ml-0">GraphQL API Documentation</h1>
                </div>
            }
        >
            <div style={{ padding: 4}}>
                <p>Access the API documentation by clicking the link below:</p>
               
               <TkButton><a
                    href={API_DOCUMENT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit' }}
                >
                    Go to GraphQL API Documentation
                </a>
                </TkButton> 
            </div>
        </TkCard>
        </BaseSettingsScreen>
    );
};

export default ApiDocumentScreen;