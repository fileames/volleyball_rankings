import { useState, useEffect} from "react"
import TableRows from "./TableRows"

function AddDeleteTableRows({countryList, rowsData, setRowsData}){
    //const [rowsData, setRowsData] = useState([]);
 
    const addTableRows = ()=>{
  
        const rowsInput={
            team1:'USA',
            team2:'USA',
            score:'0'  
        } 
        setRowsData([...rowsData, rowsInput])
      
    }
    
   const deleteTableRows = (index)=>{
        const rows = [...rowsData];
        rows.splice(index, 1);
        setRowsData(rows);
   }
 
   const handleChange = (index, evnt)=>{
    
    const { name, value } = evnt.target;
    const rowsInput = [...rowsData];
    rowsInput[index][name] = value;
    setRowsData(rowsInput);
  
 
 
}

useEffect(() => {
    console.log(rowsData);
  }, [rowsData]);

    return(
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                <table className="table">
                    <thead>
                      <tr>
                          <th>First Team</th>
                          <th>Second Team</th>
                          <th>Score</th>
                          <th><button className="btn btn-outline-success" onClick={addTableRows} >+</button></th>
                      </tr>
                    </thead>
                   <tbody>
                   <TableRows countryList={countryList} rowsData={rowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} />
                   </tbody> 
                </table>
                </div>
                <div className="col-sm-2">
                </div>
            </div>
        </div>
    )
}
export default AddDeleteTableRows