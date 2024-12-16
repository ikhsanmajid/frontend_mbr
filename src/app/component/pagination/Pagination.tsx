export default function PaginationComponent({table, currentPage, pageCount, pageList}: {table: any, currentPage: number, pageCount: number, pageList: number[]}){
    return(
    <nav>
        <ul className="pagination">
            <li className={`page-item ${!table.getCanPreviousPage() && "disabled"}`}>
                <button className="page-link" onClick={() => table.firstPage()}>First Page</button>
            </li>
            <li className={`page-item ${!table.getCanPreviousPage() && "disabled"}`}>
                <button className="page-link" onClick={() => table.previousPage()}>Previous</button>
            </li>

            {(currentPage <= 2 || pageCount  == 5 || pageCount == 4) && pageList.slice(0, 5).map((item: any) => (
                <li key={item} className={`page-item ${currentPage == item && "active"}`}>
                    <button className="page-link" onClick={() => table.setPageIndex(item)}>{item + 1}</button>
                </li>
            ))}

            {(pageCount > 5 && currentPage > 2 && currentPage <= pageCount) && pageList.slice(((currentPage + 2 >= pageCount && currentPage + 1 !== pageCount) ? currentPage - 3 : (currentPage + 1 == pageCount) ? currentPage - 4 : currentPage - 2), currentPage + 3).map((item) => (
                <li key={item} className={`page-item ${currentPage == item && "active"}`}>
                    <button className="page-link" onClick={() => table.setPageIndex(item)}>{item + 1}</button>
                </li>
            ))}

            <li className={`page-item ${!table.getCanNextPage() && "disabled"}`}>
                <button className="page-link" onClick={() => table.nextPage()}>Next</button>
            </li>
            <li className={`page-item ${!table.getCanNextPage() && "disabled"}`}>
                <button className="page-link" onClick={() => table.lastPage()}>Last Page</button>
            </li>
        </ul>
    </nav>)
}