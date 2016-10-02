export default function (name) {
  let data = {};
  try {
    data = JSON.parse(fs.readFileSync(`../data/${name}.json`))
  } catch(e) {
    throw e;
  }
  
  return data;
}
