const yargs = require('yargs');
const axios = require('axios');
const getUrl = 'https://api.imgflip.com/get_memes';
const fs = require('fs');

exports.command = 'fetch';
exports.describe =
	'get 100 most popular meme templates and write them to a file';
exports.builder = () => {}; // since this command takes no args, it doesn't actually need a builder
exports.handler = () => {
	axios
		.get(getUrl)
		.then((response) => {
			if (response.data.success === true) {
				const memeNames = response.data.data.memes.map((meme, index) => {
					return `${index+1}. ${meme.name}`
				})

				console.log(memeNames)
				
				fs.writeFile(
					__dirname + '/templates.json',
					JSON.stringify(response.data),
					(err) => {
						if (err) {
							console.log('failed to write memes to file ', err);
							return;
						}
						console.log(
							'Saved templates, Saved templates everywhere'
						);
					}
				);
			} else {
				console.log(
					'one does not simply write templates to a file without bugs'
				);
			}
		})
		.catch((error) => {
			console.log(error);
		});
};
