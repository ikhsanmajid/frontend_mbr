import { Modal, Button } from "react-bootstrap"
import { GetAuditTrailsNomorMBR } from "@/app/lib/admin/users/userAPIRequest";
import AuditTable from "./TableAuditTrails";
import { useEffect } from "react";

export default function ModalAuditTrail({ show, onClose, data }: { show: boolean, onClose: () => void, data: { id: number | null, nomorUrut: string | null } }) {

    const { listAuditTrails, isLoadingListAuditTrails, error, mutateListAuditTrails } = GetAuditTrailsNomorMBR(data.id);

    useEffect(() => {
        if (show && data.id) {
            mutateListAuditTrails();
        }
    }, [show, data.id, mutateListAuditTrails]);

    return (
        <>
            <Modal show={show} onHide={onClose} size="xl" style={{ zIndex: 1050 }} backdrop="static" animation={true} keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Audit Trail - {data.nomorUrut}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isLoadingListAuditTrails ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-danger">
                            Error loading audit trails: {error.message}
                        </div>
                    ) : (
                        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                            <AuditTable data={listAuditTrails.data || []} />
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="d-flex justify-content-end">
                    <Button variant="secondary" onClick={onClose}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}