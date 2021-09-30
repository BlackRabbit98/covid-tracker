import { FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';

const App = () => {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');

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
				});
		};
		getCountryData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		setCountry(countryCode);
	};

	return (
		<div className="App">
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
						{countries.map((country) => (
							<MenuItem value={country.value}>
								{country.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</div>
			{/* <Header />
      <Title />
      
      <InfoBoxes />
      <InfoBoxes/>
      <InfoBoxes/>
      
      <Table />
      <Graph />
      
      <Map /> */}
		</div>
	);
};

export default App;
