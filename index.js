/*
    options:
        options.pattern - '*', 'all' match all, otherwise pattern is search as plain string anywhere in the req.originalUrl
        options.verbose
    cb:
 */
var matchRequest = function (options, cb) {
    return function (req, res, next) {
        var pattern = options.pattern;

        var matched = false;

        if (pattern === '*') {
            matched = true;
        } else if (pattern === 'all') {
            matched = true;
        } else if (req.originalUrl.indexOf(pattern) >= 0) {
            matched = true;
        }

        if (matched) {
            if (options.verbose) {
                console.log('Request for URL ' + req.originalUrl + ' matched pattern "' + pattern + '"');
            }
            cb(req, res, next);
        } else {
            next();
        }
    };
};

module.exports = matchRequest;
