import _ from 'lodash';
import jsonData from '../assets/data.json';
import { variables } from '../utils';

export const { headers, data } = jsonData.Pivot1;

const { SUB_STRATEGY, STRATEGY } = variables;

/**
 * added extra 'visible' key to all object for hide and show
 */
const addedVisibleKey = data.map(item => ({ visible: false, ...item }));

/**
 * group 'addedVisibleKey' by 'Strategy' key
 */
const strategyObj = _.groupBy(addedVisibleKey, item => item[STRATEGY]);

/**
 * convert grouped Strategy object into Strategy array
 */
const strategyArray = Object.keys(strategyObj).map(key => strategyObj[key]);

/**
 * group 'strategyArray' by 'Sub Strategy' key
 */
const subStrategy = strategyArray.map(item =>
	_.groupBy(item, item => item[SUB_STRATEGY])
);

/**
 * convert grouped 'subStrategy' object into array
 */
const setSubStrategyArray = subStrategy.map(items =>
	Object.keys(items).map(key => items[key])
);

/**
 * added extra 'visibleOuter' key for outer row array object
 */
setSubStrategyArray.forEach(items => {
	items.push([{ visibleOuter: false }]);
});

export default setSubStrategyArray;
