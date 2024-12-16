import { IUser } from "./ListUsers"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons"
import React from "react"

export default function RowActions({props, handleEdit, handleDelete}: {props: any, handleEdit: (data: IUser) => void, handleDelete: (data: IUser) => void}){
    return (
        <>
            <button className="btn btn-sm btn-warning text-white my-1 mx-1" onClick={() => handleEdit(props.row.original)}><FontAwesomeIcon icon={faPenToSquare} style={{ color: "#ffffff" }} /> &nbsp;Edit</button>
            { props.row.original.isAdmin == false && <button className="btn btn-sm btn-danger text-white" onClick={() => handleDelete(props.row.original)}><FontAwesomeIcon icon={faTrashCan} style={{ color: "#ffffff" }} /> &nbsp;Delete</button> }
        </>
    )
}