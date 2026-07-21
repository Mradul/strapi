/**
 * Re-exports lodash helpers for deep operations.
 * Using lodash keeps equality and cloning consistent with
 * Strapi core (content-manager, review-workflows, content-releases
 * all rely on lodash) and preserves Date instances, unlike
 * JSON.parse(JSON.stringify()).
 */

import { isEqual, cloneDeep, get, set, unset, isEmpty } from 'lodash/fp';

export { isEqual, cloneDeep, get, set, unset, isEmpty };

import lodash from 'lodash';

export const cloneDeepMutable = lodash.cloneDeep;
export const isEqualMutable = lodash.isEqual;
export const getMutable = lodash.get;
export const setMutable = lodash.set;
export const unsetMutable = lodash.unset;
