import { useState, useEffect} from "react"
import TableRows from "./TableRows"

function AddDeleteTableRows({countryList, rowsData, setRowsData,setMWF,MWF}){
    //const [rowsData, setRowsData] = useState([]);
 
    const addTableRows = ()=>{
  
        const rowsInput={
            team1:'Italy',
            team2:'Italy',
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

    const handleTournamentChange = (evnt)=>{
        setMWF(parseFloat(evnt.target.value));
    }


    return(
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <h5>Select The Tournament</h5>
                    <select
                    value={MWF}
                    onChange={handleTournamentChange} name="tournament" className="form-control"
                    >
                        <option value={"50"} >{"Olympic Games"}</option>
                        <option value={"45"} >{"World Championship"}</option>
                        <option value={"40"} >{"Volleyball Nations League"}</option>
                        <option value={"35"} >{"OQTs / World Cup"}</option>
                        <option value={"35"} >{"Continental Championship"}</option>
                        <option value={"20"} >{"Volleyball Challenger Cup"}</option>     
                        <option value={"17.5"} >{"Continental Championship QT"}</option>   
                        <option value={"10"} >{"Other annual official events"}</option>                      
                    </select>
                    <div className="mt-5 mb-5">

                    </div>
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