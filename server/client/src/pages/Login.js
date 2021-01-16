import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import React, { useContext, useState } from 'react'
import { Button, Form } from 'semantic-ui-react'
import { AuthContext } from '../context/auth';
import { useForm } from '../utils/hooks';

const Login = (props) => {
    const contexts = useContext(AuthContext);
    const [errors, setErrors] = useState({});
    const {onChange, onSubmit, values} = useForm(loginUserCallback, {
        username: '',
        password: ''
    });

    const [loginUser, {loading,error}] = useMutation(LOGIN_USER, {
        update(cache,result) {
            console.log(result);
            props.history.push('/');
            contexts.login(result.data.login);
        },
        onError(err) {
            console.log(err.graphQLErrors);
            console.log(err.graphQLErrors[0].extensions.exception.errors);
            setErrors(err.graphQLErrors[0].extensions.exception.errors);
        },
        variables: values
    });

    // function 은 hoisting에 의해서 최상단으로 끌어올려진다
    function loginUserCallback() {
        loginUser();
    }

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? "loading" : ''}>
                <h1>로그인</h1>
                <Form.Input
                    label="Username"
                    placeholder="Username..."
                    name="username"
                    type="text"
                    value={values.username}
                    error={errors.username ? true : false}
                    onChange={onChange}
                />
                <Form.Input
                    label="Password"
                    placeholder="Password..."
                    name="password"
                    type="text"
                    value={values.password}
                    error={errors.password ? true : false}
                    onChange={onChange}
                />
                <Button type='submit' primary>Submit</Button>
            </Form>
            {Object.keys(errors).length > 0 && (
                <div className="ui error message">
                    <ul className="list">
                        {Object.values(errors).map((value) => (
                            <li key={value}>{value}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ) {
        login(
            username: $username
            password: $password
        ) {
            id
            email
            username
            createdAt
            token
        }
    }
`

export default Login;
