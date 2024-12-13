import { Suspense } from "react";
import ServerOffline from "./offline";


export default function Offline(){
    return(
        <Suspense>
            <ServerOffline/>
        </Suspense>
    )
}
