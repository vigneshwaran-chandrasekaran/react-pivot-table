import React, { Fragment, useState } from 'react';
import _ from 'lodash';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.scss';
import jsonData from './assets/data.json';

const { headers, data } = jsonData.Pivot1;

// console.log({ data });

/**
 * added extra 'visible' key to all object for hide and show
 */
const addedVisibleKey = data.map(item => ({ visible: false, ...item }));

/**
 * group 'addedVisibleKey' by 'Strategy' key
 */
const strategyObj = _.groupBy(addedVisibleKey, item => item['Strategy']);

/**
 * convert grouped Strategy object into Strategy array
 */
const strategyArray = Object.keys(strategyObj).map(key => strategyObj[key]);

/**
 * group 'strategyArray' by 'Sub Strategy' key
 */
const subStrategy = strategyArray.map(item =>
	_.groupBy(item, item => item['Sub Strategy'])
);

/**
 * convert grouped 'subStrategy' object into array
 */
let setSubStrategyArray = subStrategy.map(items =>
	Object.keys(items).map(key => items[key])
);

/**
 * added extra 'visibleOuter' key for outer row array object
 */
setSubStrategyArray.forEach(items => {
	items.push([{ visibleOuter: false }]);
});

function absolute(value) {
	return Math.abs(value);
}

function roundUp(value) {
	return Math.round(value);
}

function fieldValue(value) {
	let val = roundUp(value);
	if (val < 0) {
		return (
			<span className="text-danger">({absolute(val).toLocaleString()})</span>
		);
	}
	return val.toLocaleString();
}

function flatternArray(oldArray) {
	let clonedArray = [...oldArray];
	clonedArray.pop();
	return Array.prototype.concat.apply([], clonedArray);
}

function findtotal(group, key) {
	return group.reduce((acc, val) => {
		if (val.hasOwnProperty(key)) {
			return acc + roundUp(val[key]);
		} else {
			return acc;
		}
	}, 0);
}

function App() {
	const [state, setState] = useState(0);

	function handleBtnClick(subStrategy) {
		subStrategy.forEach(row => {
			row.visible = !row.visible;
		});
		setState(Math.random());
	}

	function handleOuterBtnClick(strategy) {
		strategy[strategy.length - 1].visibleOuter = !strategy[strategy.length - 1]
			.visibleOuter;
		setState(Math.random());
	}

	return (
		<div className="container">
			<table className="table table-bordered table-hover table-sm">
				<thead>
					<tr>
						<th className={state}>&nbsp;</th>
						{headers.map(({ displayName }) => (
							<th className="text-center" key={displayName}>
								{displayName}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{setSubStrategyArray.map((strategy, stI) => (
						<Fragment key={`${stI}-strategy`}>
							<tr>
								<td>
									<button
										onClick={() => handleOuterBtnClick(strategy)}
										className="btn-sqr"
									>
										{strategy[strategy.length - 1].visibleOuter ? '-' : '+'}
									</button>
									<span className="pl-2">{strategy[0][0]['Strategy']}</span>
								</td>
								<td>{fieldValue(findtotal(flatternArray(strategy), 'MV'))}</td>
								<td>
									{fieldValue(findtotal(flatternArray(strategy), 'Carry'))}
								</td>
								<td>
									{fieldValue(findtotal(flatternArray(strategy), 'Net PL 1'))}
								</td>
								<td>
									{fieldValue(findtotal(flatternArray(strategy), 'Net PL 2'))}
								</td>
								<td>
									{fieldValue(findtotal(flatternArray(strategy), 'Net PL 3'))}
								</td>
							</tr>
							{strategy.map((subStrategy, subIndex) => (
								<Fragment key={`${subIndex}-subStrategy`}>
									{strategy.length - 1 > subIndex ? (
										<>
											<tr
												className={
													strategy[strategy.length - 1].visibleOuter
														? ''
														: 'd-none'
												}
											>
												<td className="pl-3">
													<button
														onClick={() => handleBtnClick(subStrategy)}
														className="btn-sqr"
													>
														{subStrategy[0]['visible'] ? '-' : '+'}
													</button>
													<span className="pl-2">
														{subStrategy[0]['Sub Strategy']}
													</span>
												</td>
												<td>{fieldValue(findtotal(subStrategy, 'MV'))}</td>
												<td>{fieldValue(findtotal(subStrategy, 'Carry'))}</td>
												<td>
													{fieldValue(findtotal(subStrategy, 'Net PL 1'))}
												</td>
												<td>
													{fieldValue(findtotal(subStrategy, 'Net PL 2'))}
												</td>
												<td>
													{fieldValue(findtotal(subStrategy, 'Net PL 3'))}
												</td>
											</tr>
											{subStrategy.map((security, secIndex) => (
												<tr
													key={`${secIndex}-security`}
													className={
														security.visible &&
														strategy[strategy.length - 1].visibleOuter
															? ''
															: 'd-none'
													}
												>
													<td>
														<span className="pl-5">{security['Security']}</span>
													</td>
													<td>{security['MV']}</td>
													<td>{fieldValue(security['Carry'])}</td>
													<td>{fieldValue(security['Net PL 1'])}</td>
													<td>{fieldValue(security['Net PL 2'])}</td>
													<td>{fieldValue(security['Net PL 3'])}</td>
												</tr>
											))}
										</>
									) : null}
								</Fragment>
							))}
						</Fragment>
					))}
				</tbody>
				<tfoot>
					<tr>
						<th>&nbsp;</th>
						<th>{fieldValue(findtotal(data, 'MV'))}</th>
						<th>{fieldValue(findtotal(data, 'Carry'))}</th>
						<th>{fieldValue(findtotal(data, 'Net PL 1'))}</th>
						<th>{fieldValue(findtotal(data, 'Net PL 2'))}</th>
						<th>{fieldValue(findtotal(data, 'Net PL 3'))}</th>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

export default App;
