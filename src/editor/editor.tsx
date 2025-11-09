import React, { useState, useEffect, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { Engine, EngineOptions } from '../engine';
import { initializeGame } from '../example-game';

export const EngineContext = React.createContext<Engine | null>(null);

function RendererComponent({ containerId }: { containerId: string }) {
    const engine = useContext(EngineContext);

    useEffect(() => {
        console.log(engine);
        if (!engine) return;
    }, [engine]);

    return <div id={containerId} style={{ flex: 1 }} />;
}

export default function EditorApp() {
    const [engine, setEngine] = useState<Engine | null>(null);

    useEffect(() => {
        const createdEngine = new Engine(document.getElementById('renderer')!, {
            rendererParameters: {
                antialias: true,
                alpha: false,
            },
        });

        initializeGame(createdEngine);

        setEngine(createdEngine);

        return () => {
            setEngine(null);
        };
    }, []);

    return (
        <EngineContext.Provider value={engine}>
            <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
                <RendererComponent containerId="renderer" />
                <div style={{ width: 300, borderLeft: '1px solid #ddd', padding: 12 }}>
                    <h3>Inspector</h3>
                    <button onClick={() => console.log('scene', engine)}>Log Scene</button>
                </div>
            </div>
        </EngineContext.Provider>
    );
}

// mount
const root = createRoot(document.getElementById('root')!);
root.render(<EditorApp />);
