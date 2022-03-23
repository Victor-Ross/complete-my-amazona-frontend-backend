import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import NavDropdown from 'react-bootstrap/NavDropdown';

import { useStoreContext } from '../../contexts/storeContext';

export function Header() {
  const { state, signOutHandler } = useStoreContext();
  const { cart, userInfo } = state;

  return (
    <>
      <ToastContainer position="bottom-center" limit={1} />
      <header>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Nav.Link as={Link} to="/">
              <Navbar.Brand>amazona</Navbar.Brand>
            </Nav.Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto w-100 justify-content-end">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce(
                        (total, cartItem) => total + cartItem.quantity,
                        0
                      )}
                    </Badge>
                  )}
                </Link>
                {userInfo ? (
                  <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                    <NavDropdown.Item as={Link} to="/profile">
                      User Profile
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/orderhistory">
                      Order History
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <Link
                      to="#signout"
                      className="dropdown-item"
                      onClick={signOutHandler}
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </>
  );
}
