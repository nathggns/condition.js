var condition = require('../index.js');
var should = require('should');

describe('condition', function() {
    describe('when', function() {
        it('should call callback every time result is true', function(done) {

            var i = 0;
            var j = 0;

            condition.when(function() {
                return ++i < 3; 
            }, function() {
                j++;
            });

            setTimeout(function() {
                j.should.eql(2);
                done();
            }, 5);
        });
    });
});