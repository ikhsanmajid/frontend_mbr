import { Form, Button, Spinner, FloatingLabel, Container, Row, Col } from "react-bootstrap"
import { useState } from "react"

export default function LoginForm({ handleSubmit, isLoading }: { handleSubmit: any, isLoading: boolean }) {
    const [showPassword, setShowPassword] = useState<boolean>(false)
    return (
        <Container>
            <Row className="justify-content-center">
                <Col xs={12} sm={8} md={6} lg={4}>
                    <div className="w-100">
                        <h3>Login</h3>
                        <Form className="shadow p-3 mb-5 mt-2 bg-body-tertiary rounded" onSubmit={(e) => handleSubmit(e)}>
                            <FloatingLabel label="Alamat Email" className="mb-3">
                                <Form.Control type="email" id="floatingEmail" name="email" placeholder="Enter email" />
                            </FloatingLabel>

                            <Form.Group className="mb-3">
                                <FloatingLabel label="Password" className="mb-3">
                                    <Form.Control type={`${showPassword ? "text" : "password"}`} id="floatingPassword" name="password" placeholder="Enter password" />
                                </FloatingLabel>
                                <Form.Check
                                    type="checkbox"
                                    label="Show Password"
                                    onClick={(e) => {
                                        const checked = e.currentTarget.checked
                                        setShowPassword(checked)
                                    }}>
                                </Form.Check>
                            </Form.Group>

                            <Form.Group className="d-flex justify-content-end">
                                {!isLoading ? <Button variant="primary" type="submit">
                                    Login
                                </Button> : <Button variant="primary" type="submit" disabled>
                                    Login&nbsp;&nbsp;
                                    <Spinner animation="border" role="status" size="sm">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner>
                                </Button>}
                            </Form.Group>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}