import minimist from 'minimist';

export default function parseArguments() {
  const args = minimist(process.argv.slice(2));

  const port = args.port;
  const origin = args.origin;

  if (!port || !origin) {
    throw new Error('Missing --port or --origin argument');
  }

  return { port, origin };
}
