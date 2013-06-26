var condition = require('../index.js');
var should = require('should');

describe('condition', function() {

    describe('args', function() {

        it('should work for normal functions', function() {
            condition.args(function(a, b, c){}).should.eql(['a', 'b', 'c']);
        });

        it('should work for named functions', function() {
           condition.args(function a(b, c, d){}).should.eql(['b', 'c', 'd']);
        });

        it('should work for content functions', function() {
            condition.args(function a(b, c, d) {
                a(b, c);
            }).should.eql(['b', 'c', 'd']);
        });

        it('should for for empty functions', function() {
            condition.args(function(){}).should.eql([]);
        });
    });

});