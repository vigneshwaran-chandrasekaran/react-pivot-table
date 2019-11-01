import React, { Fragment, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/style.scss';
import { absolute, roundUp, flatternArray, findtotal } from './helpers';
import dataArray, { headers, data } from './helpers/data-modifier';
import { variables } from './utils';

const {
	MV,
	CARRY,
	NP1,
	NP2,
	NP3,
	SUB_STRATEGY,
	STRATEGY,
	SECURITY
} = variables;

function fieldValue(value) {
	let val = roundUp(value);
	if (val < 0) {
		return (
			<span className="text-danger">({absolute(val).toLocaleString()})</span>
		);
	}
	return val.toLocaleString();
}

function App() {
	const [click, setClicked] = useState(0);

	function handleInnerBtnClick(subStrategy) {
		subStrategy.forEach(row => {
			row.visible = !row.visible;
		});
		setClicked(click + 1);
	}

	function handleOuterBtnClick(strategy) {
		/**
		 * comment below code if no need to close inner row when outer row closed
		 */
		if (!strategy[strategy.length - 1].visibleOuter) {
			closeInnerOpen(strategy);
		}
		strategy[strategy.length - 1].visibleOuter = !strategy[strategy.length - 1]
			.visibleOuter;
		setClicked(click + 1);
	}

	/**
	 * will close inner row when outer row closed
	 */
	function closeInnerOpen(strategy) {
		let data = flatternArray(strategy);
		data.forEach(row => {
			row.visible = false;
		});
	}

	return (
		<div className="container">
			<table className="table table-bordered table-hover table-sm pivot-table">
				<thead>
					<tr>
						<th className={click}>&nbsp;</th>
						{headers.map(({ displayName }) => (
							<th className="text-center" key={displayName}>
								{displayName}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{dataArray.map((strategy, stI) => (
						<Fragment key={`${stI}-strategy`}>
							<tr>
								<td>
									<button
										onClick={() => handleOuterBtnClick(strategy)}
										className="btn-sqr"
									>
										{strategy[strategy.length - 1].visibleOuter ? '-' : '+'}
									</button>
									<span className="pl-2">{strategy[0][0][STRATEGY]}</span>
								</td>
								<td>{fieldValue(findtotal(flatternArray(strategy), MV))}</td>
								<td>{fieldValue(findtotal(flatternArray(strategy), CARRY))}</td>
								<td>{fieldValue(findtotal(flatternArray(strategy), NP1))}</td>
								<td>{fieldValue(findtotal(flatternArray(strategy), NP2))}</td>
								<td>{fieldValue(findtotal(flatternArray(strategy), NP3))}</td>
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
														onClick={() => handleInnerBtnClick(subStrategy)}
														className="btn-sqr"
													>
														{subStrategy[0]['visible'] ? '-' : '+'}
													</button>
													<span className="pl-2">
														{subStrategy[0][SUB_STRATEGY]}
													</span>
												</td>
												<td>{fieldValue(findtotal(subStrategy, MV))}</td>
												<td>{fieldValue(findtotal(subStrategy, CARRY))}</td>
												<td>{fieldValue(findtotal(subStrategy, NP1))}</td>
												<td>{fieldValue(findtotal(subStrategy, NP2))}</td>
												<td>{fieldValue(findtotal(subStrategy, NP3))}</td>
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
														<span className="pl-5">{security[SECURITY]}</span>
													</td>
													<td>{fieldValue(security[MV])}</td>
													<td>{fieldValue(security[CARRY])}</td>
													<td>{fieldValue(security[NP1])}</td>
													<td>{fieldValue(security[NP2])}</td>
													<td>{fieldValue(security[NP3])}</td>
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
						<th className="text-left">Grand Total</th>
						<th>{fieldValue(findtotal(data, MV))}</th>
						<th>{fieldValue(findtotal(data, CARRY))}</th>
						<th>{fieldValue(findtotal(data, NP1))}</th>
						<th>{fieldValue(findtotal(data, NP2))}</th>
						<th>{fieldValue(findtotal(data, NP3))}</th>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}

export default App;
