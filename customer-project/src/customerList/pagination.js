/**
 *
 * Pagination
 *
 */

 import React, { useState} from 'react';
 // import PropTypes from 'prop-types';
 // import styled from 'styled-components';
 import range from 'lodash/range';
 import isEqual from 'lodash/isEqual';
 
 let PAGE_SIZE_OPTIONS = [5,10, 20, 30,40, 50]
 
 
 function Pagination(props) {
   let {data, pageChangeHandler, pagination,pageSize, activePageNumber, totalItemsCount} = props
   data = data || []
   const [state, setState] = useState({
       pageSize: pageSize,
       activePageNumber: activePageNumber,
       tableData:data,
       totalItemsCount: totalItemsCount ,
       completeData: data
   })
   {console.log(state.totalItemsCount)}
   let totalPages = Math.ceil(state.totalItemsCount / state.pageSize)
   let dataChanged = !isEqual(data, state.completeData)
 //   useEffect(() =>{
 //     props.getPages(state.tableData)
 //   },[state.tableData])
 
   if (dataChanged) {
       let tableData = data;
       if (pagination) {
           let endIndex = (state.pageSize * state.activePageNumber);
           let startIndex = endIndex - state.pageSize
           tableData = data.slice(startIndex, endIndex)
       }
       setState({ ...state, tableData, completeData: data })
   }
 
   let inBuiltPageChangeHandler = (pageSize, activePageNumber) => {
       let pageSizeChanged = pageSize !== state.pageSize
       if (pageSizeChanged) {
           let totalPages = Math.ceil(state.totalItemsCount / pageSize)
           if (totalPages < activePageNumber) {
               activePageNumber = totalPages
           }
       } else if (activePageNumber === "...") {
           activePageNumber = Math.ceil((getPageNumbers()[3] - 1) / 2)
       }
       let endIndex = (pageSize * activePageNumber);
       let startIndex = endIndex - pageSize
       let tableData = data.slice(startIndex, endIndex)
       setState({
           ...state,
           pageSize,
           tableData,
           activePageNumber
       })
   }
 
   let getPageNumbers = () => {
       if (totalPages < 6)
           return range(1, totalPages + 1)
       else {
           let start = state.activePageNumber < 4 ? 1 : state.activePageNumber - 2
           let end = state.activePageNumber < 4 ? 6 : (state.activePageNumber + 3 > totalPages) ? totalPages + 1 : state.activePageNumber + 3
           if (end - start < 5)
               start = end - 5
           let arr = range(start, end)
           if (start !== 1)
               arr = [1, "...", ...arr]
           return arr
       }
   }
 
   pageChangeHandler = pageChangeHandler || inBuiltPageChangeHandler
 
   let getLastPageNumber = () => {
    console.log(state.totalItemsCount,"oafaf")
       if (state.activePageNumber * state.pageSize > state.totalItemsCount) {
           return state.totalItemsCount
       }
       return state.activePageNumber * state.pageSize
   }
 
   return (
       <React.Fragment>
           <div className="d-flex align-items-center pagination-box">
             <div className="flex-50">
                 <h6>Showing {(((state.activePageNumber * state.pageSize) - state.pageSize) + 1)} to {getLastPageNumber()} of
                     <strong className="text-theme"> {state.totalItemsCount} rows</strong>
                     <span className="mr-l-10 mr-r-10">|</span>
                     Records Per Page:
                     <button className="btn btn-light dropdown-toggle" type="button" data-toggle="dropdown">{state.pageSize} </button>
                     <ul className="dropdown-menu">
                         {PAGE_SIZE_OPTIONS.map((size, index) => (
                             <li key={index} onClick={() => size !== state.pageSize && pageChangeHandler(size, state.activePageNumber)}>{size}</li>
                         ))}
                     </ul>
                 </h6>
             </div>
             <div className="flex-50">
                 <ul className="list-style-none d-flex justify-content-end">
                     <li className="page-item" onClick={() => state.activePageNumber > 1 && pageChangeHandler(state.pageSize, state.activePageNumber - 1)}>
                         <a className={`page-link ${state.activePageNumber > 1 ? "bg-theme text-white" : "text-light-gray"}`}>
                             <i className="far fa-angle-double-left mr-r-5"></i>Previous
                     </a>
                     </li>
                     {getPageNumbers().map((pageNumber, index) => (
                         <li key={index} className="page-item" onClick={() => {pageNumber !== state.activePageNumber && pageChangeHandler(state.pageSize, pageNumber)
                         }}>
                             <a className={`page-link ${state.activePageNumber === pageNumber ? "bg-theme text-white" : "text-gray"}`}>{pageNumber}</a>
                         </li>
                     ))}
                     <li className="page-item"
                         onClick={() => state.activePageNumber < totalPages && pageChangeHandler(state.pageSize, state.activePageNumber + 1)}>
                         <a className={`page-link ${state.activePageNumber < totalPages ? "bg-theme text-white" : "text-light-gray"}`}>
                             Next<i className="far fa-angle-double-right mr-l-5"></i>
                         </a>
                     </li>
                     <h6> Go to Page :
                     <button className="btn btn-light dropdown-toggle" type="button" data-toggle="dropdown"> {state.activePageNumber} </button>
                         <ul className="dropdown-menu">
                             {range(1, totalPages + 1).map((pageNumber, index) => (
                                 <li key={index} onClick={() => pageNumber !== state.activePageNumber && pageChangeHandler(state.pageSize, pageNumber)}>{pageNumber}</li>
                             ))}
                         </ul>
                     </h6>
                 </ul>
             </div>
         </div>
       </React.Fragment>
   );
 }
 
 export default Pagination;
 