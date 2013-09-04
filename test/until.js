var condition = require('../index');
var should = require('should');

describe('condition', function () {

    // it('should expose the until() function', function () {
    //     condition.until.should.be.a('function');
    // });

    describe('until', function () {

        it('should stop calling the callback function when the condition ' + 
        'gets true', function (done) {

            var array = [false, false, false, true];
            var count = 0;

            condition.until(function () {
                return array.shift();
            }, function () {
                count += 1;
            });

            setTimeout(function () {
                count.should.equal(3);
                done();
            }, 10);
        });

        it('should never call the callback function if the condition ' + 
        'starts true', function (done) {
            
            var callbackCalled = false;

            condition.until(function () {
                return true;
            }, function () {
                callbackCalled = true;
            });

            setTimeout(function () {
                callbackCalled.should.equal(false);
                done();
            }, 10);
        });

        it('should support asynchronous condition functions', function (done) {

            var array = [false, false, false, 'BAZINGA!'];
            var count = 0;

            condition.until(function (done) {
                setTimeout(function () {
                    done(array.shift());
                }, 5);
            }, function (result) {
                count += 1;
            });

            setTimeout(function () {
                count.should.equal(3);
                done();
            }, 25);
        });

    });
});
