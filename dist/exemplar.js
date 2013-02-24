//     Exemplar.js 0.1.1
//     (c) 2013 Jason Stehle, http://www.codistic.com/projects/exemplar/
//     Exemplar.js may be freely distributed under the MIT license.

(function (global) {
	var successes = [], failures = [];
	
	function testExemplar ($elm, result, index) {
		var $expectedElm = $elm.find('script[type=exemplar-expected-output]');
		
		if ($expectedElm.length) {
			var expected = $expectedElm.html().trim();
			var properties = { index: index, expected: expected, result: result };
			
			if (result === expected) {
				successes.push(properties);
			} else {
				failures.push(properties);
				$elm.addClass('test-failure');
			}
		}
	}
	
	function displayTestResults () {
		var successCount = successes.length, failureCount = failures.length;
		if (failureCount) {
			var message = failureCount + '/' + (successCount + failureCount) + ' failed.';
			$('.exemplar-test-results').text(message).show();
		}
	}

	var exemplar = {
		init: function () {
			
			$('pre[data-exemplar-pull]').each(function (idx, elm) {
				var $elm = $(elm);
				var selector = $elm.data('exemplar-pull');
				$elm.text($(selector).html());
			});
			
			$('div[data-exemplar-type]').each(function (idx, elm) {
				var $elm = $(elm);
				var exemplarType = $elm.data('exemplar-type');
				var src = $elm.find('script[type=exemplar]').html().replace(/\s+$/g, ''); //strip trailing line breaks
				var func = new Function(src);
				var result = (exemplarType === 'js') ? JSON.stringify(func()) : func();
		
				$elm.find('pre[data-exemplar-target]').html(src);
				$elm.find('*[data-exemplar-output]').html(result);
				testExemplar($elm, result);
			});
			
			SyntaxHighlighter.defaults.toolbar = false;
			SyntaxHighlighter.all();
		
			displayTestResults();
		}
	};
	
	global.exemplar = exemplar;
})(this);