'use strict';

var expect = require('chai').expect;
var express = require('express');
var request = require('supertest');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var Passwordless = require('../../lib');
var TokenStoreMock = require('../mock/tokenstore');

describe('passwordless', function() {
	describe('add', function() {

		var deliveryMockVerify = function(contactToVerify, done) {
				if(contactToVerify === 'error') {
					done('error', null);
				} else if (contactToVerify === 'unknown') {
					done(null, null);
				} else {
					done(null, 'UID/' + contactToVerify);
				}
			};

		var deliveryMockSend = function(tokenToSend, user, done) {
				delivered.push([tokenToSend, user]);
				done();
			};

		it('shall work with correct default usage', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			passwordless.add(deliveryMockVerify, deliveryMockSend);
		});

		it('shall throw an Error if parameter is missing - 1/4', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			expect(function() {
				passwordless.add(deliveryMockVerify)
			}).to.throw(Error);
		});

		it('shall throw an Error if parameter is missing - 2/4', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			expect(function() {
				passwordless.add()
			}).to.throw(Error);
		});

		it('shall throw an Error if parameter is missing - 1/4', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			expect(function() {
				passwordless.add('email', deliveryMockVerify)
			}).to.throw(Error);
		});

		it('shall throw an Error if parameter is missing - 2/4', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			expect(function() {
				passwordless.add('email')
			}).to.throw(Error);
		});

		it('shall throw an Error if a second default delivery method is added', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			passwordless.add(deliveryMockVerify, deliveryMockSend);
			expect(function() {
				passwordless.add(deliveryMockVerify, deliveryMockSend)
			}).to.throw(Error);
		});

		it('shall work with correct named delivery method usage', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			passwordless.add('email', deliveryMockVerify, deliveryMockSend);
		});

		it('shall throw an Error if first an unnamed and then a named method is added', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			passwordless.add(deliveryMockVerify, deliveryMockSend);
			expect(function() {
				passwordless.add('email', deliveryMockVerify, deliveryMockSend)
			}).to.throw(Error);
		});

		it('shall throw an Error if first a named and then an unamed method is added', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			passwordless.add('email', deliveryMockVerify, deliveryMockSend);
			expect(function() {
				passwordless.add(deliveryMockVerify, deliveryMockSend)
			}).to.throw(Error);
		});

		it('shall work for two or more named delivery methods', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			passwordless.add('email', deliveryMockVerify, deliveryMockSend);
			passwordless.add('sms', deliveryMockVerify, deliveryMockSend);
			passwordless.add('phone', deliveryMockVerify, deliveryMockSend);
		});

		it('shall throw an Error if two times the same named method is added', function () {
			var passwordless = new Passwordless(new TokenStoreMock());
			passwordless.add('email', deliveryMockVerify, deliveryMockSend);
			expect(function() {
				passwordless.add('email', deliveryMockVerify, deliveryMockSend)
			}).to.throw(Error);
		});
	});
});