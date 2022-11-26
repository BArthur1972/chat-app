import React from "react";
import { Nav, Navbar, Container, Button, NavDropdown } from "react-bootstrap";
import { useDeleteUserMutation, useLogoutUserMutation } from "../services/appApi";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";
import ProfileImage from "./ProfileImage";

function Navigation() {
    const user = useSelector((state) => state.user);
    const [logoutUser] = useLogoutUserMutation();
    const [deleteUser] = useDeleteUserMutation();

    // Logout a user 
    async function handleLogout(e) {
        e.preventDefault();
        await logoutUser(user);

        // navigate to the home page
        window.location.replace("/");
    }

    // Delete a users account
    async function handleDeleteAccount(e) {
        e.preventDefault();

        await deleteUser(user);

        // navigate to the home page
        window.location.replace("/");
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <LinkContainer to="/">
                    <Navbar.Brand>
                        <img src={logo} alt="" style={{ width: 50, height: 50 }} />
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">
                        {!user && (
                            <LinkContainer to="/login">
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        )}
                        <LinkContainer to="/chat">
                            <Nav.Link>Chat</Nav.Link>
                        </LinkContainer>
                        {user && (
                            <NavDropdown
                                title={
                                    <>
                                        <ProfileImage userObject={user} />
                                        {user.name}
                                    </>
                                }
                                id="basic-nav-dropdown"
                            >
                                <NavDropdown.Item onClick={handleDeleteAccount}>Delete Your Account</NavDropdown.Item>
                                <NavDropdown.Item>
                                    <Button variant="danger" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navigation;
