import React from 'react';
import '../styles/Table.css';

const Table = ({ countries }) => {
	return (
		<div className="table">
			<table>
				<tbody>
					{countries.map(({ country, cases }, index) => (
						<tr key={index}>
							<td>{country}</td>
							<td>
								<strong>{cases}</strong>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default Table;
