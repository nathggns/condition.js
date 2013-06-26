var condition = require('../index.js');
var should = require('should');

describe('condition', function() {
    describe('wait', function() {

        it('should wait for condition to be true to call callback', function(done) {

            var i = 0;

            condition.wait(function() {
                if (i === 1) {
                    return true;
                }

                i = i + 1;
            }, function() {
                i.should.eql(1);
                done();
            });
        });

        it('should wait for done function to be called', function(d_done) {

            var i = 0;

            condition.wait(function(done) {
                condition.tick(function() {
                    i = 1;
                    done(true);
                });
            }, function() {
                i.should.eql(1);
                d_done();
            });

        });

        it('should only call callback once', function(done) {

            var i = 0;

            condition.wait(function() {
                return true; 
            }, function() {
                i++;
            });

            setTimeout(function() {
                i.should.eql(1);
                done();
            }, 5);
        });

        it('should pass result of condition to callback', function(done) {

            var rand = Math.random();

            condition.wait(function() {
                return rand;
            }, function(result) {
                result.should.eql(rand);
                done();
            });
        });

    });
});