const axios = require('axios');
const fs = require('fs');
const qs = require('qs');

const chalk = require('chalk');
const error = chalk.bold.red;
const success = chalk.bold.green;
const info = chalk.bold.blue;

const postUrl = 'https://api.imgflip.com/caption_image';
const auth = {
	username: process.env.IMGFLIP_USERNAME,
	password: process.env.IMGFLIP_PASSWORD,
};

exports.command = 'create <template> <text...>';
exports.describe = 'make a meme using the name of the template and some text';
exports.example = exports.builder = (yargs) => {};

exports.handler = (argv) => {
	if (!isNaN(argv.template)) {
		this.makeRequest({ id: argv.template }, auth, ...argv.text);
		return;
	}
	const memeTemplatesFileContents = fs.readFileSync(
		__dirname + '/templates.json'
	);
	const memes = JSON.parse(memeTemplatesFileContents).data.memes;

	const matchingMemes = memes.filter((meme) => {
		return meme.name.toLowerCase().includes(argv.template.toLowerCase());
	});

	if (matchingMemes.length > 1) {
		console.log(
			info(' found more than one matching meme \n  '),
			matchingMemes
		);
		return;
	}
	if (matchingMemes.length === 0) {
		console.log(error('this is not the meme you are looking for...'));
		return;
	}

	this.makeRequest(matchingMemes[0], auth, ...argv.text);
};

exports.makeRequest = (templateObject, auth, ...texts) => {
	let post = {
		template_id: templateObject.id,
		username: auth.username,
		password: auth.password,
	};

	if (texts.length <= 2) {
		post.text0 = texts[0];
		post.text1 = texts[1] ?? '';
	} else {
		post.boxes = buildBoxes(...texts).slice(0, memeObject.box_count);
	}

	post = qs.stringify(post);

	axios
		.post(postUrl, post, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
		})

		.then((response) => {
			if (response.data.success) {
				console.log(success('Brace yorselves, the memes are coming'));
				if (process.env.SHOULD_SAVE === 'true') {
					saveMeme(templateObject, response.data.data.url);
				} else {
					console.log(response.data);
				}
			} else {
				console.log(error(response.data));
			}
		})
		.catch((error) => {
			console.log(error);
		});
};

function buildBoxes(...texts) {
	return texts.map((thisText) => {
		return {
			text: thisText,
		};
	});
}

async function saveMeme(templateObject, imgUrl) {
	if (!fs.existsSync(__dirname + '/Downloads')) {
		fs.mkdir(__dirname + '/Downloads', { recursive: false }, (err) => {
			console.log(error(err));
			return;
		});
	}
	const fileName = getFileName(templateObject);

	await downloadImage(imgUrl, fileName);
	console.log(success('saved to', fileName));
}

function getFileName(templateObject) {
	const time = new Date().getTime().toString();
	const templateName = templateObject.name.split(' ').join('_');

	return __dirname + '/Downloads/' + templateName + '_' + time + '.jpg';
}

async function downloadImage(url, saveLocation) {
	const writer = fs.createWriteStream(saveLocation);

	const response = await axios({
		url,
		method: 'GET',
		responseType: 'stream',
	});

	await response.data.pipe(writer);
}
