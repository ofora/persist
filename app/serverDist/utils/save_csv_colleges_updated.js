'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (fileName) {

    return new Promise(function (resolve, reject) {

        var parser = (0, _csvParse2.default)({
            delimiter: ',',
            columns: mapValues,
            auto_parse: true
        });

        var transformer = (0, _streamTransform2.default)(function (record) {

            // console.log(record);
            // let years =  {};
            // years[2012] = record['2012 Enrolled Fall1'];
            // years[2013] = record['2013 Enrolled Fall 1'];
            // years[2014] = record['2014 Enrolled Fall 1'];
            // years[2015] = record['2015 Enrolled Fall 1 '];

            // record.enrollmentYears = years;

            console.log(record);

            return record;
        }, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }

            // reduce data size for testing
            // data = data.splice(0, 10);
            var addedCount = 0;
            var modifiedCount = 0;
            var newColleges = [];
            var updatedColleges = [];

            _async2.default.eachLimit(data, 10, function (record, callback) {

                // college.update({
                //   fullName: record.fullName
                // }, record, {
                //   upsert: true,
                //   setDefaultsOnInsert: true
                // }, (err, rawResponse) => {
                //   if (err) {
                //     callback(err);
                //     return;
                //   }

                //   if (rawResponse.upserted) {
                //     addedCount += 1;
                //   } else {
                //     modifiedCount += 1;
                //   }

                //   // console.log(rawResponse);
                //   callback(null);

                // });

                _college2.default.findOne({
                    fullName: record.fullName
                }, function (err, doc) {

                    // if doesnt exist - create new record
                    if (!doc) {
                        var college = new _college2.default(record);
                        college.save(function (err) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            addedCount++;
                            newColleges.push({ fullName: record.fullName });
                            callback(null);
                        });
                    } else {
                        modifiedCount++;
                        (0, _merge2.default)(doc, record);
                        doc.save(function (err) {
                            if (err) return callback(err);
                            callback(null);
                        });
                        console.log('the record exists already mate!'.red);
                        updatedColleges.push({ fullName: record.fullName });

                        // run some logic of updating

                        // update document with rules from Molly
                        // options: overwrite / add
                    }
                });
            }, function (err) {

                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    modifiedCount: modifiedCount,
                    addedCount: addedCount
                });
            });
        });

        _fs2.default.createReadStream(fileName).pipe(parser).pipe(transformer);
    });
};

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csvParse = require('csv-parse');

var _csvParse2 = _interopRequireDefault(_csvParse);

var _streamTransform = require('stream-transform');

var _streamTransform2 = _interopRequireDefault(_streamTransform);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _college = require('../models/college');

var _college2 = _interopRequireDefault(_college);

var _fieldKeys = require('../../common/fieldKeys');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mapValues(line) {

    return line.map(function (key) {
        var obj = _fieldKeys.collegeKeys.find(function (field) {
            return field.fieldName === key;
        });
        if (obj) {
            return obj.dbName;
        }
        return key;
    });
}