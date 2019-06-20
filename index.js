/**
 * Express middleware
 * @name ExpressMiddleware
 * @function
 * @param {Object}   req  - Request object
 * @param {Object}   res  - Response object
 * @param {Function} next - Next function
 */

/**
  * The condition to be matched (<b>.pattern</b> is used for match with request and other attributes are used for response)
  * @typedef {Object} MatchCondition
  * @property {String} pattern                  - <b>"none"</b> or <b>falsy-value</b> would match none
  *                                               <br /> <b>"*"</b> or <b>"all"</b> would match all
  *                                               <br /> <b>"&lt;any-other-pattern&gt;"</b> would be searched as plain string anywhere in the req.originalUrl
  * @property {*} [Any-other-object-properties] - Any other object properties (these might be accessed after match from res.locals[options.addMatchedConditionToResLocalsProperty])
  */

/**
 * "Match Request" module for Express JS.
 * @module express-match-request
 *
 * @function matchRequest
 *
 * @description
 * This function is an Express JS middleware which would try to match the specified pattern (from an array of MatchCondition objects) with req.originalUrl.
 * <br /> - If no match is found, then the request would just pass through.
 * <br /> - If a match is found, then the <b>callback</b> function would be called, which should be defined in an Express Middleware format.
 *
 * @param {Object}  options
 * @param {MatchCondition[]} [options.conditions] - Array of conditions which would be used for matching with req.originalUrl
 *                                                  <br /> A <b>falsy-value</b> (or empty array) would make this function call effectively empty and the request would pass-through
 * @param {Boolean} [options.verbose]             - <b>truthy-value</b> to log each matched URL and corresponding pattern
 * @param {Object}  [options.console]             - A <b>console object</b>, which supports console.log() and console.warn()
 * @param {String}  [options.addMatchedConditionToResLocalsProperty] - The first matched condition would be added to res.locals object
 * @param {ExpressMiddleware} callback            - Callback if a match is found, otherwise, Express JS's next() is called internally
 *
 * @return {ExpressMiddleware} Express middleware
 */
var matchRequest = function (options, callback) {
    options = options || {};
    var logger = options.console || console,
        conditions = options.conditions,
        addMatchedConditionToResLocalsProperty = options.addMatchedConditionToResLocalsProperty;
    return function (req, res, next) {
        if (!conditions || !conditions.length) {
            return next();
        }
        var firstConditionWhichMatchesRequest = conditions.find(function (condition) {
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
                    logger.log('res.locals["' + addMatchedConditionToResLocalsProperty + '"] is set to the matched pattern.');
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
