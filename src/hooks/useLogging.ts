// useLogging hook code...

import { useEffect } from 'react';

const useLogging = () => {
    useEffect(() => {
        console.log('Logging initiated');
    }, []);
};

export default useLogging;
