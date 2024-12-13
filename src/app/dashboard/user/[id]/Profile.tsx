export default function Profile({ userInfo }: { userInfo: any }) {

    return (
        <>
            {userInfo === undefined && <h2>Gagal Menambil Info User</h2>}
            <div className="card">
                <div className="card-header">
                    User Profile {userInfo.nama}
                </div>
                <div className="card-body">
                    <div className="row g-3 align-items-center">
                        <div className="col-auto">
                            <label htmlFor="inputPassword6" className="col-form-label">Password</label>
                        </div>
                        <div className="col-auto">
                            <input type="password" id="inputPassword6" className="form-control" aria-describedby="passwordHelpInline"></input>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}