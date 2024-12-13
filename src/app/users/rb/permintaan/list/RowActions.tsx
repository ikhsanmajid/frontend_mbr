import { IPermintaan } from "./List"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import React from "react"
import { faPencil } from "@fortawesome/free-solid-svg-icons"

export default function RowActions({ props, showLihatModal, showEditModal }: { props: any, showLihatModal: (data: any) => void, showEditModal: (data: any) => void }) {
    return (
        <>
            <button className="btn btn-sm btn-primary text-white my-1 mx-1" onClick={() => showLihatModal(props.row.original)}><FontAwesomeIcon icon={faEye} style={{ color: "#ffffff" }} /> &nbsp;Lihat</button>
            {props.row.original.status == "DITOLAK" && <button className="btn btn-sm btn-warning text-white my-1 mx-1" onClick={() => showEditModal(props.row.original)}><FontAwesomeIcon icon={faPencil} style={{ color: "#ffffff" }} /> Edit</button>}
        </>
    )
}