import { useState } from 'react';

export const useForm = (callback, initailState = {}) => {
    const [values, setValues] = useState(initailState);
    const onChange = (e) => {
        setValues({
            ...values,
            [e.target.name]:e.target.value
        })
    };

    const onSubmit = (e) => {
        e.preventDefault();
        callback();
    }

    return {
        onChange,
        onSubmit,
        values
    }
}