import { Toast, ToastContainer } from "react-bootstrap";

export default function NotificationToast({ show, onClose, variant, heading, message }: { show: boolean, onClose: () => void, variant: string, heading: string, message: string}) {
    return (
        <ToastContainer
            className="p-3"
            position={"top-end"}
            style={{ zIndex: 1000000 }}
        >
            <Toast show={show} bg={variant} onClose={onClose} style={{ zIndex: 1000000 }} delay={5000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{heading}</strong>
                </Toast.Header>
                <Toast.Body className="text-white">{message}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}