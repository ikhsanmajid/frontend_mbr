import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { IReturnRB } from "./List"

export default function RowActions({ props, handleShow }: { props: any, handleShow: (data: IReturnRB) => void }) {
    return (
        <>
            <button className="btn btn-sm btn-success text-white me-2" onClick={() => handleShow(props.row.original)}><FontAwesomeIcon icon={faEye} style={{ color: "#ffffff" }} /> &nbsp;Lihat</button>
        </>
    )
}