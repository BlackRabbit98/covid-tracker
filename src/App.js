import {
	Card,
	CardContent,
	FormControl,
	MenuItem,
	Select,
} from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import LineGraph from './components/LineGraph';
import { sortData } from './util';
import 'leaflet/dist/leaflet.css';

const App = () => {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({
		lat: 34.80746,
		lng: -40.4796,
	});
	const [mapZoom, setMapZoom] = useState(3);

	//initial loading of worldwide cases
	useEffect(() => {
		fetch('https://disease.sh/v3/covid-19/all')
			.then((response) => response.json())
			.then((data) => {
				setCountryInfo(data);
			});
	}, []);

	//drop down menu
	useEffect(() => {
		const getCountryData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries')
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
					}));

					setCountries(countries);

					const sortedData = sortData(data);
					setTableData(sortedData);
				});
		};
		getCountryData();
	}, []);

	//data after drop-down country change event
	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		setCountry(countryCode);

		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountry(countryCode);
				setCountryInfo(data);

				// console.log('countryCode', countryCode);
				console.log('countryInfo', countryInfo);
			});
	};

	return (
		<div className="app">
			<div className="app__left">
				<div className="app__header">
					<h1>COVID-19 TRACKER</h1>
					<FormControl className="app__dropdown">
						<Select
							variant="outlined"
							onChange={onCountryChange}
							value={country}>
							{/* loop through all the countries and 
          show drop down list */}
							<MenuItem value="worldwide">Worldwide</MenuItem>
							{countries.map((country, index) => (
								<MenuItem key={index} value={country.value}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>

				<div className="app__stats">
					<InfoBox
						title="Coronavirus Cases"
						cases={countryInfo.todayCases}
						total={countryInfo.cases}
					/>
					<InfoBox
						title="Recovered"
						cases={countryInfo.todayRecovered}
						total={countryInfo.recovered}
					/>
					<InfoBox
						title="Deaths"
						cases={countryInfo.todayDeaths}
						total={countryInfo.deaths}
					/>
				</div>

				<Map center={mapCenter} zoom={mapZoom} />
			</div>

			<Card className="app__right">
				<CardContent>
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
					<h3>Worldwide new cases</h3>
					<LineGraph />
				</CardContent>
			</Card>
		</div>
	);
};

export default App;
