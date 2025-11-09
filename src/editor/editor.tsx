import React from 'react';
import ReactDOM from 'react-dom/client';

export default class Editor extends React.Component {
    render() {
        return <h1>Hello, Web Game Editor!</h1>;
    }
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <React.StrictMode>
        <Editor />
    </React.StrictMode>
);