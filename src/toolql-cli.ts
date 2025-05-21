import "dotenv/config"
import { createInterface } from 'node:readline';
import { exit, stdin, stdout } from 'node:process';

export const main = () => {
  const openAiApiKey = process.env.TOOLQL_OPENAI_API_KEY
  if (!openAiApiKey) throw new Error("OpenAI API key missing, please set TOOLQL_OPENAI_API_KEY")

	const rl = createInterface({
		input: stdin,
		output: stdout,
		prompt: '- ',
	});

	console.log("Hi there, how can I help?")
	rl.prompt();

	rl.on('line', (line) => {
		if (line.match(/Chewbacca/)) {
			console.log("Ah yes, Chewbacca...");
		} else {
			console.log("I'll get back to you on that one! Anything else?")
		}
		rl.prompt();
	}).on('close', () => {
		console.log("")
		console.log('Thanks, see you soon!');
		console.log('For all your GraphQL / A.I. integration needs visit https://toolql.com');
		exit(0);
	});
}


