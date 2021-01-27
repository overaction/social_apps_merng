import React, { useContext, useState } from 'react'
import { Menu } from 'semantic-ui-react'
import {Link,useLocation} from 'react-router-dom';
import { AuthContext } from '../context/auth';
import Alert from './Alert';
const MenuBar = () => {
    const location = useLocation();
    const path = location.pathname.substr(1);
    const [activeItem, setActiveItem] = useState(path);
    console.log(path);
    const handleItemClick = (e, { name }) => setActiveItem(name);

    const contexts = useContext(AuthContext);

    const menuBar = contexts.user ? (
            <Menu pointing secondary color="teal" size="massive">
                <Menu.Item
                    name={contexts.user.username}
                    active
                    onClick={handleItemClick}
                    as={Link}
                    to="/"
                />
                <Menu.Menu position="right">
                    <Alert />
                    <Menu.Item
                        name="logout"
                        onClick={contexts.logout}
                        as={Link}
                        to="/login"
                    />
                </Menu.Menu>
            </Menu>
    ) : (
        <div>
            <Menu pointing secondary color="teal" size="massive">
                <Menu.Item
                    name="home"
                    active={activeItem === ""}
                    onClick={handleItemClick}
                    as={Link}
                    to="/"
                />
                <Menu.Menu position="right">
                    <Menu.Item
                        name="login"
                        active={activeItem === "login"}
                        onClick={handleItemClick}
                        as={Link}
                        to="/login"
                    />
                    <Link to="/register">
                    <Menu.Item
                        name="register"
                        active={activeItem === "register"}
                        onClick={handleItemClick}
                    />
                    </Link>
                </Menu.Menu>
            </Menu>
        </div>
    )
    return menuBar;
};

export default MenuBar;