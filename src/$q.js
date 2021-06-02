// helpers
import isArray from 'lodash/isArray';
import forEach from 'lodash/forEach';

/**
 * Extends $q implementation by A+ *any* method
 * @name permission.$q
 *
 * @extends {angular.$q}
 *
 * @param $delegate {Object} Parent instance being extended
 */
class $q{

    /**
     * Implementation of missing $q `any` method that wits for first resolution of provided promise set
     * @methodOf permission.$q
     *
     * @param promises {Array|promise} Single or set of promises
     *
     * @returns {Promise} Returns a single promise that will be rejected with an array/hash of values,
     *  each value corresponding to the promise at the same index/key in the `promises` array/hash.
     *  If any of the promises is resolved, this resulting promise will be returned
     *  with the same resolution value.
     */
    static any = (promises) => {
        return new Promise( (resolve, reject) => {
            const results = isArray(promises) ? [] : {};

            let counter = 0;

            forEach(promises, (promise, key) => {
                counter++;
                promise
                    .then(function (value) {
                        resolve(value);
                    })
                    .catch(function (reason) {
                        results[key] = reason;
                        if (!(--counter)) {
                            reject(reason);
                        }
                    });
            });

            if (counter === 0) {
                reject(results);
            }
        });
    }
}

export default new $q();
