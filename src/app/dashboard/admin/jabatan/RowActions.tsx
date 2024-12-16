import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons"
import { Jabatan } from "./JabatanTable"

export default function RowActions({ props, handleEdit, handleDelete }: { props: any, handleEdit: (data: Jabatan) => void, handleDelete: (data: Jabatan) => void }) {
    return (
        <>
            <button className="btn btn-sm btn-warning text-white me-2" onClick={() => handleEdit(props.row.original)}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "#ffffff" }} /> &nbsp;Edit</button>
            <button className="btn btn-sm btn-danger text-white" onClick={() => handleDelete(props.row.original)}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "#ffffff" }} /> &nbsp;Delete</button>
        </>
    )
}