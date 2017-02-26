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
 * @param {String}  [options.pattern]  - <b>"none"</b> or <b>falsy-value</b> would match none
 *                                       <br /> <b>"*"</b> or <b>"all"</b> would match all
 *                                       <br /> <b>"&lt;any-other-pattern&gt;"</b> would be searched as plain string anywhere in the req.originalUrl
 * @param {Boolean} [options.verbose]  - <b>true</b> to log each matched URL and corresponding pattern
 * @param {Object}  [options.console]  - A <b>console object</b>, which supports console.log() and console.warn()
 * @param {ExpressMiddleware} callback - Callback if a match is found, otherwise, Express JS's next() is called internally
 *
 * @return {ExpressMiddleware} Express middleware
 */
var matchRequest = function (options, callback) {
    options = options || {};
    var logger = options.console || console;
    return function (req, res, next) {
        var pattern = options.pattern,
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

        if (matched) {
            if (options.verbose) {
                logger.log('Request for URL ' + req.originalUrl + ' matched pattern "' + pattern + '"');
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
