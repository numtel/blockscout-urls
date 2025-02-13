import {writeFileSync} from 'node:fs';

function justHost(url) {
  const match = url.match(/^https?:\/\/([^\/]+)/);
  if(!match) return null;
  return match[1];
}

const response = await fetch('https://github.com/blockscout/chainscout/raw/refs/heads/main/data/chains.json');
const data = await response.json();
const raw = []
for(let key of Object.keys(data)) {
  if(isNaN(key)) continue;
  const host = justHost(data[key].explorers[0].url);
  if(host) raw.push({ chain: Number(key), host });

}

const out = `const urls = {
${raw.map(item => `${item.chain}:'${item.host}',`).join('\n')}
}
export default urls;
`;

writeFileSync('index.js', out);
