import React, {useEffect, useState} from 'react';
import {Form, Input, Button, Checkbox, Alert} from 'antd';
import {parseQueryParams} from "../../utils/baseUtils";
import axios from "axios";
import logo from '../../imgs/logo_.png';

const layout = {
    wrapperCol: { span: 24 },
};
const tailLayout = {
    wrapperCol: { offset: 16, span: 16 },
};

const Login = props => {

    const {history} = props;

    const [isAuth, setIsAuth] = useState(undefined);

    const onFinish = (values) => {
        console.log('Success:', values);

        const params = new URLSearchParams();
        params.append('username', values.username);
        params.append('password', values.password);
        axios.post('/login', params)
            .then(res => {
                setIsAuth(true);
                const data = res.data;
                // console.log(history);
                if(data.redirect){
                    history.push(data.redirect)
                }
            })
            .catch(err => setIsAuth(false))
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <div className={'login-page'}>
            <Form
                {...layout}
                className={'login-form'}
                name="Login"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item>
                    <div className="logo">
                        <img src={logo} alt={"Logo"} width={"75%"}/>
                    </div>
                </Form.Item>
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: 'Введите имя пользователя' }]}
                >
                    <Input placeholder={"Имя пользователя"}/>
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Введите пароль' }]}
                >
                    <Input.Password placeholder={"Пароль"}/>
                </Form.Item>
                {isAuth === false && (
                    <Form.Item>
                        <Alert message="Ошибка логина/пароля" type="error" />
                    </Form.Item>
                )}
                <Form.Item {...tailLayout} className={'mb-0'}>
                    <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                        Вход
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

Login.propTypes = {

};

export default Login;