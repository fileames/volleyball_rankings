function TableRows({rowsData, deleteTableRows, handleChange, countryList}) {
    return(
        
        rowsData.map((data, index)=>{
            const {team1, team2, score}= data;
            return(
                <tr key={index}>
                <td>
                <select
            value={team1}
            onChange={(evnt)=>(handleChange(index, evnt))} name="team1" className="form-control"
            >
            {countryList.map(( value , index) => <option value={value} >{value}</option>)}
            </select>
                </td>
                <td>
                    <select
            value={team2}
            onChange={(evnt)=>(handleChange(index, evnt))} name="team2" className="form-control"
            >
            {countryList.map(( value , index) => <option value={value} >{value}</option>)}
            </select>
                </td>
                <td>
                    <select
                    value={score}
                    onChange={(evnt)=>(handleChange(index, evnt))} name="score" className="form-control"
                    >
                        <option value={"0"} >{"3-0"}</option>
                        <option value={"1"} >{"3-1"}</option>
                        <option value={"2"} >{"3-2"}</option>
                        <option value={"3"} >{"2-3"}</option>
                        <option value={"4"} >{"1-3"}</option>
                        <option value={"5"} >{"0-3"}</option>                        
                    </select>
                 </td>
                <td><button className="btn btn-outline-danger" onClick={()=>(deleteTableRows(index))}>x</button></td>
            </tr>
            )
        })
   
    )
    
}
export default TableRows;