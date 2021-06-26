import React, { useEffect, useState } from "react";
import Pagination from "../customerList/pagination"
import range from 'lodash/range';
import isEqual from 'lodash/isEqual';


export function useCustomerList(props) {
  const [list, setList] = useState([]);
  const [listCopy, setListCopy] = useState([]);
  const [pageLoader, setPageLoader] = useState(true);
  const [paginationValue, setPaginationValue] = useState({
    offset: 0,
    limit: 5,
});
  const [pagination, setPagination] = useState({
    startIndex: 0,
    pageSize: 5,
    activePageNumber: 1,
});

  useEffect(() => {
    const url = "https://intense-tor-76305.herokuapp.com/merchants";
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        const list = await response.json();
        setListCopy(list)
        findMaxMin(list);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    findMaxMin(listCopy)

  },[paginationValue])

  function pageChangeHandler(pageSize, activePageNumber) {
    let listClone = JSON.parse(JSON.stringify(list));
    let paginationClone = JSON.parse(JSON.stringify(pagination));
    
    let pageSizeChanged = pageSize !== paginationClone.pageSize;
    let totalPages = listCopy.length;
    if (pageSizeChanged) {
        if (totalPages < activePageNumber) {
            activePageNumber = totalPages;
        }
    } else if (activePageNumber === "...") {
        activePageNumber = Math.ceil((getPageNumbers()[3] - 1) / 2);
    }
    let endIndex = pageSize * activePageNumber;
    let startIndex = endIndex - pageSize;
    setPagination({
        startIndex: startIndex,
        pageSize: pageSize,
        activePageNumber: activePageNumber,
    })
    setList(listClone)
    setPaginationValue({
        offset: startIndex,
        limit: pageSize
    })

};

function getPageNumbers(){
  if (listCopy.length < 6)
      return range(1, listCopy.length + 1)
  else {
      let start = pagination.activePageNumber < 4 ? 1 : pagination.activePageNumber - 2
      let end = pagination.activePageNumber < 4 ? 6 : (pagination.activePageNumber + 3 > listCopy.length) ? listCopy.length + 1 : pagination.activePageNumber + 3
      if (end - start < 5)
          start = end - 5
      let arr = range(start, end)
      if (start !== 1)
          arr = [1, "...", ...arr]
      return arr
  }
}

  function findMaxMin(list, key) {
      
    if(key){
        setPageLoader(true)
        let index = key.split('_').slice(-1)[0]

        if(list[index].maxBid){
            list[index]["bidAmount"] = list[index].bids[list[index].bids.length-1] === undefined ? "No Bid" : list[index].bids[list[index].bids.length-1].amount;
            list[index].maxBid = false
        }
        else{

            list[index]["bidAmount"] = list[index].bids[0] === undefined ? "No Bid" : list[index].bids[0].amount;
            list[index].maxBid = true
        }
        list.sort((a, b) => b.bidAmount - a.bidAmount);
    }
    else{
        list.map((item) => {
          item.bids.sort((a, b) => b.amount - a.amount);
            item["bidAmount"] = item.bids[0] === undefined ? "No Bid" : item.bids[0].amount;
            item["maxBid"] = true
        });

        list.sort((a, b) => b.bidAmount - a.bidAmount);
        list = list.slice(paginationValue.offset,paginationValue.limit + paginationValue.offset)
    }
    
     

    const customerList = [...list]
    setList(customerList);
    setPageLoader(false)
  }

  return (
    <div>
      <div className="list-box">
        <div className="list-header d-flex">
          <p className="flex-25">Coustmer Name</p>
          <p className="flex-20">Email</p>
          <p className="flex-15">Phone</p>
          <p className="flex-15">Premium</p>
          <p className="flex-25">Max/Min Bid</p>
        </div>

        <div className="list-body ">
          {pageLoader ? (
            <div className="pageLoader"></div>
          ) : 
          !list.length > 0 ? (
            <div className="list-no-data">
              <p>No Data to Display !</p>
            </div>
          ) : (
            list.map((item, index) => 
            (
              <div className="list-item mr-b-20" key={index}>
                <ul className="list-style-none d-flex ">
                  <li className="flex-25">
                    <h2 className="text-truncate">
                      {item.firstname + " " + item.lastname}
                    </h2>
                  </li>
                  <li className="flex-20">
                    <p className="text-primary text-truncate">
                      <span className="mr-r-5 text-green">
                        <i className="fas fa-envelope"></i>
                      </span>
                      {item.email ? item.email : "N/A"}
                    </p>
                  </li>
                  <li className="flex-15">
                    <p>
                      <span className="mr-r-5 text-green">
                        <i className="fas fa-phone"></i>
                      </span>{" "}
                      {item.phone ? item.phone : "N/A"}
                    </p>
                  </li>
                  <li className="flex-15">
                    <p>{item.hasPremium ? "Yes" : "No"}</p>
                  </li>
                  <li className="flex-25">
                      <p>{item.bidAmount}
                      {item.bidAmount !== "No Bid" &&
                        <span className="toggle-button"  >
                          <span>Min</span>
                            <button type="button" onClick={() => findMaxMin(list,`Min_${index}`)} className={`btn btn-toggle ${!item.maxBid  ? "" : "active"}`}  >
                            
                                <div className="handle"></div>
                            </button>
                        <span>Max</span>
                        </span>}
                        </p>
                      
                  </li>
                </ul>
              </div>
            ))
          )}
        </div>

        {listCopy.length > 0 &&
          <Pagination
            pageChangeHandler={pageChangeHandler}
            data={list}
            activePageNumber={pagination.activePageNumber}
            totalItemsCount={listCopy.length}
            pageSize={pagination.pageSize}
        />}
      </div>
    </div>
  );
}

export default useCustomerList;
