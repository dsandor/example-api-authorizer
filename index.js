/*
	This is the authorizer that is called when the APIGW is
	attempting to authorize a request. This example simply allows all 
	requests if the Authorization header exists and does not contain the text 'fail'.
*/
exports.authorizerHandler = async (event, context, callback) => {
	if (event.headers['Authorization'] && event.headers['Authorization'] !== 'fail') {
		callback(null, generatePolicy('user', 'Allow', event.methodArn));
	} else {
		callback(null, generatePolicy('user', 'Deny', event.methodArn));
	}
};

module.exports.helloWorldHandler = async () => {
	return {
		statusCode: 200,
		body: "Hi there!",
	};
}

// Help function to generate an IAM policy
const generatePolicy = function (principalId, effect, resource) {
	var authResponse = {};

	authResponse.principalId = principalId;
	if (effect && resource) {
		var policyDocument = {};
		policyDocument.Version = '2012-10-17';
		policyDocument.Statement = [];
		var statementOne = {};
		statementOne.Action = 'execute-api:Invoke';
		statementOne.Effect = effect;
		statementOne.Resource = resource;
		policyDocument.Statement[0] = statementOne;
		authResponse.policyDocument = policyDocument;
	}

	// Example of Optional output with custom properties of the String, Number or Boolean type.
	authResponse.context = {
		"stringKey": "stringval",
		"numberKey": 123,
		"booleanKey": true
	};
	return authResponse;
}
