import './App.css';
import { useEffect, useState } from "react"
import $ from 'jquery'; 
import data from './data/ranking_data.json'
import AddDeleteTableRows from "./components/AddDeleteTableRows";
import { erf, dotMultiply, sum } from 'mathjs'


function App() {

  var C = [-1.060, -0.364, 0, 0.364, 1.060];
  var scores = [2,1.5,1,-1,-1.5,-2];
  const [realCountryData, setRealCountryData] = useState(new Object());
  const [countryData, setCountryData] = useState(new Object());
  const [countryList, setCountryList] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [MWF, setMWF] = useState(50);

  useEffect(() => {
    var dict = new Object();
    var countryListTemp = []
      for(let i = 0; i < data.length; i++) {
        let item = data[i];
        dict[item.country] = item.point;
        countryListTemp.push(item.country)
      }
      setCountryData(dict);
      setRealCountryData(dict);
      setCountryList(countryListTemp);
  }, []);


  function cdfNormal(x) {
    return (1 - erf((0 - x ) / (Math.sqrt(2) * 1))) / 2
  }

  function sort_object(obj) {
    var items = Object.keys(obj).map(function(key) {
        return [key, obj[key]];
    });
    items.sort(function(first, second) {
        return second[1] - first[1];
    });
    var sorted_obj={}
    $.each(items, function(k, v) {
        var use_key = v[0]
        var use_value = v[1]
        sorted_obj[use_key] = use_value
    })
    return(sorted_obj)
} 


  const calculate = ()=>{ 
    const clone = structuredClone(realCountryData);

    for(var match_i in rowsData){
      var match = rowsData[match_i]
      var team1 = match.team1
      var team2 = match.team2
      var score = match.score

      var delta = 8*(clone[team1] - clone[team2])/ 1000
      var Ps = [0,0,0,0,0,0]
      var norms = [0,0,0,0,0,0]

      for (let i = 0; i < 5; i++) {
        norms[i+1] = cdfNormal(C[i] + delta);

      }
      norms.push(1)

      for (let i = 0; i < 6; i++) {
        var prev = norms[i];
        var next_ = norms[i+1];
        Ps[i] = next_ - prev;
      }

      var exp = sum(dotMultiply(scores, Ps));
      var WR = scores[parseInt(score)] - exp;
      var point = WR*MWF/8;

      clone[team1] = clone[team1] + point;
      clone[team2] = clone[team2] - point;
    }
    
      setCountryData(sort_object(clone));
  }

  const countColor = (count) => {
    if (count < 0) return "red";
    else if (count > 0) return "green";
    else if (count === 0) return "black";
  }; 

  return (
    <div className="App">
      
      <div class="container">
        <div class="row mt-4 mb-4">
          <h2>Volleyball Rankings</h2>

        </div>
          <div class="row">
            <div class="col-sm">
              <AddDeleteTableRows countryList={countryList} rowsData={rowsData} setRowsData={setRowsData} setMWF={setMWF} MWF={MWF}/>
              <button className='btn btn-primary' onClick={calculate}>Calculate New Scores</button>

            </div>
            <div class="col-sm">
              <table class="table table-hover">
                 <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Country</th>
                    <th scope="col">Real Point</th>
                    <th scope="col">Point</th>
                    <th scope="col">Change</th>
                  </tr>
                </thead>
                <tbody>
                {
                    Object.keys(countryData).map((key, index) => {
                        return <tr key={index+1}><th scope="row">{index+1}</th><td>{key}</td> <td>{Math.round(realCountryData[key])}</td> <td>{Math.round(countryData[key])}</td> <td style={{color: countColor(countryData[key] - realCountryData[key])}}>{(countryData[key] - realCountryData[key]).toFixed(3)}</td></tr>
                    })
                }
                </tbody>
            </table>
            </div>
            
          </div>
        </div>
    </div>
  );
}

export default App;
