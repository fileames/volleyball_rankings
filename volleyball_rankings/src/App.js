import './App.css';
import { useEffect, useState } from "react"
import $ from 'jquery';
import women_data from './data/women_ranking_data.json'
import men_data from './data/men_ranking_data.json'
import last_time from './data/last_time.json'

import AddDeleteTableRows from "./components/AddDeleteTableRows";
import { erf, dotMultiply, sum } from 'mathjs'
import {TwitterTweetEmbed} from 'react-twitter-embed'

function App() {

  var C = [-1.060, -0.364, 0, 0.364, 1.060];
  var scores = [2, 1.5, 1, -1, -1.5, -2];
  let timestamp = timeConverter(last_time.last_checked)

  const [realCountryData, setRealCountryData] = useState(new Object());
  const [realMenData, setRealMenData] = useState(new Object());
  const [realWomenData, setRealWomenData] = useState(new Object());
  const [currentGender, setCurrentGender] = useState("Women");
  const [countryData, setCountryData] = useState(new Object());
  const [countryList, setCountryList] = useState([]);
  const [menCountryList, setMenCountryList] = useState([]);
  const [womenCountryList, setWomenCountryList] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [MWF, setMWF] = useState(50);


  useEffect(() => {
    var dict = new Object();
    var countryListTemp = [];
    for (let i = 0; i < women_data.length; i++) {
      let item = women_data[i];
      dict[item.country] = item.point;
      countryListTemp.push(item.country)
    }
    setCountryData(dict);
    setRealCountryData(dict);
    setCountryList(countryListTemp);
    setRealWomenData(dict);
    setWomenCountryList(countryListTemp);

    var mendict = new Object();
    var mencountryListTemp = [];
    for (let i = 0; i < men_data.length; i++) {
      let item = men_data[i];
      mendict[item.country] = item.point;
      mencountryListTemp.push(item.country)
    }
    setRealMenData(mendict);
    setMenCountryList(mencountryListTemp);

  }, []);


  function cdfNormal(x) {
    return (1 - erf((0 - x) / (Math.sqrt(2) * 1))) / 2
  }

  function sort_object(obj) {
    var items = Object.keys(obj).map(function (key) {
      return [key, obj[key]];
    });
    items.sort(function (first, second) {
      return second[1] - first[1];
    });
    var sorted_obj = {}
    $.each(items, function (k, v) {
      var use_key = v[0]
      var use_value = v[1]
      sorted_obj[use_key] = use_value
    })
    return (sorted_obj)
  }


  const calculate = () => {
    const clone = structuredClone(realCountryData);

    for (var match_i in rowsData) {
      var match = rowsData[match_i]
      var team1 = match.team1
      var team2 = match.team2
      var score = match.score

      var delta = 8 * (clone[team1] - clone[team2]) / 1000
      var Ps = [0, 0, 0, 0, 0, 0]
      var norms = [0, 0, 0, 0, 0, 0]

      for (let i = 0; i < 5; i++) {
        norms[i + 1] = cdfNormal(C[i] + delta);

      }
      norms.push(1)

      for (let i = 0; i < 6; i++) {
        var prev = norms[i];
        var next_ = norms[i + 1];
        Ps[i] = next_ - prev;
      }

      var exp = sum(dotMultiply(scores, Ps));
      var WR = scores[parseInt(score)] - exp;
      var point = WR * MWF / 8;

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

  const changeGender = () => {
    if (currentGender == "Women") {
      setCurrentGender("Men");
      setRealCountryData(realMenData);
      setCountryData(realMenData);
      setCountryList(menCountryList);
    }
    else {
      setCurrentGender("Women");
      setRealCountryData(realWomenData);
      setCountryData(realWomenData);
      setCountryList(womenCountryList);
    }
  };

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  return (
    <div className="App">

      <div class="container">
        <div class="row mt-4 mb-4">
          <h4 className='display-4'>FIVB {currentGender}'s Volleyball Rankings</h4>
          <div className="mt-2 mb-2"></div>
          <div className="col-sm-12"><button className='btn btn-secondary' onClick={changeGender}>Change Gender</button></div>
        </div>
        <div class="row">
          <div class="col-sm">

            <div className="mt-5 mb-5"></div>
            <AddDeleteTableRows countryList={countryList} rowsData={rowsData} setRowsData={setRowsData} setMWF={setMWF} MWF={MWF} />
            <button className='btn btn-primary' onClick={calculate}>Calculate New Scores</button>
            <div className="mt-5 mb-5"></div>



            <div className='centerContent on-web' >
              <h6>Share With Your Friends</h6>

              <TwitterTweetEmbed onLoad={function noRefCheck() { }}
                options={{
                  cards: 'hidden',
                  hideCard: true,
                  hideThread: false,
                  width: "50%",
                  align: "center"
                }}
                tweetId="1662397513167519745" />

            </div>


          </div>
          <div class="col-sm">
            <p>Last update: {timestamp}</p>
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
                    return <tr key={index + 1}><th scope="row">{index + 1}</th><td>{key}</td> <td>{Math.round(realCountryData[key])}</td> <td>{Math.round(countryData[key])}</td> <td style={{ color: countColor(countryData[key] - realCountryData[key]) }}>{(countryData[key] - realCountryData[key]).toFixed(3)}</td></tr>
                  })
                }
              </tbody>
            </table>

            

        </div>
          <div className='centerContent on-mobile' >
            <h6>Share With Your Friends</h6>

            <TwitterTweetEmbed onLoad={function noRefCheck() { }}
              options={{
                cards: 'hidden',
                hideCard: true,
                hideThread: false,
                width: "80%",
                align: "center"
              }}
              tweetId="1662397513167519745" />

          </div>
        </div>
      </div>

      <footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
        <div class="col-md-4 d-flex align-items-center">
          <a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
          </a>
          <span class="mb-3 mb-md-0 text-muted">Created by <a href="https://www.linkedin.com/in/elif-sema-balc%C4%B1o%C4%9Flu-70a712146/" target="_blank">Elif Sema Balcıoğlu</a>
            | Using <a href="https://www.fivb.com/en/volleyball/rankings/seniorworldrankingwomen" target="_blank">FIVB</a> data</span>
        </div>

      </footer>
    </div>
  );
}

export default App;
