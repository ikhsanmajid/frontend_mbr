import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { IPermintaan } from "./PermintaanTable"
import { useSession } from "next-auth/react"
import { faTrash } from "@fortawesome/free-solid-svg-icons"

export default function RowActions({ props, handleShowLihat, handleShowDelete }: { props: any, handleShowLihat: (data: IPermintaan) => void, handleShowDelete: (data: IPermintaan) => void }) {
    const session = useSession()

    return (
        <>
            <button className="btn btn-sm btn-success text-white me-2" onClick={() => handleShowLihat(props.row.original)}><FontAwesomeIcon icon={faEye} style={{ color: "#ffffff" }} /> &nbsp;Lihat</button>
            
            {session.data?.user?.bagian_jabatan[0].nama_jabatan === "Officer" &&
                session.data?.user?.bagian_jabatan[0].nama_bagian === "Document Control" &&
                (<button
                    className="btn btn-sm btn-danger text-white me-2"
                    onClick={() => handleShowDelete(props.row.original)}>
                    <FontAwesomeIcon
                        icon={faTrash}
                        style={{ color: "#ffffff" }} />
                    &nbsp;Hapus
                </button>)
            }
        </>
    )
}