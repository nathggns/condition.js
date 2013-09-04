var condition = require('../index.js');
var should = require('should');

describe('condition', function() {

   
 it('should work with disabing autoCheck', function(done) {

        var controlVariable = false;
        var count = 0;

        var check = condition.when(function() {
            return controlVariable;
        }, function() {
            count++;

            controlVariable = false;
        }, false);

        controlVariable = true;

        count.should.eql(0);

        check();

        setTimeout(function() {
            count.should.eql(1);
            done();
        }, 10);

    });

    it('should work with disabing autoCheck and startWatching', function(done) {
        var controlVariable = false;
        var count = 0;

        var check = condition.when(function() {
            return controlVariable;
        }, function() {
            count++;

            controlVariable = false;
        }, false);

        controlVariable = true;
        count.should.eql(0);

        check.startWatching();

        setTimeout(function() {
            count.should.eql(1);
            done();
        }, 10);

    });

    it('should work with stopWatching', function(done) {
        var controlVariable = false;
        var count = 0;

        var check = condition.when(function() {
            return controlVariable;
        }, function() {
            count++;

            controlVariable = false;
        });

        controlVariable = true;

        setTimeout(function() {
            count.should.eql(1);

            check.stopWatching();

            controlVariable = true;

            setTimeout(function() {
                count.should.eql(1);

                check.startWatching();

                setTimeout(function() {
                    count.should.eql(2);
                    done();
                }, 10);
            }, 10);
        }, 10);
    });
});