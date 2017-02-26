/**
 * Express middleware
 * @name ExpressMiddleware
 * @function
 * @param {Object} req - Request object
 * @param {Object} res - Response Object
 * @param {Function} next - Next function
 */

/**
 * "Match Request" module for Express JS.
 * @module express-match-request
 * @function matchRequest
 * @param {Object}  options
 * @param {Object[]}  [options.conditions]
 * @param {String} [options.conditions[].pattern] - <b>"none"</b> or <b>falsy-value</b> would match none
 *                                                  <br /> <b>"*"</b> or <b>"all"</b> would match all
 *                                                  <br /> <b>"&lt;any-other-pattern&gt;"</b> would be searched as plain string anywhere in the req.originalUrl
 * @param {*} [options.conditions[].Any-other-object-properties ]      - Any other object properties
 * @param {Boolean} [options.verbose]             - <b>truthy-value</b> to log each matched URL and corresponding pattern
 * @param {Object}  [options.console]             - A <b>console object</b>, which supports console.log() and console.warn()
 * @param {String}  [options.addMatchedConditionToResLocalsProperty]  - The first matched condition would be added to res.locals object
 * @param {ExpressMiddleware} callback            - Callback if a match is found, otherwise, Express JS's next() is called internally
 *
 * @return {ExpressMiddleware} Express middleware
 */
var matchRequest = function (options, callback) {
    options = options || {};
    var logger = options.console || console,
        conditions = options.conditions || [],
        addMatchedConditionToResLocalsProperty = options.addMatchedConditionToResLocalsProperty;
    return function (req, res, next) {
        var firstConditionWhichMatchesRequest = conditions.length && conditions.find(function (condition) {
            var pattern = condition.pattern,
                matched;
            if (!pattern || pattern === 'none') {
                matched = false;
            } else if (pattern === '*' || pattern === 'all') {
                matched = true;
            } else if (req.originalUrl.indexOf(pattern) >= 0) {
                matched = true;
            } else {
                matched = false;
            }

            return matched;
        });

        if (firstConditionWhichMatchesRequest) {
            if (options.verbose) {
                logger.log('Request for URL ' + req.originalUrl + ' matched pattern "' + firstConditionWhichMatchesRequest.pattern + '"');
            }
            if (addMatchedConditionToResLocalsProperty) {
                res.locals[addMatchedConditionToResLocalsProperty] = firstConditionWhichMatchesRequest;
                if (options.verbose) {
                    logger.log('res.locals[' + addMatchedConditionToResLocalsProperty + '] is set to the matched pattern.');
                }
            }
            if (typeof callback === 'function') {
                callback(req, res, next);
            } else {
                logger.warn('Callback is not a function, calling next()');
                next();
            }
        } else {
            next();
        }
    };
};

module.exports = matchRequest;
