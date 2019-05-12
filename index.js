const request = require('request');

const siteKey = "6LedLp4UAAAAAADezcdlHAaxq5oEtOFzTWWl8aLQ";
const twoCaptchaAPIKey = '';
const pageUrl = 'https://clout.cx/register';
const password = ""

function getCaptcha(callback) {
	request({
	    url: "http://2captcha.com/in.php?key=" + twoCaptchaAPIKey + "&method=userrecaptcha&googlekey=" + siteKey + "&pageurl=" + pageUrl,
	    method: "GET"
	}, (err, res, body) => {
	    if (err) console.error(err);
	    else {
	    	if (body.indexOf("OK") != -1) {
	    		console.log("Successfully submitted request to 2Captcha for captcha generation. Waiting for captcha response...");
	    		return callback(body.substring(3, body.length))
	    	} else {
	    		console.log("Error! Please contact a Staff Member!");
	    	}
	    }
	});
}

function getCaptchaKey(taskID, callback) {
	setTimeout(() => {
		request({
			url: "http://2captcha.com/res.php?key=" + twoCaptchaAPIKey + "&action=get&id=" + taskID,
			method: "GET"
		}, (err, res, body) => {
			if (err) console.error(err);
			else {
				if (body == "CAPCHA_NOT_READY") {
					console.log("Captcha has not been generated yet... waiting 10 seconds");
					getCaptchaKey(taskID, callback)
				} else {
					return callback(body.substring(3, body.length));
				}
			}
		});
	}, 10000);
}

function genEmail() {
	return Math.floor(Math.random() * 10000000000).toString() + "@rycao.me";
}



getCaptcha((taskID) => {
	getCaptchaKey(taskID, (captchaRes) => {
		request({
			url: "https://clout.cx/requests.php?f=register",
			method: "POST",
			headers: {
				"accept": "*/*",
				"accept-language": "en-US,en;q=0.9",
				"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
				"origin": "https://clout.cx",
				"referer": "https://clout.cx/register",
				"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.131 Safari/537.36",
				"x-requested-with": "XMLHttpRequest"
			},
			data: {
				"username": "rycao18",
				"email": genEmail(),
				"password": password,
				"confirm_password": password,
				"gender": "male",
				"g-recaptcha-response": captchaRes,
				"accept_terms": "on",
			}
		}, (err, res, body) => {
			if(res.statusCode == 200) {
				console.log("easy");
			} else {
				console.log(captchaRes);
				console.log(body);
			}
		})
	});
});